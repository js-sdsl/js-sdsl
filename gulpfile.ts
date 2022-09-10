import gulp from 'gulp';
import tap from 'gulp-tap';
import filter from 'gulp-filter';
import merge from 'merge-stream';
import ts from 'gulp-typescript';
import terser from 'gulp-terser';
import GulpUglify from 'gulp-uglify';
import eslint from 'gulp-eslint-new';
import babel from 'gulp-babel';
import { SrcOptions } from 'vinyl-fs';
import sourcemaps from 'gulp-sourcemaps';
import tsMacroTransformer, { macros } from 'ts-macros';
import pathsTransformer from 'ts-transform-paths';
import rollupTypescript from 'rollup-plugin-typescript2';
import { CustomTransformerFactory, Program } from 'typescript';
import minifyPrivatesTransformer from 'ts-transformer-minify-privates';

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
          tsMacroTransformer(program) as unknown as CustomTransformerFactory,
          minifyPrivatesTransformer(program)
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
        regex: /^_private_/
      }
    },
    nameCache: {}
  });
}

function rollupStream(outFileName: string) {
  return rollup({
    input: 'src/index.ts',
    output: {
      file: outFileName,
      format: 'umd',
      name: 'sdsl'
    },
    plugins: [
      rollupTypescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'ES5',
            module: 'ES2015',
            declaration: false
          }
        }
      })
    ]
  });
}

function eslintStream() {
  return eslint({
    baseConfig: {
      ignorePatterns: ['**/*.ts'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false
      },
      plugins: ['unused-imports'],
      rules: {
        'unused-imports/no-unused-imports': 'error'
      }
    },
    fix: true,
    ignore: false,
    useEslintrc: false
  });
}

function babelStream() {
  return babel({
    plugins: ['@babel/plugin-transform-modules-commonjs']
  });
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
    .pipe(eslintStream())
    .pipe(eslint.fix())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(useCjsTransform ? babelStream() : tap(() => { /* */ }))
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
    true)
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
  'performanceTest',
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
    true)
);

function gulpUmdFactory(
  input: string,
  output: string,
  uglifyOpts?: GulpUglify.Options,
  sourcemap = false
) {
  macros.clear();
  return gulp.src(`dist/umd/${output}`, { read: false, allowEmpty: true })
    .pipe(clean())
    .pipe(gulp.src(input))
    .pipe(sourcemap ? sourcemaps.init() : tap(() => { /* */ }))
    .pipe(rollupStream(output))
    .pipe(terserStream())
    .pipe(GulpUglify(uglifyOpts))
    .pipe(sourcemap ? sourcemaps.write('.') : tap(() => { /* */ }))
    .pipe(gulp.dest('dist/umd'));
}

gulp.task(
  'umd',
  () => gulpUmdFactory(
    'src/**/*.ts',
    'js-sdsl.js',
    {
      compress: false,
      output: { beautify: true },
      mangle: { keep_fnames: true }
    }
  )
);

gulp.task(
  'umd:min',
  () => gulpUmdFactory(
    'dist/umd/js-sdsl.js',
    'js-sdsl.min.js',
    {
      compress: true
    },
    true
  )
);

gulp.task('default', gulp.series('cjs', 'esm', 'umd', 'umd:min'));
