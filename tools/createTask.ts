import gulp from 'gulp';
import ts from 'gulp-typescript';
import fs from 'fs';
import path from 'path';
import { SrcOptions } from 'vinyl-fs';
import { gulpIsolateFactory } from './buildFactory';
import PackageJson from '../package.json';

function createIsolateTasks(
  taskNamePrefix: string,
  input: {
    indexFile: string,
    globs: string | string[],
    opts?: SrcOptions
  },
  overrideSettings: Omit<ts.Settings, 'outDir'>,
  useCjsTransform = false,
  tasks: {
    name: string,
    sourceRoots: string | string[],
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

function createSharedFilesCopyTasks(
  config: IsolateBuildConfig,
  outputPattern: `${string}{name}${string}`
) {
  const tasks: string[] = [];
  for (const task of config.builds) {
    const taskName = `${task.name}:copy-shared-files`;
    gulp.task(
      taskName,
      () => gulp.src(config.sharedFiles)
        .pipe(gulp.dest(outputPattern.replace('{name}', task.name)))
    );
    tasks.push(taskName);
  }
  return tasks;
}

function createPackageJsonCreateTasks(
  config: IsolateBuildConfig,
  outputPattern: `${string}{name}${string}`
) {
  const tasks: string[] = [];
  for (const task of config.builds) {
    const taskName = `${task.name}:create-package-json`;
    gulp.task(
      taskName,
      async () => {
        const packageJson = {
          name: `${PackageJson.name}-${task.name}`,
          version: task.version,
          description: PackageJson.description,
          main: PackageJson.main,
          module: PackageJson.module,
          author: PackageJson.author,
          sideEffects: PackageJson.sideEffects,
          homepage: PackageJson.homepage,
          repository: PackageJson.repository,
          license: PackageJson.license,
          keywords: PackageJson.keywords,
          bugs: PackageJson.bugs,
          dependencies: PackageJson.dependencies
        };
        const packageJsonPath = path.join(
          outputPattern.replace('{name}', task.name),
          'package.json'
        );
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }
    );
    tasks.push(taskName);
  }
  return tasks;
}

export type IsolateBuildConfig = {
  builds: {
    name: string;
    version: string;
    sourceRoots: string | string[];
  }[],
  sharedFiles: string | string[]
};

export function createIsolateTasksFromConfig(config: IsolateBuildConfig) {
  const cjsConfig = config.builds.map((item) => ({
    ...item,
    output: `dist/isolate/${item.name}/dist/cjs`
  }));

  const esmConfig = config.builds.map((item) => ({
    ...item,
    output: `dist/isolate/${item.name}/dist/esm`
  }));

  const cjsTasks = createIsolateTasks(
    'cjs',
    {
      indexFile: 'src/index.ts',
      globs: 'src/**/*.ts',
      opts: { base: 'src' }
    },
    {
      module: 'ES2015',
      declaration: true
    },
    true,
    cjsConfig
  );

  const esmTasks = createIsolateTasks(
    'esm',
    {
      indexFile: 'src/index.ts',
      globs: 'src/**/*.ts',
      opts: { base: 'src' }
    },
    {
      target: 'ES5',
      module: 'ES2015',
      declaration: true
    },
    false,
    esmConfig
  );

  const copySharedTasks = createSharedFilesCopyTasks(
    config,
    'dist/isolate/{name}/'
  );

  const createPackageJsonTasks = createPackageJsonCreateTasks(
    config,
    'dist/isolate/{name}/'
  );

  return [...cjsTasks, ...esmTasks, ...copySharedTasks, ...createPackageJsonTasks];
}
