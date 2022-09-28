import gulp from 'gulp';
import {
  gulpFactory,
  gulpUmdFactory,
  gulpUmdMinFactory
} from './tools/buildFactory';
import { createIsolateTasksFromConfig } from './tools/createTask';
import isolateBuildConfig from './conf/isolate.config.json';

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

gulp.task('isolate', gulp.series(createIsolateTasksFromConfig(isolateBuildConfig)));
