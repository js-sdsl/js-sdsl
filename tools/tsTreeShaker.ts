// code based on ts-transform-paths and  ts-transformer-properties-rename
import fs from 'fs';
import path from 'path';
import ts, { factory } from 'typescript';

class DependencyGraph<T> {
  private readonly graph: Map<T, Set<T>> = new Map();
  private readonly includedDependencies = new Set<T>();
  private graphNeedCompute = true;
  protected readonly sourceRoots: readonly T[];
  constructor(sourceRoots: readonly T[]) {
    this.sourceRoots = sourceRoots;
  }
  private computeDependencies() {
    if (!this.graphNeedCompute) return;
    this.graphNeedCompute = false;

    const visited = this.includedDependencies;
    visited.clear();
    const stack = [...this.sourceRoots];

    while (stack.length > 0) {
      const current = stack.pop() as T;
      if (visited.has(current)) continue;
      visited.add(current);
      const dependencies = this.graph.get(current);
      if (dependencies !== undefined) {
        stack.push(...dependencies);
      }
    }
  }
  addDependency(from: T, to: T) {
    const deps = this.graph.get(from) || new Set();
    deps.add(to);
    this.graph.set(from, deps);
    this.graphNeedCompute = true;
  }
  clear() {
    this.graph.clear();
    this.graphNeedCompute = true;
  }
  getIncludedDependencies() {
    this.computeDependencies();
    return [...this.includedDependencies];
  }
  isIncludedDependency(item: T) {
    this.computeDependencies();
    return this.includedDependencies.has(item);
  }
}

class SymbolDependencyGraph extends DependencyGraph<ts.Symbol> {
  private program: ts.Program;
  constructor(program: ts.Program, sourceRoots: readonly string[]) {
    super(
      sourceRoots
        .map((path) => SymbolDependencyGraph.pathToSymbol(program, path))
        .filter((symbol): symbol is ts.Symbol => symbol !== undefined)

    );

    this.program = program;
  }
  buildGraph(typeOnly: boolean) {
    this.clear();

    const typeChecker = this.program.getTypeChecker();

    const queue: ts.Symbol[] = [];
    const visited = new Set<ts.Symbol>();

    const sourceFiles = this.program.getSourceFiles();

    for (const sourceFile of sourceFiles) {
      const sourceSymbol = typeChecker.getSymbolAtLocation(sourceFile);
      if (sourceSymbol === undefined) continue;
      for (const entryExportSymbol of TsUtils.getExportsForSourceFile(typeChecker, sourceSymbol)) {
        this.addDependency(sourceSymbol, entryExportSymbol);
        queue.push(entryExportSymbol);
      }
    }

    while (queue.length > 0) {
      const current = queue.pop() as ts.Symbol;

      if (visited.has(current)) continue;
      visited.add(current);

      // if symbol is from a node_modules package, skip it
      if (
        current.valueDeclaration !== undefined &&
        current.valueDeclaration.getSourceFile().fileName.includes('node_modules')
      ) {
        continue;
      }

      const dependencies = new Set<ts.Symbol>();
      for (const currentDeclarations of TsUtils.getDeclarationsForSymbol(current)) {
        SymbolDependencyGraph.getDependencySymbols(
          typeChecker, currentDeclarations, dependencies, typeOnly);
      }

      for (const dependency of dependencies) {
        this.addDependency(current, dependency);
        queue.push(dependency);
      }
    }
  }
  private static getDependencySymbols(
    typeChecker: ts.TypeChecker,
    node: ts.Node,
    symbols: Set<ts.Symbol>,
    typeOnly: boolean
  ) {
    if (typeOnly) {
      // ignore function body
      if (ts.isBlock(node)) return;
      
      // ignore private/internal properties
      if (TsUtils.isClassMember(node)) {
        if (TsUtils.hasPrivateKeyword(node)) return;
        else if (TsUtils.getNodeJSDocComment(node).includes('@internal')) return;
      }
    }

    // get function return type
    if (ts.isFunctionLike(node)) {
      const type = typeChecker.getTypeAtLocation(node);
      const symbol = type.getSymbol();
      if (symbol !== undefined) {
        const actualSymbol = TsUtils.getActualSymbol(symbol, typeChecker);
        symbols.add(actualSymbol);
      }
    }

    // get identifier type
    if (ts.isIdentifier(node)) {
      const symbol = typeChecker.getSymbolAtLocation(node);
      if (symbol !== undefined) {
        const actualSymbol = TsUtils.getActualSymbol(symbol, typeChecker);
        symbols.add(actualSymbol);
      }
    }

    ts.forEachChild(node, (node) => {
      SymbolDependencyGraph.getDependencySymbols(typeChecker, node, symbols, typeOnly);
    });
  }
  private static pathToSymbol(program: ts.Program, path: string): ts.Symbol | undefined {
    const typeChecker = program.getTypeChecker();
    const sourceFile = program.getSourceFile(path);
    if (sourceFile === undefined) {
      throw new Error(`Cannot find source file ${path}`);
    }
    return typeChecker.getSymbolAtLocation(sourceFile);
  }
}

export class DependencySolver {
  private sourceRoots: readonly string[];
  private forceIncludeFiles?: string[];
  private baseUrl?: string;
  private outDir?: string;
  private fileGraph?: DependencyGraph<string>;
  private symbolGraph?: SymbolDependencyGraph;
  constructor(
    sourceRoot: string | readonly string[],
    options?: { baseUrl?: string; outDir?: string }
  ) {
    if (options !== undefined) {
      this.baseUrl = options.baseUrl;
      this.outDir = options.outDir;
    }

    this.sourceRoots = sourceRoot instanceof Array ? sourceRoot : [sourceRoot];
  }
  private normalizePath(fileName: string) {
    return path.normalize(fileName).replace(/\\/g, '/');
  }
  private getAbsolutePath(fileName: string, requestedModule: string) {
    const dirName = path.dirname(fileName);
    return path.resolve(dirName, requestedModule);
  }
  private replaceExtension(fileName: string, extension: string) {
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    return fileNameWithoutExtension + extension;
  }
  private getFileExtension(extensionTrimmedPath: string) {
    const extensionTrimmedFileName = path.basename(extensionTrimmedPath);
    const files = fs.readdirSync(path.dirname(extensionTrimmedPath));
    const file = files.find((file) => file.startsWith(extensionTrimmedFileName));
    if (file === undefined) throw new Error(`File ${extensionTrimmedFileName} not found`);
    return path.extname(file);
  }
  private convertToDestinationPath(filePath: string) {
    if (this.baseUrl === undefined) throw new Error('baseUrl is undefined');
    if (this.outDir === undefined) throw new Error('outDir is undefined');
    const relativePath = path.relative(this.baseUrl, filePath);
    return path.join(this.outDir, relativePath);
  }
  initialize(program: ts.Program, config: transformerConfig) {
    // resolve sorceRoots
    const projectPath = program.getCurrentDirectory();
    this.sourceRoots = this.sourceRoots
      .map((sourceRoot) => path.resolve(projectPath, sourceRoot));

    // convert to destination paths
    const options = program.getCompilerOptions();

    this.baseUrl ??= options.baseUrl || __dirname;
    this.outDir ??= options.outDir || this.baseUrl;

    // create symbol graph
    this.symbolGraph = new SymbolDependencyGraph(program, this.sourceRoots);

    this.sourceRoots = this.sourceRoots
      .map((sourceRoot) => this.normalizePath(this.convertToDestinationPath(sourceRoot)));

    const declarationRoots = this.sourceRoots
      .map((sourceRoot) => this.replaceExtension(sourceRoot, '.d.ts'));

    const jsRoots = this.sourceRoots
      .map((sourceRoot) => this.replaceExtension(sourceRoot, '.js'));

    // create file graph
    this.fileGraph = new DependencyGraph([...declarationRoots, ...jsRoots]);

    // set force include files
    const files = [config.indexFile]
      .filter((file): file is string => file !== undefined)
      .map((file) =>
        this.normalizePath(
          this.convertToDestinationPath(path.resolve(projectPath, file))
        )
      );

    this.forceIncludeFiles = [
      ...files.map((file) => this.replaceExtension(file, '.d.ts')),
      ...files.map((file) => this.replaceExtension(file, '.js'))
    ];
  }
  dispose() {
    this.sourceRoots = [];
    this.forceIncludeFiles = undefined;
    this.baseUrl = undefined;
    this.outDir = undefined;
    this.fileGraph?.clear();
    this.symbolGraph?.clear();
    this.fileGraph = undefined;
    this.symbolGraph = undefined;
  }
  addFileNode(filePath: string, requestedModule: string, extension: '.d.ts' | '.js') {
    if (this.fileGraph === undefined) throw new Error('graph is undefined');

    requestedModule = this.getAbsolutePath(filePath, requestedModule);

    if (fs.existsSync(requestedModule) && fs.lstatSync(requestedModule).isDirectory()) {
      requestedModule = path.join(requestedModule, 'index');
    }

    requestedModule = requestedModule + this.getFileExtension(requestedModule);
    requestedModule = this.replaceExtension(requestedModule, extension);

    filePath = this.replaceExtension(filePath, extension);

    requestedModule = this.convertToDestinationPath(requestedModule);
    requestedModule = this.normalizePath(requestedModule);
    filePath = this.convertToDestinationPath(filePath);
    filePath = this.normalizePath(filePath);

    this.fileGraph.addDependency(filePath, requestedModule);
  }
  getIncludedFileDependencies() {
    if (this.fileGraph === undefined) throw new Error('graph is undefined');

    if (this.forceIncludeFiles !== undefined) {
      return [
        ...this.fileGraph.getIncludedDependencies(),
        ...this.forceIncludeFiles
      ];
    }
    return this.fileGraph.getIncludedDependencies();
  }
  isIncludedFileDependency(filePath: string, basePath?: string, overrideExtension?: string) {
    if (this.fileGraph === undefined) throw new Error('graph is undefined');

    if (basePath !== undefined) {
      filePath = this.getAbsolutePath(basePath, filePath);
    }

    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index');
    }

    if (overrideExtension !== undefined) {
      filePath = this.replaceExtension(filePath, overrideExtension);
    }

    filePath = this.convertToDestinationPath(filePath);
    filePath = this.normalizePath(filePath);

    return this.fileGraph.isIncludedDependency(filePath);
  }
  buildSymbolGraph(typeOnly: boolean) {
    if (this.symbolGraph === undefined) throw new Error('symbolGraph is undefined');
    this.symbolGraph.buildGraph(typeOnly);
  }
  getIncludedSymbolDependencies() {
    if (this.symbolGraph === undefined) throw new Error('symbolGraph is undefined');
    return this.symbolGraph.getIncludedDependencies();
  }
  isIncludedSymbolDependency(symbol: ts.Symbol) {
    if (this.symbolGraph === undefined) throw new Error('symbolGraph is undefined');
    return this.symbolGraph.isIncludedDependency(symbol);
  }
}

export type ClassMember =
  ts.MethodDeclaration
  | ts.PropertyDeclaration
  | ts.GetAccessorDeclaration
  | ts.SetAccessorDeclaration;

class TsUtils {
  static isRequireCall(
    node: ts.Node,
    checkArgumentIsStringLiteralLike: boolean
  ): node is ts.CallExpression {
    if (!ts.isCallExpression(node)) {
      return false;
    }
    const { expression, arguments: args } = node;
    if (!ts.isIdentifier(expression) || expression.escapedText !== 'require') {
      return false;
    }
    if (args.length !== 1) {
      return false;
    }
    const [arg] = args;

    return !checkArgumentIsStringLiteralLike || ts.isStringLiteralLike(arg);
  }
  static isImportCall(node: ts.Node): node is ts.CallExpression {
    return (
      ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
    );
  }
  static chainBundle<T extends ts.SourceFile | ts.Bundle>(
    transformSourceFile: (x: ts.SourceFile) => ts.SourceFile | undefined
  ): (x: T) => T {
    function transformBundle(node: ts.Bundle) {
      return factory.createBundle(
        node.sourceFiles.map(transformSourceFile).filter((x): x is ts.SourceFile => Boolean(x)),
        node.prepends
      );
    }

    return function transformSourceFileOrBundle(node: T) {
      return ts.isSourceFile(node)
        ? (transformSourceFile(node) as T)
        : (transformBundle(node as ts.Bundle) as T);
    };
  }
  static saveSourceFile(sourceFile: ts.SourceFile, filePath: string) {
    const printer = ts.createPrinter();
    const source = printer.printFile(sourceFile);
    fs.writeFileSync(filePath, source);
  }
  static getActualSymbol(symbol: ts.Symbol, typeChecker: ts.TypeChecker): ts.Symbol {
    if (symbol.flags & ts.SymbolFlags.Alias) {
      symbol = typeChecker.getAliasedSymbol(symbol);
    }

    return symbol;
  }
  static getDeclarationsForSymbol(symbol: ts.Symbol): ts.Declaration[] {
    const result: ts.Declaration[] = [];

    if (symbol.declarations !== undefined) {
      result.push(...symbol.declarations);
    }

    if (symbol.valueDeclaration !== undefined) {
      // push valueDeclaration might be already in declarations array
      // so let's check first to avoid duplication nodes
      if (!result.includes(symbol.valueDeclaration)) {
        result.push(symbol.valueDeclaration);
      }
    }

    return result;
  }
  static getExportsForSourceFile(
    typeChecker: ts.TypeChecker,
    sourceFileSymbol: ts.Symbol
  ): ts.Symbol[] {
    if (sourceFileSymbol.exports !== undefined) {
      const commonJsExport = sourceFileSymbol.exports.get(ts.InternalSymbolName.ExportEquals);
      if (commonJsExport !== undefined) {
        return [
          TsUtils.getActualSymbol(commonJsExport, typeChecker)
        ];
      }
    }

    const result: ts.Symbol[] = typeChecker.getExportsOfModule(sourceFileSymbol);

    if (sourceFileSymbol.exports !== undefined) {
      const defaultExportSymbol = sourceFileSymbol.exports.get(ts.InternalSymbolName.Default);
      if (defaultExportSymbol !== undefined) {
        if (!result.includes(defaultExportSymbol)) {
          // it seems that default export is always returned by getExportsOfModule
          // but let's add it to be sure add if there is no such export
          result.push(defaultExportSymbol);
        }
      }
    }

    return result.map((symbol: ts.Symbol) => TsUtils.getActualSymbol(symbol, typeChecker));
  }
  static isClassMember(node: ts.Node): node is ClassMember {
    return ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node);
  }
  static hasPrivateKeyword(node: ClassMember | ts.ParameterDeclaration): boolean {
    return TsUtils.hasModifier(node, ts.SyntaxKind.PrivateKeyword);
  }
  static hasModifier(node: ts.Node, modifier: ts.SyntaxKind): boolean {
    return node.modifiers !== undefined && node.modifiers.some((mod: ts.Modifier) => mod.kind === modifier);
  }
  static getNodeJSDocComment(node: ts.Node): string {
    const start = node.getStart();
    const jsDocStart = node.getStart(undefined, true);
    return node.getSourceFile().getFullText().substring(jsDocStart, start).trim();
  }
}

class TransformerBuilder {
  private readonly program: ts.Program;
  private readonly dependencySolver: DependencySolver;
  private readonly indexFile?: string;
  private readonly extension: '.d.ts' | '.js';
  constructor(
    program: ts.Program,
    config: transformerConfig,
    extension: '.d.ts' | '.js'
  ) {
    this.program = program;
    this.dependencySolver = config.solver;
    if (config.indexFile) {
      this.indexFile = path.resolve(program.getCurrentDirectory(), config.indexFile);
    }
    this.extension = extension;

    // build graph
    this.dependencySolver.buildSymbolGraph(extension === '.d.ts');
  }
  makeGraphBuilder<T extends ts.Bundle | ts.SourceFile>(
    context: ts.TransformationContext
  ): ts.Transformer<T> {
    const transformSourceFile = (sourceFile: ts.SourceFile) => {
      const pathRegistryVisitor = (node: ts.Node): ts.Node => {
        if (ts.isStringLiteral(node)) {
          this.dependencySolver.addFileNode(sourceFile.fileName, node.text, this.extension);
        }
        return ts.visitEachChild(node, pathRegistryVisitor, context);
      };

      const visitor = (node: ts.Node): ts.Node => {
        /**
         * e.g.
         * - const x = require('path');
         * - const x = import('path');
         */
        if (TsUtils.isRequireCall(node, false) || TsUtils.isImportCall(node)) {
          return ts.visitEachChild(node, pathRegistryVisitor, context);
        }

        /**
         * e.g.
         * - type Foo = import('path').Foo;
         */
        if (ts.isImportTypeNode(node)) {
          return ts.visitEachChild(node, pathRegistryVisitor, context);
        }

        /**
         * e.g.
         * - import * as x from 'path';
         * - import { x } from 'path';
         */
        if (
          ts.isImportDeclaration(node) &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          return ts.visitEachChild(node, pathRegistryVisitor, context);
        }

        /**
         * e.g.
         * - export { x } from 'path';
         */
        if (
          ts.isExportDeclaration(node) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          return ts.visitEachChild(node, pathRegistryVisitor, context);
        }

        return ts.visitEachChild(node, visitor, context);
      };

      return ts.visitEachChild(sourceFile, visitor, context);
    };

    return TsUtils.chainBundle(transformSourceFile);
  }
  makeIndexTransformer<T extends ts.Bundle | ts.SourceFile>(
    context: ts.TransformationContext
  ): ts.Transformer<T> {
    if (this.indexFile === undefined) {
      return (x) => x;
    }

    const transformSourceFile = (sourceFile: ts.SourceFile) => {
      if (path.resolve(sourceFile.fileName) !== this.indexFile) {
        return sourceFile;
      }

      const usedImportExports = new Set<ts.ImportDeclaration | ts.ExportDeclaration>();

      const visitor = (node: ts.Node): ts.Node => {
        /**
         * e.g.
         * - import * as x from 'path';
         * - import { x } from 'path';
         */
        if (
          ts.isImportDeclaration(node) &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          const importNode = node;
          const importVisitor = (node: ts.Node): ts.Node => {
            if (ts.isStringLiteral(node)) {
              if (this.dependencySolver.isIncludedFileDependency(
                node.text,
                sourceFile.fileName,
                this.extension
              )) {
                usedImportExports.add(importNode);
              }
            }
            return ts.visitEachChild(node, importVisitor, context);
          };

          return ts.visitEachChild(node, importVisitor, context);
        }

        /**
         * e.g.
         * - export { x } from 'path';
         */
        if (
          ts.isExportDeclaration(node) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          const exportNode = node;
          const importVisitor = (node: ts.Node): ts.Node => {
            if (ts.isStringLiteral(node)) {
              if (this.dependencySolver.isIncludedFileDependency(
                node.text,
                sourceFile.fileName,
                this.extension
              )) {
                usedImportExports.add(exportNode);
              }
            }
            return ts.visitEachChild(node, importVisitor, context);
          };

          return ts.visitEachChild(node, importVisitor, context);
        }

        return ts.visitEachChild(node, visitor, context);
      };

      ts.visitEachChild(sourceFile, visitor, context);

      const filteredChildren = sourceFile.statements.filter((node) => {
        if (ts.isImportDeclaration(node)) {
          return usedImportExports.has(node);
        } else if (ts.isExportDeclaration(node)) {
          return usedImportExports.has(node);
        }
        return true;
      });

      return factory.updateSourceFile(sourceFile, filteredChildren);
    };

    return TsUtils.chainBundle(transformSourceFile);
  }
  makeTypelevelTreeShakeTransformer<T extends ts.Bundle | ts.SourceFile>(
    context: ts.TransformationContext
  ): ts.Transformer<T> {
    const transformSourceFile = (sourceFile: ts.SourceFile) => {
      const typeChecker = this.program.getTypeChecker();

      // #region collect remove statements
      const removeStatements = new Set<ts.Statement>();

      const removeStatementsCollectvisitor = (node: ts.Node): ts.Node => {
        if (ts.isClassDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isFunctionDeclaration(node)
        ) {
          if (node.name === undefined) return node;

          const symbol = typeChecker.getSymbolAtLocation(node.name);
          if (symbol === undefined) return node;

          if (this.dependencySolver.isIncludedSymbolDependency(symbol)) return node;

          removeStatements.add(node);
        }

        if (ts.isVariableStatement(node)) {
          const variableStatementNode = node;
          const variableDeclarationList = variableStatementNode.declarationList;

          for (const variableDeclaration of variableDeclarationList.declarations) {
            if (variableDeclaration.name === undefined) continue;

            const symbol = typeChecker.getSymbolAtLocation(variableDeclaration.name);
            if (symbol === undefined) continue;

            if (this.dependencySolver.isIncludedSymbolDependency(symbol)) continue;

            removeStatements.add(variableStatementNode);
          }
        }

        return node;
      };

      ts.visitEachChild(sourceFile, removeStatementsCollectvisitor, context);
      // #endregion

      // #region replace and collect import/export statements
      const replaceImportExportStatementsVisitor = (node: ts.Node): ts.Node => {
        if (ts.isImportDeclaration(node)) {
          const importNode = node;

          // import * as x from 'path'; <-- this will not be removed
          if (importNode.importClause === undefined) return node;

          // import { x, y } from 'path'; <-- this will be removed or replaced
          const namedImportsVisitor = (node: ts.Node): ts.Node => {
            if (ts.isNamedImports(node)) {
              const namedImportsNode = node;

              const includeChildren: ts.ImportSpecifier[] = [];
              for (const importSpecifier of namedImportsNode.elements) {
                const childSymbol = typeChecker.getSymbolAtLocation(importSpecifier.name);
                if (childSymbol === undefined) continue;

                const actualSymbol = TsUtils.getActualSymbol(childSymbol, typeChecker);

                if (this.dependencySolver.isIncludedSymbolDependency(actualSymbol)) {
                  includeChildren.push(importSpecifier);
                }
              }

              if (includeChildren.length === 0) {
                removeStatements.add(importNode);
                return node;
              }

              if (includeChildren.length === namedImportsNode.elements.length) {
                return node;
              }

              return factory.createNamedImports(includeChildren);
            }

            return ts.visitEachChild(node, namedImportsVisitor, context);
          };

          return ts.visitEachChild(node, namedImportsVisitor, context);
        }

        if (ts.isExportDeclaration(node)) {
          const exportNode = node;

          // export * from 'path'; <-- this will not be removed
          if (exportNode.exportClause === undefined) return node;

          // export { x, y } from 'path'; <-- this will be removed or replaced
          const namedExportsVisitor = (node: ts.Node): ts.Node => {
            if (ts.isNamedExports(node)) {
              const namedExportsNode = node;

              const includeChildren: ts.ExportSpecifier[] = [];
              for (const exportSpecifier of namedExportsNode.elements) {
                const childSymbol = typeChecker.getSymbolAtLocation(exportSpecifier.name);
                if (childSymbol === undefined) {
                  includeChildren.push(exportSpecifier);
                  continue;
                }

                const actualSymbol = TsUtils.getActualSymbol(childSymbol, typeChecker);

                if (this.dependencySolver.isIncludedSymbolDependency(actualSymbol)) {
                  includeChildren.push(exportSpecifier);
                }
              }

              if (includeChildren.length === 0) {
                removeStatements.add(exportNode);
                return node;
              }

              if (includeChildren.length === namedExportsNode.elements.length) {
                return node;
              }

              return factory.createNamedExports(includeChildren);
            }

            return ts.visitEachChild(node, namedExportsVisitor, context);
          };

          return ts.visitEachChild(node, namedExportsVisitor, context);
        }

        return node;
      };

      sourceFile = ts.visitEachChild(sourceFile, replaceImportExportStatementsVisitor, context);
      // #endregion

      const filteredChildren = sourceFile.statements
        .filter((node) => !removeStatements.has(node));

      return factory.updateSourceFile(sourceFile, filteredChildren);
    };

    return TsUtils.chainBundle(transformSourceFile);
  }
}

export type transformerConfig = {
  solver: DependencySolver;
  indexFile?: string;
}

export default function transformer(program: ts.Program, config: transformerConfig) {
  config.solver.initialize(program, config);
  const jsBuilder = new TransformerBuilder(program, config, '.js');
  const dtsBuilder = new TransformerBuilder(program, config, '.d.ts');

  function createTransformerBuilder(
    transformer: (context: ts.TransformationContext
  ) => ts.Transformer<ts.SourceFile | ts.Bundle>) {
    return (context: ts.TransformationContext) => transformer(context);
  }

  return {
    after: [
      createTransformerBuilder(jsBuilder.makeGraphBuilder.bind(jsBuilder)),
      createTransformerBuilder(jsBuilder.makeIndexTransformer.bind(dtsBuilder)),
      createTransformerBuilder(jsBuilder.makeTypelevelTreeShakeTransformer.bind(jsBuilder))
    ],
    afterDeclarations: [
      createTransformerBuilder(dtsBuilder.makeGraphBuilder.bind(dtsBuilder)),
      createTransformerBuilder(dtsBuilder.makeIndexTransformer.bind(dtsBuilder)),
      createTransformerBuilder(dtsBuilder.makeTypelevelTreeShakeTransformer.bind(dtsBuilder))
    ]
  };
}
