import type { testReportFormat } from '../index';
import { HashMap } from '@/index';

function testHashMap(arr: number[], testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat = [];

  startTime = Date.now();
  const myHashMap = new HashMap(arr.map((element, index) => [element, index]));
  endTime = Date.now();
  reportList.push({
    testFunc: 'constructor',
    testNum: 1,
    containerSize: myHashMap.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) {
    myHashMap.setElement(Math.random() * 1000000, i, false);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'setElement',
    testNum,
    containerSize: myHashMap.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  myHashMap.forEach(([key]) => myHashMap.getElementByKey(key, false));
  endTime = Date.now();
  reportList.push({
    testFunc: 'getElementByKey',
    testNum: myHashMap.size(),
    containerSize: myHashMap.size(),
    runTime: endTime - startTime
  });

  const stdSet = new Set<number>();
  myHashMap.forEach(element => stdSet.add(element[0]));
  const size = myHashMap.size();
  startTime = Date.now();
  stdSet.forEach(element => myHashMap.eraseElementByKey(element, false));
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByKey',
    testNum: stdSet.size,
    containerSize: size,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testHashMap;
