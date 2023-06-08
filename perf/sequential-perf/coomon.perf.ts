import type { testReportFormat } from '../index';
import SequentialContainer from '@/sequential/base/index';

function testSequentialContainer(container: SequentialContainer<number>, testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat = [];

  let _testNum = testNum;

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) container.push(Math.random());
  endTime = Date.now();
  reportList.push({
    testFunc: 'push',
    testNum,
    containerSize: container.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  let size = container.length;
  for (let i = 0; i < testNum; ++i) container.pop();
  endTime = Date.now();
  reportList.push({
    testFunc: 'pop',
    testNum,
    containerSize: size,
    runTime: endTime - startTime
  });

  for (let i = 0; i < testNum; ++i) {
    container.push(i);
  }
  if (container.constructor.name === 'LinkList') {
    _testNum = Math.min(testNum, 1000);
  }
  startTime = Date.now();
  for (let i = 0; i < _testNum; ++i) {
    container.at(i);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'at',
    testNum: _testNum,
    containerSize: container.length,
    runTime: endTime - startTime
  });

  if (container.constructor.name === 'LinkList') {
    _testNum = Math.min(testNum, 1000);
  }
  startTime = Date.now();
  for (let i = 0; i < _testNum; ++i) container.set(i, i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'set',
    testNum: _testNum,
    containerSize: container.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  size = container.length;
  for (let i = 0; i < 50; ++i) {
    container.splice(Math.floor(Math.random() * container.length), 1);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'splice-delete',
    testNum: 50,
    containerSize: size,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < 50; ++i) {
    container.splice(Math.floor(Math.random() * container.length), 0, -1, -1);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'splice-add',
    testNum: 50,
    containerSize: container.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  size = container.length;
  container = container.filter(function (item) {
    return item !== -1;
  });
  endTime = Date.now();
  reportList.push({
    testFunc: 'filter',
    testNum: 1,
    containerSize: size,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  container.reverse();
  endTime = Date.now();
  reportList.push({
    testFunc: 'reverse',
    testNum: 1,
    containerSize: container.length,
    runTime: endTime - startTime
  });

  for (let i = 0; i < 50; ++i) {
    container.splice(Math.floor(Math.random() * container.length), 0, -1, -1);
  }
  size = container.length;
  startTime = Date.now();
  container.unique();
  endTime = Date.now();
  reportList.push({
    testFunc: 'unique',
    testNum: 1,
    containerSize: size,
    runTime: endTime - startTime
  });

  for (let i = 0; i < testNum; ++i) {
    container.push(Math.random() * testNum);
  }
  startTime = Date.now();
  container.sort((x, y) => x - y);
  endTime = Date.now();
  reportList.push({
    testFunc: 'sort',
    testNum: 1,
    containerSize: container.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  size = container.length;
  container.clear();
  endTime = Date.now();
  reportList.push({
    testFunc: 'clear',
    testNum: 1,
    containerSize: size,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testSequentialContainer;
