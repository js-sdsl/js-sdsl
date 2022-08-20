import { HashMap } from '@/index';
import { testReportFormat } from '../index';

function testHashMap(arr: number[], testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat['reportList'] = [];

  startTime = Date.now();
  const myHashMap = new HashMap(arr.map((element, index) => [index, element]), (1 << 21));
  endTime = Date.now();
  reportList.push({
    testFunc: 'constructor',
    testNum: 1,
    containerSize: myHashMap.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) myHashMap.setElement(i, Math.random() * 1000000);
  endTime = Date.now();
  reportList.push({
    testFunc: 'setElement',
    testNum,
    containerSize: myHashMap.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  myHashMap.forEach(([key]) => myHashMap.getElementByKey(key));
  endTime = Date.now();
  reportList.push({
    testFunc: 'getElementByKey',
    testNum: myHashMap.size(),
    containerSize: myHashMap.size(),
    runTime: endTime - startTime
  });

  const size = myHashMap.size();
  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) myHashMap.eraseElementByKey(i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByKey',
    testNum,
    containerSize: size,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testHashMap;
