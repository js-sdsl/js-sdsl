import gulp from 'gulp';
import tap from 'gulp-tap';
import filter from 'gulp-filter';
import merge from 'merge-stream';
import ts from 'gulp-typescript';
import terser from 'gulp-terser';
import GulpUglify from 'gulp-uglify';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import { SrcOptions } from 'vinyl-fs';
import sourcemaps from 'gulp-sourcemaps';
import tsMacroTransformer, { macros } from 'ts-macros';
import pathsTransformer from 'ts-transform-paths';
import rollupPluginTs from 'rollup-plugin-ts';
import { babel as rollupBabel } from '@rollup/plugin-babel';
import { CustomTransformerFactory, Program } from 'typescript';
import ttypescript from 'ttypescript';
import tsConfig from '../tsconfig.json';

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
    input,
    context: 'this',
    plugins: [
      rollupPluginTs({
        typescript: ttypescript,
        tsconfig: {
          ...tsConfig.compilerOptions as unknown as object,
          ...overrideSettings
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
    format,
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
    sourceRoot: string
  },
  output: string,
  overrideSettings?: Omit<ts.Settings, 'outDir'>
) {
  function cleanStream() {
    return gulp
      .src([`dist/isolate/${output}`], { read: false, allowEmpty: true })
      .pipe(clean());
  }

  cleanStream.displayName = `${format}-clean`;

  async function rollupBuild() {
    await rollupTask(
      input.sourceRoot,
      `dist/isolate/${output}/index.js`,
      format,
      true,
      overrideSettings
    );
  }

  rollupBuild.displayName = `${format}-rollup`;

  function mangle() {
    return gulp
      .src([`dist/isolate/${output}/index.js`])
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(terserStream())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`dist/isolate/${output}`));
  }

  mangle.displayName = `${format}-mangle`;

  return gulp.series(cleanStream, rollupBuild, mangle);
}
