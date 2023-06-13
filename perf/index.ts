import { writeFileSync } from 'fs';
import path from 'path';
import testHashMap from './hash-perf/hash-map.perf';
import testHashSet from './hash-perf/hash-set.perf';
import testPriorityQueue from './other-perf/priority-queue.perf';
import testQueue from './other-perf/queue.perf';
import testStack from './other-perf/stack.perf';
import testDeque from './sequential-perf/deque.perf';
import testLinkList from './sequential-perf/link-list.perf';
import testOrderedMap from './tree-perf/ordered-map.perf';
import testOrderedSet from './tree-perf/ordered-set.perf';
import getEnv from './utils/env';

export type testReportFormat = {
  testFunc: string,
  containerSize: number,
  testNum: number,
  runTime: number
}[];

type testFunc = (arr: number[], testNum: number) => testReportFormat;

const testFuncMap: Record<string, testFunc> = {
  stack: testStack,
  queue: testQueue,
  'priority-queue': testPriorityQueue,
  'link-list': testLinkList,
  deque: testDeque,
  'ordered-set': testOrderedSet,
  'ordered-map': testOrderedMap,
  'hash-set': testHashSet,
  'hash-map': testHashMap
};

const testNum = 1000000;
const arr: number[] = [];
for (let i = 0; i < testNum; ++i) arr.push(Math.random() * testNum * 2);

function testContainer(containerName: string) {
  return testFuncMap[containerName]([...arr], testNum);
}

function align(str: string | number, length = 25) {
  str = str.toString();
  return ` ${str} ${' '.repeat(length - str.length - 2)}`;
}

function getTestResult(containerName: string) {
  const _ = '-'.repeat(25);
  let content = `### ${containerName}

|${align('testFunc')}|${align('testNum')}|${align('containerSize')}|${align('runTime / ms')}|
|${_}|${_}|${_}|${_}|
`;
  const result = testContainer(containerName);
  for (const report of result) {
    const { testFunc, testNum, containerSize, runTime } = report;
    content +=
      `|${align(testFunc)}|${align(testNum)}|${align(containerSize)}|${align(runTime)}|\n`;
  }
  return content + '\n';
}

function main(taskQueue: string[]) {
  if (taskQueue.length === 0) {
    taskQueue = Object.keys(testFuncMap);
  }
  const env = getEnv();
  process.stdout.write(env);
  let content = env;
  const title = '\n## Result\n\n';
  process.stdout.write(title);
  content += title;
  for (const containerName in testFuncMap) {
    if (taskQueue.includes(containerName)) {
      const result = getTestResult(containerName);
      process.stdout.write(result);
      content += result;
    }
  }
  console.log('saving result...');
  const savePath = path.resolve(__dirname, '../performance.md');
  writeFileSync(savePath, content);
  console.log('saved!');
}

main(process.argv.slice(2));
