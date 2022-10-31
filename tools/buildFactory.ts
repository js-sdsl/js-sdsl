import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { babel as rollupBabel } from '@rollup/plugin-babel';
import rollupPluginTypescript, { PartialCompilerOptions } from '@rollup/plugin-typescript';
import glob from 'glob';
import gulp from 'gulp';
import babel from 'gulp-babel';
import filter from 'gulp-filter';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import tap from 'gulp-tap';
import terser from 'gulp-terser';
import gulpTs from 'gulp-typescript';
import GulpUglify from 'gulp-uglify';
import merge from 'merge-stream';
import rollupPluginLicense from 'rollup-plugin-license';
import rollupPluginTs from 'rollup-plugin-ts';
import tsMacroTransformer, { macros } from 'ts-macros';
import pathsTransformer from 'ts-transform-paths';
import ttypescript from 'ttypescript';
import ts from 'typescript';
import { SrcOptions } from 'vinyl-fs';
import tsConfig from '../tsconfig.json';
import exportTransformer from './exportTransformer';

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
  input: {
    indexFile: string,
    include: string[]
  },
  output: string,
  settings: {
    format: 'cjs' | 'esm' | 'umd',
    sourceMap: boolean,
    overrideSettings?: PartialCompilerOptions,
    umdBanner?: string,
  }
): Promise<void> {
  const rollupBundle = await rollup.rollup({
    input: input.indexFile,
    context: 'this',
    plugins: [
      rollupPluginTypescript({
        typescript: ttypescript,
        compilerOptions: settings.overrideSettings,
        include: input.include
      }),
      rollupBabel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js'],
        plugins: ['babel-plugin-remove-unused-import']
      }),
      settings.format === 'umd' && settings.umdBanner
        ? rollupPluginLicense({
          sourcemap: settings.sourceMap,
          banner: {
            commentStyle: 'ignored',
            content: settings.umdBanner
          }
        })
        : undefined
    ]
  });

  await rollupBundle.write({
    sourcemap: settings.sourceMap,
    file: output,
    format: settings.format,
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
      ].filter(plugin => plugin !== undefined) as string[]
    })
    : tap(() => { /* */ });
}

export function createLicenseText(packageName: string, packageVersion: string): string {
  return fs.readFileSync('conf/umd-banner.txt', 'utf8')
    .replace(/<package>/g, packageName)
    .replace(/<version>/g, packageVersion);
}

export function gulpFactory(
  input: {
    globs: string | string[],
    opts?: SrcOptions
  },
  output: string,
  settings: {
    overrideSettings?: gulpTs.Settings,
    useCjsTransform?: boolean,
    sourceMap?: boolean,
  }
): NodeJS.ReadWriteStream {
  settings.useCjsTransform ??= false;
  settings.sourceMap ??= true;

  macros.clear();
  const tsProject = createProject({
    ...settings.overrideSettings,
    outDir: output
  });
  const cleanStream = gulp.src(output, { read: false, allowEmpty: true })
    .pipe(clean());
  const tsBuildResult = gulp.src(input.globs, input.opts)
    .pipe(settings.sourceMap ? sourcemaps.init() : tap(() => { /* */ }))
    .pipe(tsProject());
  const jsBuildResult = tsBuildResult.js
    .pipe(babelStream(true, settings.useCjsTransform))
    .pipe(terserStream());
  return merge(
    cleanStream,
    merge([
      tsBuildResult.dts
        .pipe(filter(['**/*.ts', '!**/*.macro.d.ts'])),
      jsBuildResult
        .pipe(filter(['**/*.js', '!**/*.macro.js']))
        .pipe(settings.sourceMap ? sourcemaps.write('.') : tap(() => { /* */ }))
    ])
      .pipe(gulp.dest(output))
  );
}

export function gulpUmdFactory(
  input: {
    indexFile: string,
    include: string[]
  },
  output: string,
  settings: {
    overrideSettings?: PartialCompilerOptions,
    umdBanner?: string
  }
) {
  macros.clear();

  function cleanStream() {
    return gulp
      .src(output, { read: false, allowEmpty: true })
      .pipe(clean());
  }

  cleanStream.displayName = 'clean';

  async function build() {
    await rollupTask(
      input,
      output,
      {
        format: 'umd',
        sourceMap: false,
        overrideSettings: settings.overrideSettings,
        umdBanner: settings.umdBanner
      }
    );
  }

  build.displayName = 'build';

  return gulp.series(cleanStream, build);
}

export async function gulpUmdMinFactory(input: string, output: string) {
  macros.clear();
  return gulp
    .src([`${output}`, `${output}.map`], { read: false, allowEmpty: true })
    .pipe(clean())
    .pipe(gulp.src(input))
    .pipe(sourcemaps.init())
    .pipe(terserStream())
    .pipe(GulpUglify({
      compress: true,
      output: {
        comments: /^!/
      }
    }))
    .pipe(rename(path.basename(output)))
    .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(gulp.dest(path.dirname(output)));
}

export function gulpIsolateFactory(
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
  settings: {
    format: 'cjs' | 'esm' | 'umd',
    overrideSettings?: PartialCompilerOptions,
    buildDataDir?: string,
    sourceMap?: boolean,
    mangling?: boolean,
    generateMin?: boolean,
    outputFileName?: string,
    umdBanner?: string
  }
) {
  const initializedSettings = {
    format: settings.format,
    overrideSettings: settings.overrideSettings,
    buildDataDir: settings.buildDataDir ?? 'dist/isolate/.build-data',
    sourceMap: settings.sourceMap ?? true,
    mangling: settings.mangling ?? true,
    generateMin: settings.generateMin ?? false,
    outputFileName: settings.outputFileName ?? 'index.js',
    umdBanner: settings.umdBanner
  };

  async function generateIndex() {
    // get files from glob
    const globs = Array.isArray(input.globs) ? input.globs : [input.globs];
    const files = globs
      .map(pattern => glob.sync(pattern, input.opts))
      .reduce((acc, val) => acc.concat(val), []);
    // generate sha256 hash of the source code
    const hash = crypto.createHash('sha256');
    hash.update(input.isolateBuildConfig.toString());
    files.forEach(file => hash.update(fs.readFileSync(file)));
    const hashValue = hash.digest('hex');
    // compare hash with the previous one
    const previousHash = fs.existsSync(`${initializedSettings.buildDataDir}/hash`)
      ? fs.readFileSync(`${initializedSettings.buildDataDir}/hash`, 'utf8')
      : '';
    if (previousHash === hashValue) return;
    // generate index file
    const project = gulpTs.createProject('tsconfig.json', {
      target: 'ESNext',
      declaration: true,
      getCustomTransformers: program => {
        if (program === undefined) throw new Error('program is undefined');
        return exportTransformer(program, {
          indexOutputPath: `${initializedSettings.buildDataDir}/transformed-index.json`,
          indexFile: input.indexFile,
          builds: input.isolateBuildConfig.builds
            .map(build => ({ name: build.name, sourceRoots: [build.sourceRoot] }))
        });
      }
    });
    await new Promise(resolve => {
      gulp.src(input.globs, input.opts)
        .pipe(project())
        .on('error', e => {
          throw new Error(e);
        })
        .on('end', resolve)
        .on('finish', resolve);
    });
    // save hash
    fs.mkdirSync(initializedSettings.buildDataDir, { recursive: true });
    fs.writeFileSync(`${initializedSettings.buildDataDir}/hash`, hashValue);
  }

  generateIndex.displayName = `${initializedSettings.format}-generate-index`;

  function cleanBuild() {
    return gulp.src(output, { read: false, allowEmpty: true })
      .pipe(clean());
  }

  cleanBuild.displayName = `${initializedSettings.format}-clean`;

  const copyDir = `${initializedSettings.buildDataDir}/copied-source`;
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
      .map(pattern => glob.sync(pattern, input.opts))
      .reduce((acc, val) => acc.concat(val), []);
    files.forEach(file => {
      const relativeFilePath = path.relative('.', file);
      const copyFilePath = path.join(copyDir, relativeFilePath);
      fs.mkdirSync(path.dirname(copyFilePath), { recursive: true });
      fs.copyFileSync(file, copyFilePath);
    });
    // copy index file
    const transformedIndexFilePaths = `${initializedSettings.buildDataDir}/transformed-index.json`;
    if (!fs.existsSync(transformedIndexFilePaths)) throw new Error('index file does not exist');
    const transformedIndexFiles =
      JSON.parse(fs.readFileSync(transformedIndexFilePaths, 'utf8')) as { [key: string]: string };
    const indexFileContent = transformedIndexFiles[input.buildName];
    fs.writeFileSync(copyIndexFilePath, indexFileContent);
  }

  copySource.displayName = `${initializedSettings.format}-copy-source`;

  async function build() {
    const generateDeclaration =
      (tsConfig.compilerOptions as unknown as ts.CompilerOptions).declaration ??
      initializedSettings.overrideSettings?.declaration ??
      false;

    if (generateDeclaration) {
      const dtsRollupBundle = await rollup.rollup({
        input: copyIndexFilePath,
        plugins: [
          rollupPluginTs({
            browserslist: false,
            tsconfig: {
              ...tsConfig.compilerOptions as object,
              ...initializedSettings.overrideSettings,
              baseUrl: copyDir
            }
          })
        ]
      });

      await dtsRollupBundle.write({
        file: `${output}/${initializedSettings.outputFileName}`,
        format: initializedSettings.format,
        exports: 'named',
        name: 'sdsl'
      });

      await dtsRollupBundle.close();
    }

    macros.clear();
    const jsRollupBundle = await rollup.rollup({
      input: copyIndexFilePath,
      plugins: [
        rollupPluginTypescript({
          typescript: ttypescript,
          tsconfig: `${copyDir}/tsconfig.json`,
          compilerOptions: {
            ...initializedSettings.overrideSettings,
            declaration: false
          }
        }),
        rollupBabel({
          babelHelpers: 'bundled',
          extensions: ['.ts', '.js'],
          plugins: ['babel-plugin-remove-unused-import']
        }),
        initializedSettings.format === 'umd' && initializedSettings.umdBanner
          ? rollupPluginLicense({
            sourcemap: initializedSettings.sourceMap,
            banner: {
              commentStyle: 'ignored',
              content: initializedSettings.umdBanner
            }
          })
          : undefined
      ]
    });

    await jsRollupBundle.write({
      sourcemap: initializedSettings.sourceMap,
      file: `${output}/${initializedSettings.outputFileName}`,
      format: initializedSettings.format,
      exports: 'named',
      name: 'sdsl'
    });

    await jsRollupBundle.close();
  }

  build.displayName = `${initializedSettings.format}-build`;

  function mangle() {
    return gulp
      .src([`${output}/${initializedSettings.outputFileName}`])
      .pipe(initializedSettings.sourceMap
        ? sourcemaps.init({ loadMaps: true })
        : tap(() => { /* */ }))
      .pipe(terserStream())
      .pipe(initializedSettings.sourceMap ? sourcemaps.write('.') : tap(() => { /* */ }))
      .pipe(gulp.dest(`${output}`));
  }

  mangle.displayName = `${initializedSettings.format}-mangle`;

  function generateMin() {
    let minFileName = path.basename(
      initializedSettings.outputFileName,
      path.extname(initializedSettings.outputFileName)
    );
    minFileName += '.min.js';

    return gulpUmdMinFactory(
      `${output}/${initializedSettings.outputFileName}`,
      `${output}/${minFileName}`
    );
  }

  generateMin.displayName = `${initializedSettings.format}-generate-min`;

  const tasks: (() => Promise<unknown> | NodeJS.ReadWriteStream)[] = [
    generateIndex,
    cleanBuild,
    copySource,
    build
  ];

  if (initializedSettings.mangling) tasks.push(mangle);

  if (initializedSettings.generateMin) tasks.push(generateMin);

  return gulp.series(tasks);
}
