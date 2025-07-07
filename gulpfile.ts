import gulp from 'gulp';
import isolateBuildConfig from './conf/isolate.config.json';
import PackageJson from './package.json';
import {
  createLicenseText,
  gulpFactory,
  gulpUmdFactory,
  gulpUmdMinFactory
} from './tools/buildFactory';
import { createIsolateTasksFromConfig } from './tools/createTask';

gulp.task(
  'cjs',
  () => gulpFactory(
    { globs: 'src/**/*.ts' },
    'dist/cjs',
    {
      overrideSettings: {
        module: 'ES2015',
        declaration: true
      },
      useCjsTransform: true
    }
  )
);

gulp.task(
  'esm',
  () => gulpFactory(
    { globs: 'src/**/*.ts' },
    'dist/esm',
    {
      overrideSettings: {
        module: 'ES2015',
        declaration: true
      }
    }
  )
);

gulp.task(
  'perf',
  () => gulpFactory(
    {
      globs: [
        'src/**/*.ts',
        'perf/**/*.ts'
      ],
      opts: {
        base: '.'
      }
    },
    'dist/perf',
    {
      overrideSettings: {
        module: 'ES2015',
        declaration: false
      },
      useCjsTransform: true,
      sourceMap: false
    }
  )
);

gulp.task(
  'umd',
  gulpUmdFactory(
    {
      indexFile: 'src/index.ts',
      include: ['src/**/*.ts']
    },
    'dist/umd/js-sdsl.js',
    {
      overrideSettings: {
        target: 'ES5'
      },
      umdBanner: createLicenseText(PackageJson.name, PackageJson.version)
    }
  )
);

gulp.task(
  'umd:min',
  () => gulpUmdMinFactory(
    'dist/umd/js-sdsl.js',
    'dist/umd/js-sdsl.min.js'
  )
);

gulp.task('default', gulp.series('cjs', 'esm', 'umd', 'umd:min'));

gulp.task('isolate', gulp.series(createIsolateTasksFromConfig(isolateBuildConfig)));
