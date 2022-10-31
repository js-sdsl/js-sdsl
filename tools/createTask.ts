import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import PackageJson from '../package.json';
import { createLicenseText, gulpIsolateFactory } from './buildFactory';

function createSharedFilesCopyTask(
  config: IsolateBuildConfig,
  packageSettings: IsolateBuildConfig['builds'][number],
  outputPattern: `${string}{name}${string}`
) {
  function copySharedFiles() {
    return gulp.src(config.sharedFiles)
      .pipe(gulp.dest(outputPattern.replace('{name}', packageSettings.name)));
  }
  copySharedFiles.displayName = 'copy-shared-files';
  return copySharedFiles;
}

function createPackageJsonCreateTask(
  packageSettings: IsolateBuildConfig['builds'][number],
  outputPattern: `${string}{name}${string}`
) {
  async function createPackageJson() {
    const packageJson = {
      ...PackageJson,
      name: `@${PackageJson.name}/${packageSettings.name}`,
      version: packageSettings.version
    };
    const noNeedFields = ['scripts', 'files'];
    noNeedFields.forEach(field => Reflect.deleteProperty(packageJson, field));
    const packageJsonPath = path.join(
      outputPattern.replace('{name}', packageSettings.name),
      'package.json'
    );
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  createPackageJson.displayName = 'create-package-json';
  return createPackageJson;
}

export type IsolateBuildConfig = {
  builds: {
    name: string;
    version: string;
    sourceRoot: string;
  }[],
  sharedFiles: string | string[]
};

export function createIsolateTasksFromConfig(config: IsolateBuildConfig) {
  const tasks: string[] = [];

  for (const build of config.builds) {
    const isolateCjsBuildTask = gulpIsolateFactory(
      {
        indexFile: 'src/index.ts',
        isolateBuildConfig: config,
        buildName: build.name,
        globs: 'src/**/*.ts',
        opts: { base: 'src' }
      },
      `dist/isolate/${build.name}/dist/cjs`,
      {
        format: 'cjs',
        overrideSettings: {
          module: 'ES2015',
          declaration: true
        }
      }
    );

    const isolateEsmBuildTask = gulpIsolateFactory(
      {
        indexFile: 'src/index.ts',
        isolateBuildConfig: config,
        buildName: build.name,
        globs: 'src/**/*.ts',
        opts: { base: 'src' }
      },
      `dist/isolate/${build.name}/dist/esm`,
      {
        format: 'esm',
        overrideSettings: {
          target: 'ES5',
          module: 'ES2015',
          declaration: true
        }
      }
    );

    const isolateUmdBuildTask = gulpIsolateFactory(
      {
        indexFile: 'src/index.ts',
        isolateBuildConfig: config,
        buildName: build.name,
        globs: 'src/**/*.ts',
        opts: { base: 'src' }
      },
      `dist/isolate/${build.name}/dist/umd`,
      {
        format: 'umd',
        overrideSettings: {
          target: 'ES5'
        },
        sourceMap: false,
        mangling: false,
        generateMin: true,
        outputFileName: `${build.name}.js`,
        umdBanner: createLicenseText(`@js-sdsl/${build.name}`, build.version)
      }
    );

    const copySharedFilesTask = createSharedFilesCopyTask(
      config,
      build,
      'dist/isolate/{name}'
    );

    const createPackageJsonTask = createPackageJsonCreateTask(
      build,
      'dist/isolate/{name}'
    );

    gulp.task(
      `isolate:${build.name}`,
      gulp.series(
        isolateCjsBuildTask,
        isolateEsmBuildTask,
        isolateUmdBuildTask,
        copySharedFilesTask,
        createPackageJsonTask
      )
    );
    tasks.push(`isolate:${build.name}`);
  }

  return tasks;
}
