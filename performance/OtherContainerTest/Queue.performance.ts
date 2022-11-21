import type { testReportFormat } from '../index';
import { Queue } from '@/index';

function testQueue(arr: number[], testNum: number) {
  const myQueue = new Queue(arr);

  let startTime, endTime;
  const reportList: testReportFormat = [];

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) myQueue.push(i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'push',
    testNum,
    containerSize: myQueue.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  const size = myQueue.size();
  myQueue.clear();
  endTime = Date.now();
  reportList.push({
    testFunc: 'clear',
    testNum: 1,
    containerSize: size,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testQueue;
