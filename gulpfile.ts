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
import rollupTypescript from 'rollup-plugin-typescript2';
import { babel as rollupBabel } from '@rollup/plugin-babel';
import { CustomTransformerFactory, Program } from 'typescript';
import ttypescript from 'ttypescript';

/* eslint-disable @typescript-eslint/no-var-requires */
const clean = require('gulp-clean') as () => NodeJS.ReadWriteStream;
const rollup = require('gulp-rollup-2').rollup as (...params: unknown[]) => NodeJS.ReadWriteStream;
/* eslint-enable @typescript-eslint/no-var-requires */

function createProject(overrideSettings?: ts.Settings) {
  return ts.createProject('tsconfig.json', {
    getCustomTransformers: (program?: Program) => {
      if (program === undefined) throw new Error('Program is undefined');
      return {
        ...pathsTransformer(program),
        before: [
          tsMacroTransformer(program) as unknown as CustomTransformerFactory
        ]
      };
    },
    ...overrideSettings
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

function rollupStream(input: string) {
  return rollup({
    input,
    output: {
      file: input,
      format: 'umd',
      name: 'sdsl'
    },
    context: 'this',
    plugins: [
      rollupTypescript({
        typescript: ttypescript,
        tsconfigOverride: {
          compilerOptions: {
            target: 'ES5',
            module: 'ES2015',
            declaration: true
          }
        }
      }),
      rollupBabel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js'],
        plugins: ['babel-plugin-remove-unused-import']
      })
    ]
  });
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

function filterMacros() {
  return filter(['**/*.ts', '**/*.js', '!**/*.macro.d.ts', '!**/*.macro.js']);
}

function gulpFactory(
  input: {
    globs: string | string[],
    opts?: SrcOptions
  },
  output: string,
  overrideSettings?: Omit<ts.Settings, 'outDir'>,
  useCjsTransform = false) {
  macros.clear();
  const tsProject = createProject({
    ...overrideSettings,
    outDir: output
  });
  const cleanStream = gulp.src(output, { read: false, allowEmpty: true })
    .pipe(clean());
  const tsBuildResult = gulp.src(input.globs, input.opts)
    .pipe(tsProject());
  const jsBuildResult = tsBuildResult.js
    .pipe(babelStream(true, useCjsTransform))
    .pipe(terserStream());
  return merge(
    cleanStream,
    merge([tsBuildResult.dts, jsBuildResult])
      .pipe(filterMacros())
      .pipe(gulp.dest(output)));
}

gulp.task(
  'cjs',
  () => gulpFactory(
    { globs: 'src/**/*.ts' },
    'dist/cjs',
    {
      module: 'ES2015',
      declaration: true
    },
    true
  )
);

gulp.task(
  'esm',
  () => gulpFactory(
    { globs: 'src/**/*.ts' },
    'dist/esm',
    {
      target: 'ES5',
      module: 'ES2015',
      declaration: true
    })
);

gulp.task(
  'performance',
  () => gulpFactory(
    {
      globs: [
        'src/**/*.ts',
        'performance/**/*.ts'
      ],
      opts: {
        base: '.'
      }
    },
    'dist/performance',
    {
      module: 'ES2015',
      declaration: false
    },
    true
  )
);

function gulpUmdFactory(input: string, output: string) {
  macros.clear();
  return gulp
    .src([`dist/umd/${output}`], { read: false, allowEmpty: true })
    .pipe(clean())
    .pipe(gulp.src(input))
    .pipe(rollupStream(input))
    .pipe(terserStream())
    .pipe(rename(output))
    .pipe(gulp.dest('dist/umd'));
}

function gulpUmdMinFactory(input: string, output: string) {
  macros.clear();
  return gulp
    .src([`dist/umd/${output}`, `dist/umd/${output}.map`], { read: false, allowEmpty: true })
    .pipe(clean())
    .pipe(gulp.src(input))
    .pipe(sourcemaps.init())
    .pipe(GulpUglify({ compress: true }))
    .pipe(rename(output))
    .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(gulp.dest('dist/umd'));
}

gulp.task(
  'umd',
  () => gulpUmdFactory(
    'src/index.ts',
    'js-sdsl.js'
  )
);

gulp.task(
  'umd:min',
  () => gulpUmdMinFactory(
    'dist/umd/js-sdsl.js',
    'js-sdsl.min.js'
  )
);

gulp.task('default', gulp.series('cjs', 'esm', 'umd', 'umd:min'));
