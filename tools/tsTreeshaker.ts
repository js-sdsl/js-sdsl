// code based on ts-transform-paths
import fs from 'fs';
import path from 'path';
import ts, { factory } from 'typescript';

class DependencyGraph {
  private readonly graph: Map<string, Set<string>> = new Map();
  private readonly includedDependencies = new Set<string>();
  private graphNeedCompute = true;
  private readonly sourceRoots: readonly string[];
  constructor(sourceRoots: readonly string[]) {
    this.sourceRoots = sourceRoots;
  }
  private computeDependencies() {
    if (!this.graphNeedCompute) return;
    this.graphNeedCompute = false;

    const visited = this.includedDependencies;
    visited.clear();
    const stack = [...this.sourceRoots];

    while (stack.length > 0) {
      const current = stack.pop() as string;
      if (visited.has(current)) continue;
      visited.add(current);
      const dependencies = this.graph.get(current);
      if (dependencies !== undefined) {
        stack.push(...dependencies);
      }
    }
  }
  addDependency(from: string, to: string) {
    const deps = this.graph.get(from) || new Set();
    deps.add(to);
    this.graph.set(from, deps);
    this.graphNeedCompute = true;
  }
  getIncludedDependencies() {
    this.computeDependencies();
    return [...this.includedDependencies];
  }
  isIncludedDependency(path: string) {
    this.computeDependencies();
    return this.includedDependencies.has(path);
  }
}

export class DependencySolver {
  private sourceRoots: readonly string[];
  private forceIncludeFiles?: string[];
  private baseUrl?: string;
  private outDir?: string;
  private graph?: DependencyGraph;
  constructor(
    sourceRoot: string | readonly string[],
    options?: { baseUrl?: string; outDir?: string }
  ) {
    if (options !== undefined) {
      this.baseUrl = options.baseUrl;
      this.outDir = options.outDir;
    }

    const projectPath = process.cwd();
    this.sourceRoots = sourceRoot instanceof Array ? sourceRoot : [sourceRoot];
    this.sourceRoots = this.sourceRoots
      .map((sourceRoot) => this.normalizePath(path.resolve(projectPath, sourceRoot)));
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
  setCompilerOptions(options: ts.CompilerOptions) {
    if (this.graph) {
      if (this.baseUrl || this.outDir) return;
    }

    this.baseUrl ??= options.baseUrl || __dirname;
    this.outDir ??= options.outDir || this.baseUrl;

    this.sourceRoots = this.sourceRoots
      .map((sourceRoot) => this.normalizePath(this.convertToDestinationPath(sourceRoot)));

    const declarationRoots = [...this.sourceRoots]
      .map((sourceRoot) => this.replaceExtension(sourceRoot, '.d.ts'));

    const jsRoots = [...this.sourceRoots]
      .map((sourceRoot) => this.replaceExtension(sourceRoot, '.js'));

    this.graph = new DependencyGraph([...declarationRoots, ...jsRoots]);
  }
  setForceIncludeFiles(...files: string[]) {
    if (this.graph === undefined) throw new Error('graph is undefined');

    const projectPath = process.cwd();
    files = files.map((file) =>
      this.normalizePath(
        this.convertToDestinationPath(path.resolve(projectPath, file))
      )
    );

    this.forceIncludeFiles = [
      ...files.map((file) => this.replaceExtension(file, '.d.ts')),
      ...files.map((file) => this.replaceExtension(file, '.js'))
    ];
  }
  addNode(filePath: string, requestedModule: string, extension: '.d.ts' | '.js') {
    if (this.graph === undefined) throw new Error('graph is undefined');

    requestedModule = this.getAbsolutePath(filePath, requestedModule);
    requestedModule = requestedModule + this.getFileExtension(requestedModule);
    requestedModule = this.replaceExtension(requestedModule, extension);

    filePath = this.replaceExtension(filePath, extension);

    requestedModule = this.convertToDestinationPath(requestedModule);
    requestedModule = this.normalizePath(requestedModule);
    filePath = this.convertToDestinationPath(filePath);
    filePath = this.normalizePath(filePath);

    this.graph.addDependency(filePath, requestedModule);
  }
  getIncludedDependencies() {
    if (this.graph === undefined) throw new Error('graph is undefined');

    if (this.forceIncludeFiles !== undefined) {
      return [
        ...this.graph.getIncludedDependencies(),
        ...this.forceIncludeFiles
      ];
    }
    return this.graph.getIncludedDependencies();
  }
  isIncludedDependency(filePath: string, basePath?: string) {
    if (this.graph === undefined) throw new Error('graph is undefined');

    if (basePath !== undefined) {
      filePath = this.getAbsolutePath(basePath, filePath);
    }

    filePath = this.convertToDestinationPath(filePath);
    filePath = this.normalizePath(filePath);

    return this.graph.isIncludedDependency(filePath);
  }
}

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
        node.sourceFiles.map(transformSourceFile).filter((x): x is ts.SourceFile => !!x),
        node.prepends
      );
    }

    return function transformSourceFileOrBundle(node: T) {
      return ts.isSourceFile(node)
        ? (transformSourceFile(node) as T)
        : (transformBundle(node as ts.Bundle) as T);
    };
  }
}

class TransformerBuilder {
  private readonly dependencySolver: DependencySolver;
  private readonly indexFile?: string;
  private readonly extension: '.d.ts' | '.js';
  constructor(config: transformerConfig, extension: '.d.ts' | '.js') {
    this.dependencySolver = config.solver;
    if (config.indexFile) this.indexFile = path.resolve(process.cwd(), config.indexFile);
    this.extension = extension;
  }
  makeGraphBuilder<T extends ts.Bundle | ts.SourceFile>(
    context: ts.TransformationContext
  ): ts.Transformer<T> {
    const transformSourceFile = (sourceFile: ts.SourceFile) => {
      const pathRegistryVisitor = (node: ts.Node): ts.Node => {
        if (ts.isStringLiteral(node)) {
          this.dependencySolver.addNode(sourceFile.fileName, node.text, this.extension);
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
              const filePath = node.text + this.extension;
              if (this.dependencySolver.isIncludedDependency(filePath, sourceFile.fileName)) {
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
              const filePath = node.text + this.extension;
              if (this.dependencySolver.isIncludedDependency(filePath, sourceFile.fileName)) {
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
}

export type transformerConfig = {
  solver: DependencySolver;
  indexFile?: string;
}

export default function transformer(config: transformerConfig) {
  const jsTransformerBuilder = new TransformerBuilder(config, '.js');
  const dtsTransformerBuilder = new TransformerBuilder(config, '.d.ts');

  return {
    after: [
      (context: ts.TransformationContext) => {
        config.solver.setCompilerOptions(context.getCompilerOptions());
        return jsTransformerBuilder.makeGraphBuilder<ts.SourceFile>(context);
      },
      (context: ts.TransformationContext) => {
        if (config.indexFile) config.solver.setForceIncludeFiles(config.indexFile);
        return jsTransformerBuilder.makeIndexTransformer<ts.SourceFile>(context);
      }
    ],
    afterDeclarations: [
      (context: ts.TransformationContext) => {
        config.solver.setCompilerOptions(context.getCompilerOptions());
        return dtsTransformerBuilder.makeGraphBuilder(context);
      },
      (context: ts.TransformationContext) => {
        if (config.indexFile) config.solver.setForceIncludeFiles(config.indexFile);
        return dtsTransformerBuilder.makeIndexTransformer(context);
      }
    ]
  };
}
