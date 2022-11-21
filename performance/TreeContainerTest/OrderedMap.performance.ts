import type { testReportFormat } from '../index';
import { OrderedMap } from '@/index';

function testOrderedMap(arr: number[], testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat = [];

  startTime = Date.now();
  const myMap = new OrderedMap(arr.map((element, index) => [element, index]));
  endTime = Date.now();
  reportList.push({
    testFunc: 'constructor',
    testNum: 1,
    containerSize: myMap.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) myMap.setElement(Math.random() * 1000000, i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'setElement',
    testNum,
    containerSize: myMap.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  let size = myMap.size();
  for (let i = 0; i < testNum; ++i) myMap.eraseElementByKey(i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByKey',
    testNum,
    containerSize: size,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  size = myMap.size();
  for (let i = 0; i < 10; ++i) {
    myMap.eraseElementByPos(Math.floor(Math.random() * myMap.size()));
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByPos',
    testNum: 10,
    containerSize: size,
    runTime: endTime - startTime
  });

  const _otherMap = new OrderedMap<number, number>();
  for (let i = testNum; i < testNum * 2; ++i) _otherMap.setElement(i, Math.random() * 1000000);
  startTime = Date.now();
  myMap.union(_otherMap);
  endTime = Date.now();
  reportList.push({
    testFunc: 'union',
    testNum: 1,
    containerSize: myMap.size(),
    runTime: endTime - startTime
  });

  let num = 0;
  startTime = Date.now();
  for (const pair of myMap) {
    ++num;
    if (num >= testNum) break;
    myMap.lowerBound(pair[0]);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'lowerBound',
    testNum,
    containerSize: myMap.size(),
    runTime: endTime - startTime
  });

  num = 0;
  startTime = Date.now();
  for (const pair of myMap) {
    ++num;
    if (num >= testNum) break;
    myMap.upperBound(pair[0]);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'upperBound',
    testNum,
    containerSize: myMap.size(),
    runTime: endTime - startTime
  });

  num = 0;
  startTime = Date.now();
  for (const pair of myMap) {
    ++num;
    if (num >= testNum) break;
    myMap.reverseLowerBound(pair[0]);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'reverseLowerBound',
    testNum,
    containerSize: myMap.size(),
    runTime: endTime - startTime
  });

  num = 0;
  startTime = Date.now();
  for (const pair of myMap) {
    ++num;
    if (num >= testNum) break;
    myMap.reverseUpperBound(pair[0]);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'reverseUpperBound',
    testNum,
    containerSize: myMap.size(),
    runTime: endTime - startTime
  });

  return reportList;
}

export default testOrderedMap;
