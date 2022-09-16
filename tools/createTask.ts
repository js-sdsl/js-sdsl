import gulp from 'gulp';
import ts from 'gulp-typescript';
import { SrcOptions } from 'vinyl-fs';
import { gulpIsolateFactory } from './buildFactory';

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

export type IsolateBuildConfig = {
  name: string;
  sourceRoots: string | string[];
}[];

export function createIsolateTasksFromConfig(config: IsolateBuildConfig) {
  const cjsConfig = config.map((item) => ({
    ...item,
    output: `dist/isolate/${item.name}/cjs`
  }));

  const esmConfig = config.map((item) => ({
    ...item,
    output: `dist/isolate/${item.name}/esm`
  }));

  const cjsTasks = createIsolateTasks(
    'cjs',
    {
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

  return [...cjsTasks, ...esmTasks];
}
