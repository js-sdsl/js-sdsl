import gulp from 'gulp';
import tap from 'gulp-tap';
import filter from 'gulp-filter';
import merge from 'merge-stream';
import ts from 'gulp-typescript';
import terser from 'gulp-terser';
import GulpUglify from 'gulp-uglify';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import tsMacroTransformer, { macros } from 'ts-macros';
import pathsTransformer from 'ts-transform-paths';
import exportTransformer from './exportTransformer';
import rollupPluginTypescript from 'rollup-plugin-typescript2';
import rollupPluginDts from 'rollup-plugin-dts';
import rollupPluginTs from 'rollup-plugin-ts';
import { babel as rollupBabel } from '@rollup/plugin-babel';
import { CustomTransformerFactory, Program } from 'typescript';
import ttypescript from 'ttypescript';
import tsConfig from '../tsconfig.json';
import path from 'path';
import { SrcOptions } from 'vinyl-fs';

/* eslint-disable @typescript-eslint/no-var-requires */
const clean = require('gulp-clean') as () => NodeJS.ReadWriteStream;
const rollup = require('rollup') as typeof import('rollup');
/* eslint-enable @typescript-eslint/no-var-requires */

function createProject(overrideSettings?: ts.Settings) {
  return ts.createProject('tsconfig.json', {
    ...overrideSettings,
    getCustomTransformers: (program?: Program) => {
      if (program === undefined) throw new Error('Program is undefined');

      const pathsTransform = pathsTransformer(program);

      const overrideGetCustomTransformers = overrideSettings?.getCustomTransformers;
      if (typeof (overrideGetCustomTransformers) === 'string') {
        throw new Error('getCustomTransformers should be a function');
      }
      const customTransformers = overrideGetCustomTransformers?.(program);

      return {
        before: [
          tsMacroTransformer(program) as unknown as CustomTransformerFactory,
          ...customTransformers?.before ?? []
        ],
        after: [
          ...pathsTransform.after,
          ...customTransformers?.after ?? []
        ],
        afterDeclarations: [
          ...pathsTransform.afterDeclarations,
          ...customTransformers?.afterDeclarations ?? []
        ]
      };
    }
  });
}

function terserStream() {
  return terser({
    compress: false,
    output: {
      beautify: true
    },
    mangle: {
      keep_fnames: true,
      keep_classnames: true,
      properties: {
        regex: /^_/
      }
    },
    nameCache: {}
  });
}

async function rollupTask(
  input: string,
  output: string,
  format: 'cjs' | 'esm' | 'umd',
  sourceMap: boolean,
  overrideSettings?: Omit<ts.Settings, 'outDir'>
): Promise<void> {
  const rollupBundle = await rollup.rollup({
    input: input,
    context: 'this',
    plugins: [
      rollupPluginTypescript({
        typescript: ttypescript,
        tsconfigOverride: {
          compilerOptions: overrideSettings
        }
      }),
      rollupBabel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js'],
        plugins: ['babel-plugin-remove-unused-import']
      })
    ]
  });

  await rollupBundle.write({
    sourcemap: sourceMap,
    file: output,
    format: format,
    name: 'sdsl',
    exports: 'named'
  });

  await rollupBundle.close();
}

function babelStream(removeUnusedImport: boolean, cjsTransform: boolean) {
  return (removeUnusedImport || cjsTransform)
    ? babel({
      plugins: [
        removeUnusedImport ? 'babel-plugin-remove-unused-import' : undefined,
        cjsTransform ? '@babel/plugin-transform-modules-commonjs' : undefined
      ].filter((plugin) => plugin !== undefined) as string[]
    })
    : tap(() => { /* */ });
}

export function gulpFactory(
  input: {
    globs: string | string[],
    opts?: SrcOptions
  },
  output: string,
  overrideSettings?: Omit<ts.Settings, 'outDir'>,
  useCjsTransform = false,
  sourceMap = true
): NodeJS.ReadWriteStream {
  macros.clear();
  const tsProject = createProject({
    ...overrideSettings,
    outDir: output
  });
  const cleanStream = gulp.src(output, { read: false, allowEmpty: true })
    .pipe(clean());
  const tsBuildResult = gulp.src(input.globs, input.opts)
    .pipe(sourceMap ? sourcemaps.init() : tap(() => { /* */ }))
    .pipe(tsProject());
  const jsBuildResult = tsBuildResult.js
    .pipe(babelStream(true, useCjsTransform))
    .pipe(terserStream());
  return merge(
    cleanStream,
    merge([
      tsBuildResult.dts
        .pipe(filter(['**/*.ts', '!**/*.macro.d.ts'])),
      jsBuildResult
        .pipe(filter(['**/*.js', '!**/*.macro.js']))
        .pipe(sourceMap ? sourcemaps.write('.') : tap(() => { /* */ }))
    ])
      .pipe(gulp.dest(output))
  );
}

export function gulpUmdFactory(input: string, output: string) {
  macros.clear();

  function cleanStream() {
    return gulp
      .src([`dist/umd/${output}`], { read: false, allowEmpty: true })
      .pipe(clean());
  }

  cleanStream.displayName = 'clean';

  async function build() {
    await rollupTask(
      input,
      `dist/umd/${output}`,
      'umd',
      false,
      {
        target: 'es5'
      }
    );
  }

  build.displayName = 'build';

  return gulp.series(cleanStream, build);
}

export async function gulpUmdMinFactory(input: string, output: string) {
  macros.clear();
  return gulp
    .src([`dist/umd/${output}`, `dist/umd/${output}.map`], { read: false, allowEmpty: true })
    .pipe(clean())
    .pipe(gulp.src(input))
    .pipe(sourcemaps.init())
    .pipe(terserStream())
    .pipe(GulpUglify({ compress: true }))
    .pipe(rename(output))
    .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(gulp.dest('dist/umd'));
}

export function gulpIsolateFactory(
  format: 'cjs' | 'esm',
  input: {
    indexFile: string,
    globs: string | string[],
    opts?: SrcOptions
    sourceRoot: string
  },
  output: string,
  overrideSettings?: Omit<ts.Settings, 'outDir'>
) {
  output = `dist/isolate/${output}`;

  function cleanBuild() {
    return gulp.src(output, { read: false, allowEmpty: true })
      .pipe(clean());
  }

  cleanBuild.displayName = `${format}-clean`;

  async function buildJs() {
    macros.clear();
    const rollupBundle = await rollup.rollup({
      input: input.indexFile,
      plugins: [
        rollupPluginTs({
          browserslist: false,
          tsconfig: {
            ...tsConfig.compilerOptions as object,
            ...overrideSettings,
            declaration: false
          },
          transformers: (options) => {
            const program = options.program;
            if (program === undefined) throw new Error('program is undefined');

            const pathsTransform = pathsTransformer(program);
            const exportTransform = exportTransformer(program, {
              indexFile: input.indexFile,
              sourceRoots: [input.sourceRoot]
            });

            const overrideGetCustomTransformers = overrideSettings?.getCustomTransformers;
            if (typeof (overrideGetCustomTransformers) === 'string') {
              throw new Error('getCustomTransformers should be a function');
            }
            const customTransformers = overrideGetCustomTransformers?.(program);

            return {
              before: [
                tsMacroTransformer(program) as unknown as CustomTransformerFactory,
                ...customTransformers?.before ?? []
              ],
              after: [
                ...pathsTransform.after,
                ...exportTransform.after,
                ...customTransformers?.after ?? []
              ],
              afterDeclarations: [
                ...pathsTransform.afterDeclarations,
                ...exportTransform.afterDeclarations,
                ...customTransformers?.afterDeclarations ?? []
              ]
            };
          }
        }),
        rollupBabel({
          babelHelpers: 'bundled',
          extensions: ['.ts', '.js'],
          plugins: ['babel-plugin-remove-unused-import']
        })
      ]
    });

    await rollupBundle.write({
      sourcemap: true,
      file: `${output}/index.js`,
      format: format,
      exports: 'named'
    });

    await rollupBundle.close();
  }

  buildJs.displayName = `${format}-build-js`;

  function buildDeclaration() {
    macros.clear();
    const tsProject = createProject({
      ...overrideSettings,
      outDir: output,
      getCustomTransformers: (program?: Program) => {
        if (program === undefined) throw new Error('Program is undefined');

        const exportTransform = exportTransformer(program, {
          indexFile: input.indexFile,
          sourceRoots: [input.sourceRoot]
        });

        const overrideGetCustomTransformers = overrideSettings?.getCustomTransformers;
        if (typeof (overrideGetCustomTransformers) === 'string') {
          throw new Error('getCustomTransformers should be a function');
        }
        const customTransformers = overrideGetCustomTransformers?.(program);

        return {
          before: [
            ...customTransformers?.before ?? []
          ],
          after: [
            ...exportTransform.after,
            ...customTransformers?.after ?? []
          ],
          afterDeclarations: [
            ...exportTransform.afterDeclarations,
            ...customTransformers?.afterDeclarations ?? []
          ]
        };
      }
    });
    return gulp.src(input.globs, input.opts)
      .pipe(tsProject()).dts
      .pipe(filter(['**/*', '!**/*.macro.d.ts']))
      .pipe(gulp.dest(output));
  }

  buildDeclaration.displayName = `${format}-build-declaration`;

  async function bundleDeclaration() {
    function replaceExtension(fileName: string, extension: string) {
      const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
      return fileNameWithoutExtension + extension;
    }

    let sourceRoot = process.cwd();
    if (input.opts?.base) {
      sourceRoot = path.join(sourceRoot, input.opts.base);
    }

    {
      const indexDtsFileName = replaceExtension(input.indexFile, '.d.ts');
      const indexDtsRelativePath = path.relative(sourceRoot, indexDtsFileName);

      const rollupBundle = await rollup.rollup({
        input: `${output}/${indexDtsRelativePath}`,
        plugins: [rollupPluginDts()]
      });

      await rollupBundle.write({
        file: `${output}/${path.basename(indexDtsFileName)}`,
        format: format
      });

      await rollupBundle.close();
    }
  }

  bundleDeclaration.displayName = `${format}-bundle-declaration`;

  function afterCleanBuild() {
    return gulp.src(`${output}/*`, { read: false, allowEmpty: true })
      .pipe(filter(['**', '!index.*']))
      .pipe(clean());
  }

  afterCleanBuild.displayName = `${format}-after-clean`;

  return gulp.series(cleanBuild, buildJs, buildDeclaration, bundleDeclaration, afterCleanBuild);
}
