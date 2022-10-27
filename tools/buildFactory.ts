import gulp from 'gulp';
import tap from 'gulp-tap';
import filter from 'gulp-filter';
import merge from 'merge-stream';
import gulpTs from 'gulp-typescript';
import terser from 'gulp-terser';
import GulpUglify from 'gulp-uglify';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import tsMacroTransformer from 'ts-macros';
import pathsTransformer from 'ts-transform-paths';
import exportTransformer from './exportTransformer';
import rollupPluginTypescript from '@rollup/plugin-typescript';
import rollupPluginTs from 'rollup-plugin-ts';
import { babel as rollupBabel } from '@rollup/plugin-babel';
import ts from 'typescript';
import ttypescript from 'ttypescript';
import tsConfig from '../tsconfig.json';
import fs from 'fs';
import path from 'path';
import { SrcOptions } from 'vinyl-fs';
import crypto from 'crypto';
import glob from 'glob';

/* eslint-disable @typescript-eslint/no-var-requires */
const clean = require('gulp-clean') as () => NodeJS.ReadWriteStream;
const rollup = require('rollup') as typeof import('rollup');
/* eslint-enable @typescript-eslint/no-var-requires */

function createProject(overrideSettings?: gulpTs.Settings) {
  return gulpTs.createProject('tsconfig.json', {
    ...overrideSettings,
    getCustomTransformers: (program?: ts.Program) => {
      if (program === undefined) throw new Error('Program is undefined');

      const pathsTransform = pathsTransformer(program);

      const overrideGetCustomTransformers = overrideSettings?.getCustomTransformers;
      if (typeof (overrideGetCustomTransformers) === 'string') {
        throw new Error('getCustomTransformers should be a function');
      }
      const customTransformers = overrideGetCustomTransformers?.(program);

      return {
        before: [
          tsMacroTransformer(program) as unknown as ts.CustomTransformerFactory,
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
  overrideSettings?: Omit<gulpTs.Settings, 'outDir'>
): Promise<void> {
  const rollupBundle = await rollup.rollup({
    input,
    context: 'this',
    plugins: [
      rollupPluginTypescript({
        typescript: ttypescript,
        compilerOptions: overrideSettings
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
  overrideSettings?: Omit<gulpTs.Settings, 'outDir'>,
  useCjsTransform = false,
  sourceMap = true,
  project: { ref?: gulpTs.Project } = { }
): NodeJS.ReadWriteStream {
  let tsProject = project.ref;
  if (tsProject === undefined) {
    tsProject = project.ref = createProject({
      ...overrideSettings,
      outDir: output
    });
  }
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
    isolateBuildConfig: {
      builds: {
        name: string,
        sourceRoot: string
      }[]
    },
    buildName: string,
    globs: string | string[],
    opts?: SrcOptions
  },
  output: string,
  overrideSettings?: Omit<gulpTs.Settings, 'outDir'>
) {
  output = `dist/isolate/${output}`;
  const buildDataDir = 'dist/isolate/.build-data';

  async function generateIndex() {
    // get files from glob
    const globs = Array.isArray(input.globs) ? input.globs : [input.globs];
    const files = globs
      .map((pattern) => glob.sync(pattern, input.opts))
      .reduce((acc, val) => acc.concat(val), []);
    // generate sha256 hash of the source code
    const hash = crypto.createHash('sha256');
    hash.update(input.isolateBuildConfig.toString());
    files.forEach((file) => hash.update(fs.readFileSync(file)));
    const hashValue = hash.digest('hex');
    // compare hash with the previous one
    const previousHash = fs.existsSync(`${buildDataDir}/hash`)
      ? fs.readFileSync(`${buildDataDir}/hash`, 'utf8')
      : '';
    if (previousHash === hashValue) return;
    // generate index file
    const project = gulpTs.createProject('tsconfig.json', {
      target: 'ESNext',
      declaration: true,
      getCustomTransformers: (program) => {
        if (program === undefined) throw new Error('program is undefined');
        return exportTransformer(program, {
          indexOutputPath: `${buildDataDir}/transformed-index.json`,
          indexFile: input.indexFile,
          builds: input.isolateBuildConfig.builds
            .map((build) => ({ name: build.name, sourceRoots: [build.sourceRoot] }))
        });
      }
    });
    await new Promise((resolve) => {
      gulp.src(input.globs, input.opts)
        .pipe(project())
        .on('error', (e) => {
          throw new Error(e);
        })
        .on('end', resolve)
        .on('finish', resolve);
    });
    // save hash
    fs.mkdirSync(buildDataDir, { recursive: true });
    fs.writeFileSync(`${buildDataDir}/hash`, hashValue);
  }

  generateIndex.displayName = `${format}-generate-index`;

  function cleanBuild() {
    return gulp.src(output, { read: false, allowEmpty: true })
      .pipe(clean());
  }

  cleanBuild.displayName = `${format}-clean`;

  const copyDir = `${buildDataDir}/copied-source`;
  const relativeIndexFilePath = path.relative('.', input.indexFile);
  const copyIndexFilePath = path.join(copyDir, relativeIndexFilePath);

  async function copySource() {
    if (fs.existsSync(copyDir)) fs.rmSync(copyDir, { recursive: true });
    fs.mkdirSync(copyDir, { recursive: true });
    // copy tsconfig.json
    fs.copyFileSync('tsconfig.json', path.join(copyDir, 'tsconfig.json'));
    // copy source files
    const globs = Array.isArray(input.globs) ? input.globs : [input.globs];
    const files = globs
      .map((pattern) => glob.sync(pattern, input.opts))
      .reduce((acc, val) => acc.concat(val), []);
    files.forEach((file) => {
      const relativeFilePath = path.relative('.', file);
      const copyFilePath = path.join(copyDir, relativeFilePath);
      fs.mkdirSync(path.dirname(copyFilePath), { recursive: true });
      fs.copyFileSync(file, copyFilePath);
    });
    // copy index file
    const transformedIndexFilePaths = `${buildDataDir}/transformed-index.json`;
    if (!fs.existsSync(transformedIndexFilePaths)) throw new Error('index file does not exist');
    const transformedIndexFiles =
      JSON.parse(fs.readFileSync(transformedIndexFilePaths, 'utf8')) as { [key: string]: string };
    const indexFileContent = transformedIndexFiles[input.buildName];
    fs.writeFileSync(copyIndexFilePath, indexFileContent);
  }

  copySource.displayName = `${format}-copy-source`;

  async function build() {
    const dtsRollupBundle = await rollup.rollup({
      input: copyIndexFilePath,
      plugins: [
        rollupPluginTs({
          browserslist: false,
          tsconfig: {
            ...tsConfig.compilerOptions as object,
            ...overrideSettings,
            baseUrl: copyDir
          }
        })
      ]
    });

    await dtsRollupBundle.write({
      file: `${output}/index.js`,
      format,
      exports: 'named'
    });

    await dtsRollupBundle.close();

    const jsRollupBundle = await rollup.rollup({
      input: copyIndexFilePath,
      plugins: [
        rollupPluginTypescript({
          typescript: ttypescript,
          tsconfig: `${copyDir}/tsconfig.json`,
          compilerOptions: {
            ...overrideSettings,
            declaration: false
          }
        }),
        rollupBabel({
          babelHelpers: 'bundled',
          extensions: ['.ts', '.js'],
          plugins: ['babel-plugin-remove-unused-import']
        })
      ]
    });

    await jsRollupBundle.write({
      sourcemap: true,
      file: `${output}/index.js`,
      format,
      exports: 'named'
    });

    await jsRollupBundle.close();
  }

  build.displayName = `${format}-build`;

  function mangle() {
    return gulp
      .src([`${output}/index.js`])
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(terserStream())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`${output}`));
  }

  mangle.displayName = `${format}-mangle`;

  return gulp.series(generateIndex, cleanBuild, copySource, build, mangle);
}
