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
    containerSize: myHashMap.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) {
    myHashMap.set(Math.random() * 1000000, i, false);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'set',
    testNum,
    containerSize: myHashMap.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  myHashMap.forEach(([key]) => myHashMap.get(key, false));
  endTime = Date.now();
  reportList.push({
    testFunc: 'get',
    testNum: myHashMap.length,
    containerSize: myHashMap.length,
    runTime: endTime - startTime
  });

  const stdSet = new Set<number>();
  myHashMap.forEach(element => stdSet.add(element[0]));
  const size = myHashMap.length;
  startTime = Date.now();
  stdSet.forEach(element => myHashMap.delete(element, false));
  endTime = Date.now();
  reportList.push({
    testFunc: 'delete',
    testNum: stdSet.size,
    containerSize: size,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testHashMap;
