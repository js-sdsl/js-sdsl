// code based on https://github.com/OniVe/ts-transform-paths and https://github.com/timocov/ts-transformer-properties-rename
import fs from 'fs';
import path from 'path';
import ts, { factory } from 'typescript';

// #region dependency graph

class DependencyGraph<T> {
  private readonly graph: Map<T, Set<T>> = new Map();
  private readonly includedDependencies = new Set<T>();
  computeDependencies(sourceRoots: T[]) {
    const visited = this.includedDependencies;
    visited.clear();
    const stack = [...sourceRoots];

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
  }
  clear() {
    this.graph.clear();
  }
  isIncludedDependency(item: T) {
    return this.includedDependencies.has(item);
  }
}

class SymbolDependencyGraph extends DependencyGraph<ts.Symbol> {
  private readonly program: ts.Program;
  constructor(program: ts.Program) {
    super();
    this.program = program;
  }
  computeDependenciesFromSourceRootNames(sourceRoots: readonly string[]) {
    const symbols = sourceRoots
      .map(path => SymbolDependencyGraph.pathToSymbol(this.program, path))
      .filter((symbol): symbol is ts.Symbol => symbol !== undefined);
    this.computeDependencies(symbols);
  }
  buildGraph(typeOnly: boolean) {
    this.clear();
    const typeChecker = this.program.getTypeChecker();

    const queue: ts.Symbol[] = [];
    const visited = new Set<ts.Symbol>();

    for (const sourceFile of this.program.getSourceFiles()) {
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

    ts.forEachChild(node, node => {
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

// #endregion

// #region util

export type ClassMember =
  ts.MethodDeclaration
  | ts.PropertyDeclaration
  | ts.GetAccessorDeclaration
  | ts.SetAccessorDeclaration;

class TsUtils {
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
  static getActualSymbol(symbol: ts.Symbol, typeChecker: ts.TypeChecker): ts.Symbol {
    const tag = symbol.flags & ts.SymbolFlags.Alias;
    if (tag) {
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
    return ts.isMethodDeclaration(node) ||
      ts.isPropertyDeclaration(node) ||
      ts.isGetAccessor(node) ||
      ts.isSetAccessor(node);
  }
  static hasPrivateKeyword(node: ClassMember | ts.ParameterDeclaration): boolean {
    return TsUtils.hasModifier(node, ts.SyntaxKind.PrivateKeyword);
  }
  static hasModifier(node: ts.Node, modifier: ts.SyntaxKind): boolean {
    return node.modifiers !== undefined &&
      node.modifiers.some((mod: ts.Modifier) => mod.kind === modifier);
  }
  static getNodeJSDocComment(node: ts.Node): string {
    const start = node.getStart();
    const jsDocStart = node.getStart(undefined, true);
    return node.getSourceFile().getFullText().substring(jsDocStart, start).trim();
  }
}

// #endregion

// #region transformer

class TransformerBuilder {
  private readonly program: ts.Program;
  private readonly indexFile: string;
  private readonly extension: '.d.ts' | '.js';
  private readonly symbolGraph: SymbolDependencyGraph;
  private readonly indexOutputPath: string;
  private readonly builds: transformerConfig['builds'];
  constructor(
    program: ts.Program,
    config: transformerConfig,
    extension: '.d.ts' | '.js'
  ) {
    this.program = program;
    this.indexFile = path.isAbsolute(config.indexFile)
      ? config.indexFile
      : path.resolve(program.getCurrentDirectory(), config.indexFile);
    this.extension = extension;
    this.symbolGraph = new SymbolDependencyGraph(this.program);
    this.symbolGraph.buildGraph(this.extension === '.d.ts');
    this.indexOutputPath = path.isAbsolute(config.indexOutputPath)
      ? config.indexOutputPath
      : path.resolve(program.getCurrentDirectory(), config.indexOutputPath);
    this.builds = config.builds;
  }
  makeTransformer<T extends ts.Bundle | ts.SourceFile>(
    context: ts.TransformationContext
  ): ts.Transformer<T> {
    const visitor = (sourceFile: ts.SourceFile) => {
      if (path.resolve(sourceFile.fileName) === this.indexFile) {
        const transformResults: { [key: string]: string; } = {};
        const builds = this.builds;
        for (let i = 0; i < builds.length; ++i) {
          const build = builds[i];
          this.symbolGraph.computeDependenciesFromSourceRootNames(build.sourceRoots);
          const result = this.transformTypelevelTreeShake(sourceFile, context);
          transformResults[build.name] = ts.createPrinter().printFile(result);
        }
        const dir = path.dirname(this.indexOutputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(
          this.indexOutputPath,
          JSON.stringify(transformResults, null, 2)
        );
      }

      return sourceFile;
    };

    return TsUtils.chainBundle(visitor);
  }
  private transformTypelevelTreeShake(
    sourceFile: ts.SourceFile,
    context: ts.TransformationContext
  ): ts.SourceFile {
    const symbolGraph = this.symbolGraph;
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
        const actualSymbol = TsUtils.getActualSymbol(symbol, typeChecker);

        if (symbolGraph.isIncludedDependency(actualSymbol)) return node;

        removeStatements.add(node);
      }

      if (ts.isVariableStatement(node)) {
        const variableStatementNode = node;
        const variableDeclarationList = variableStatementNode.declarationList;

        for (const variableDeclaration of variableDeclarationList.declarations) {
          if (variableDeclaration.name === undefined) continue;

          const symbol = typeChecker.getSymbolAtLocation(variableDeclaration.name);
          if (symbol === undefined) continue;
          const actualSymbol = TsUtils.getActualSymbol(symbol, typeChecker);

          if (symbolGraph.isIncludedDependency(actualSymbol)) continue;

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

              if (symbolGraph.isIncludedDependency(actualSymbol)) {
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

              if (symbolGraph.isIncludedDependency(actualSymbol)) {
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
      .filter(node => !removeStatements.has(node));

    return factory.updateSourceFile(sourceFile, filteredChildren);
  }
}

export type transformerConfig = {
  indexOutputPath: string;
  builds: {
    name: string;
    sourceRoots: string[];
  }[];
  indexFile: string;
}

export default function transformer(program: ts.Program, config: transformerConfig) {
  const dtsBuilder = new TransformerBuilder(program, config, '.d.ts');

  function createTransformerBuilder<T extends ts.SourceFile | ts.Bundle>(
    transformer: (context: ts.TransformationContext) => ts.Transformer<T>
  ) {
    return (context: ts.TransformationContext) => transformer(context);
  }

  return {
    before: [
      createTransformerBuilder<ts.SourceFile>(dtsBuilder.makeTransformer.bind(dtsBuilder))
    ]
  };
}

// #endregion
