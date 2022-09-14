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
}

export class DependencySolver {
  private sourceRoots: readonly string[];
  private baseUrl?: string;
  private outDir?: string;
  private graph?: DependencyGraph;
  constructor(
    sourceRoot: string | readonly string[],
    options?: { baseUrl?: string; outDir?: string }) {
    if (options !== undefined) {
      this.baseUrl = options.baseUrl;
      this.outDir = options.outDir;
    }

    this.sourceRoots = sourceRoot instanceof Array ? sourceRoot : [sourceRoot];
    const projectPath = process.cwd();
    this.sourceRoots = this.sourceRoots
      .map((sourceRoot) => path.resolve(projectPath, sourceRoot))
      .map((sourceRoot) => this.normalizePath(sourceRoot));
  }
  private normalizePath(fileName: string) {
    return path.normalize(fileName).replace(/\\/g, '/');
  }
  private getAbsolutePath(fileName: string, requestedModule: string) {
    const dirName = path.dirname(fileName);
    const absolutePath = path.resolve(dirName, requestedModule);
    return absolutePath;
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
    const destinationPath = path.join(this.outDir, relativePath);
    return destinationPath;
  }
  setCompilerOptions(options: ts.CompilerOptions) {
    if (this.graph) {
      if (this.baseUrl || this.outDir) return;
    }

    this.baseUrl ??= options.baseUrl || __dirname;
    this.outDir ??= options.outDir || this.baseUrl;

    this.sourceRoots = this.sourceRoots
      .map((sourceRoot) => this.convertToDestinationPath(sourceRoot))
      .map((sourceRoot) => this.normalizePath(sourceRoot));

    const declarationRoots = [...this.sourceRoots]
      .map((sourceRoot) => this.replaceExtension(sourceRoot, '.d.ts'));

    const jsRoots = [...this.sourceRoots]
      .map((sourceRoot) => this.replaceExtension(sourceRoot, '.js'));

    this.graph = new DependencyGraph([...declarationRoots, ...jsRoots]);
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
    return this.graph.getIncludedDependencies();
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

export type transformerConfig = {
  solver: DependencySolver;
};

export default function transformer(config: transformerConfig) {
  return {
    after: [(context: ts.TransformationContext) => {
      config.solver.setCompilerOptions(context.getCompilerOptions());
      return new TransformerBuilder(config.solver, '.js').make<ts.SourceFile>(context);
    }],
    afterDeclarations: [(context: ts.TransformationContext) => {
      config.solver.setCompilerOptions(context.getCompilerOptions());
      return new TransformerBuilder(config.solver, '.d.ts').make(context);
    }]
  };
}

class TransformerBuilder {
  private readonly dependencySolver: DependencySolver;
  private readonly extension: '.d.ts' | '.js';
  constructor(dependencySolver: DependencySolver, extension: '.d.ts' | '.js') {
    this.dependencySolver = dependencySolver;
    this.extension = extension;
  }
  make<T extends ts.Bundle | ts.SourceFile>(
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
}
