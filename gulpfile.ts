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
import minifyPrivatesTransformer from 'ts-transformer-minify-privates';
import tsTreeshaker, { DependencySolver } from './tsTreeshaker';
import deleteEmpty from 'delete-empty';
import ttypescript from 'ttypescript';

/* eslint-disable @typescript-eslint/no-var-requires */
const clean = require('gulp-clean') as () => NodeJS.ReadWriteStream;
const rollup = require('gulp-rollup-2').rollup as (...params: unknown[]) => NodeJS.ReadWriteStream;
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
          minifyPrivatesTransformer(program),
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
        regex: /^_private_/
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

function gulpIsolateFactory(
  input: {
    sourceRoots: string|string[],
    globs: string | string[],
    opts?: SrcOptions
  },
  output: string,
  overrideSettings?: Omit<ts.Settings, 'outDir'>,
  useCjsTransform = false) {
  const dependencySolver = new DependencySolver(input.sourceRoots, {
    baseUrl: input.opts?.base ?? '.',
    outDir: output
  });

  function build() {
    return gulpFactory(
      input,
      output,
      {
        ...overrideSettings,
        getCustomTransformers: (program?: Program) => {
          const treeShakerTransform = tsTreeshaker({ solver: dependencySolver });

          const customTransformers = overrideSettings?.getCustomTransformers?.(program);
          return {
            before: [
              ...customTransformers?.before ?? []
            ],
            after: [
              ...treeShakerTransform.after,
              ...customTransformers?.after ?? []
            ],
            afterDeclarations: [
              ...treeShakerTransform.afterDeclarations,
              ...customTransformers?.afterDeclarations ?? []
            ]
          };
        }
      },
      useCjsTransform
    );
  }

  function filterDependencies() {
    return gulp.src(`${output}/**/*`, { read: false, allowEmpty: true, base: '.' })
      .pipe(filter([
        '**/*.ts',
        '**/*.js',
        ...dependencySolver.getIncludedDependencies().map((dep) => `!${dep}`)]))
      .pipe(clean());
  }

  async function cleanEmptyDirs() {
    await deleteEmpty(process.cwd() + '/' + output);
  }

  return gulp.series(build, filterDependencies, cleanEmptyDirs);
}

function createIsolateTasks(
  taskNamePrefix: string,
  input: {
    globs: string | string[],
    opts?: SrcOptions
  },
  overrideSettings: Omit<ts.Settings, 'outDir'>,
  useCjsTransform = false,
  tasks: {
    name: string,
    sourceRoots: string|string[],
    output: string
  }[]
) {
  const createdTasks: string[] = [];
  for (const task of tasks) {
    const taskName = `${taskNamePrefix}:${task.name}`;
    gulp.task(
      taskName,
      gulpIsolateFactory(
        {
          sourceRoots: task.sourceRoots,
          ...input
        },
        task.output,
        overrideSettings,
        useCjsTransform
      )
    );
    createdTasks.push(taskName);
  }
  return createdTasks;
}

const cjsIsolateTasks = createIsolateTasks(
  'cjs',
  {
    globs: 'src/**/*.ts',
    opts: { base: 'src' }
  },
  {
    target: 'ES6',
    module: 'ES2015',
    declaration: true
  },
  true,
  [
    {
      name: 'stack',
      sourceRoots: ['src/container/OtherContainer/Stack.ts'],
      output: 'dist/isolate/cjs/stack'
    },
    {
      name: 'queue',
      sourceRoots: ['src/container/OtherContainer/Queue.ts'],
      output: 'dist/isolate/cjs/queue'
    },
    {
      name: 'priority-queue',
      sourceRoots: ['src/container/OtherContainer/PriorityQueue.ts'],
      output: 'dist/isolate/cjs/priority-queue'
    },
    {
      name: 'vector',
      sourceRoots: ['src/container/SequentialContainer/Vector.ts'],
      output: 'dist/isolate/cjs/vector'
    },
    {
      name: 'link-list',
      sourceRoots: ['src/container/SequentialContainer/LinkList.ts'],
      output: 'dist/isolate/cjs/link-list'
    },
    {
      name: 'deque',
      sourceRoots: ['src/container/SequentialContainer/Deque.ts'],
      output: 'dist/isolate/cjs/deque'
    },
    {
      name: 'ordered-set',
      sourceRoots: ['src/container/TreeContainer/OrderedSet.ts'],
      output: 'dist/isolate/cjs/ordered-set'
    },
    {
      name: 'ordered-map',
      sourceRoots: ['src/container/TreeContainer/OrderedMap.ts'],
      output: 'dist/isolate/cjs/ordered-map'
    },
    {
      name: 'hash-set',
      sourceRoots: ['src/container/HashContainer/HashSet.ts'],
      output: 'dist/isolate/cjs/hash-set'
    },
    {
      name: 'hash-map',
      sourceRoots: ['src/container/HashContainer/HashMap.ts'],
      output: 'dist/isolate/cjs/hash-map'
    }
  ]
);

const esmIsolateTasks = createIsolateTasks(
  'esm',
  {
    globs: 'src/**/*.ts',
    opts: { base: 'src' }
  },
  {
    target: 'ES5',
    module: 'ES2015',
    declaration: true
  },
  true,
  [
    {
      name: 'stack',
      sourceRoots: ['src/container/OtherContainer/Stack.ts'],
      output: 'dist/isolate/esm/stack'
    },
    {
      name: 'queue',
      sourceRoots: ['src/container/OtherContainer/Queue.ts'],
      output: 'dist/isolate/esm/queue'
    },
    {
      name: 'priority-queue',
      sourceRoots: ['src/container/OtherContainer/PriorityQueue.ts'],
      output: 'dist/isolate/esm/priority-queue'
    },
    {
      name: 'vector',
      sourceRoots: ['src/container/SequentialContainer/Vector.ts'],
      output: 'dist/isolate/esm/vector'
    },
    {
      name: 'link-list',
      sourceRoots: ['src/container/SequentialContainer/LinkList.ts'],
      output: 'dist/isolate/esm/link-list'
    },
    {
      name: 'deque',
      sourceRoots: ['src/container/SequentialContainer/Deque.ts'],
      output: 'dist/isolate/esm/deque'
    },
    {
      name: 'ordered-set',
      sourceRoots: ['src/container/TreeContainer/OrderedSet.ts'],
      output: 'dist/isolate/esm/ordered-set'
    },
    {
      name: 'ordered-map',
      sourceRoots: ['src/container/TreeContainer/OrderedMap.ts'],
      output: 'dist/isolate/esm/ordered-map'
    },
    {
      name: 'hash-set',
      sourceRoots: ['src/container/HashContainer/HashSet.ts'],
      output: 'dist/isolate/esm/hash-set'
    },
    {
      name: 'hash-map',
      sourceRoots: ['src/container/HashContainer/HashMap.ts'],
      output: 'dist/isolate/esm/hash-map'
    }
  ]
);

gulp.task('isolate', gulp.series(...cjsIsolateTasks, ...esmIsolateTasks));

gulp.task('default', gulp.series('cjs', 'esm', 'umd', 'umd:min'));
