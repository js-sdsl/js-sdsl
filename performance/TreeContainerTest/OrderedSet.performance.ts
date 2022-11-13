import type { testReportFormat } from '../index';
import { OrderedSet } from '@/index';

function testOrderedSet(arr: number[], testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat = [];

  startTime = Date.now();
  const myOrderedSet = new OrderedSet(arr);
  endTime = Date.now();
  reportList.push({
    testFunc: 'constructor',
    testNum: 1,
    containerSize: myOrderedSet.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) myOrderedSet.insert(Math.random() * 1000000);
  endTime = Date.now();
  reportList.push({
    testFunc: 'insert',
    testNum,
    containerSize: myOrderedSet.size(),
    runTime: endTime - startTime
  });

  for (let i = 0; i < testNum; ++i) myOrderedSet.insert(Math.random() * 1000000);
  const tmpArr: number[] = [];
  myOrderedSet.forEach((element: number) => tmpArr.push(element));
  startTime = Date.now();
  const size = myOrderedSet.size();
  for (let i = 0; i < testNum; ++i) myOrderedSet.eraseElementByKey(tmpArr[i]);
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByKey',
    testNum,
    containerSize: size,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < 10; ++i) {
    myOrderedSet.eraseElementByPos(Math.floor(Math.random() * myOrderedSet.size()));
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByPos',
    testNum: 10,
    containerSize: size,
    runTime: endTime - startTime
  });

  const _otherOrderedSet = new OrderedSet<number>();
  for (let i = 0; i < testNum; ++i) _otherOrderedSet.insert(Math.random() * 1000000);
  startTime = Date.now();
  myOrderedSet.union(_otherOrderedSet);
  endTime = Date.now();
  reportList.push({
    testFunc: 'union',
    testNum: 1,
    containerSize: myOrderedSet.size(),
    runTime: endTime - startTime
  });

  let num = 0;
  startTime = Date.now();
  for (const element of myOrderedSet) {
    ++num;
    if (num >= testNum) break;
    myOrderedSet.lowerBound(element);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'lowerBound',
    testNum,
    containerSize: myOrderedSet.size(),
    runTime: endTime - startTime
  });

  num = 0;
  startTime = Date.now();
  for (const element of myOrderedSet) {
    ++num;
    if (num >= testNum) break;
    myOrderedSet.upperBound(element);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'upperBound',
    testNum,
    containerSize: myOrderedSet.size(),
    runTime: endTime - startTime
  });
  num = 0;
  startTime = Date.now();
  for (const element of myOrderedSet) {
    ++num;
    if (num >= testNum) break;
    myOrderedSet.reverseLowerBound(element);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'reverseLowerBound',
    testNum,
    containerSize: myOrderedSet.size(),
    runTime: endTime - startTime
  });

  num = 0;
  startTime = Date.now();
  for (const element of myOrderedSet) {
    ++num;
    if (num >= testNum) break;
    myOrderedSet.reverseUpperBound(element);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'reverseUpperBound',
    testNum,
    containerSize: myOrderedSet.size(),
    runTime: endTime - startTime
  });

  return reportList;
}

export default testOrderedSet;
