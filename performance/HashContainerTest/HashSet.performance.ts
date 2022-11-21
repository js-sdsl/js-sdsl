import type { testReportFormat } from '../index';
import { HashSet } from '@/index';

function testHashSet(arr: number[], testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat = [];

  startTime = Date.now();
  const myHashSet = new HashSet(arr);
  endTime = Date.now();
  reportList.push({
    testFunc: 'constructor',
    testNum: 1,
    containerSize: myHashSet.size(),
    runTime: endTime - startTime
  });

  const stdSet = new Set(arr);

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) {
    myHashSet.insert(Math.random() * 1000000, false);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'insert',
    testNum,
    containerSize: myHashSet.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  myHashSet.forEach(element => myHashSet.find(element, false));
  endTime = Date.now();
  reportList.push({
    testFunc: 'find',
    testNum: myHashSet.size(),
    containerSize: myHashSet.size(),
    runTime: endTime - startTime
  });

  myHashSet.forEach(element => stdSet.add(element));
  const size = myHashSet.size();
  startTime = Date.now();
  stdSet.forEach(element => myHashSet.eraseElementByKey(element, false));
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByKey',
    testNum: stdSet.size,
    containerSize: size,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testHashSet;
