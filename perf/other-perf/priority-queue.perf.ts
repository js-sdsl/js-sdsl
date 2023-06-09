import type { testReportFormat } from '../index';
import { PriorityQueue } from '@/index';

function testPriorityQueue(arr: number[], testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat = [];

  startTime = Date.now();
  const myPriority = new PriorityQueue(arr, {
    cmp: (x: number, y: number) => y - x,
    copy: false
  });
  endTime = Date.now();
  reportList.push({
    testFunc: 'constructor',
    testNum: 1,
    containerSize: myPriority.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) myPriority.push(Math.random() * 1000000);
  endTime = Date.now();
  reportList.push({
    testFunc: 'push',
    testNum,
    containerSize: myPriority.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  const size = myPriority.length;
  while (!myPriority.empty()) myPriority.pop();
  endTime = Date.now();
  reportList.push({
    testFunc: 'pop all',
    testNum: 1,
    containerSize: size,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testPriorityQueue;
