import { testReportFormat } from '../index';
import SequentialContainer from '@/container/SequentialContainer/Base/index';

function testSequentialContainer(container: SequentialContainer<number>, testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat['reportList'] = [];

  let _testNum = testNum;

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) container.pushBack(Math.random());
  endTime = Date.now();
  reportList.push({
    testFunc: 'pushBack',
    testNum,
    containerSize: container.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  let size = container.size();
  for (let i = 0; i < testNum; ++i) container.popBack();
  endTime = Date.now();
  reportList.push({
    testFunc: 'popBack',
    testNum,
    containerSize: size,
    runTime: endTime - startTime
  });

  for (let i = 0; i < testNum; ++i) {
    container.pushBack(i);
  }
  if (container.constructor.name === 'LinkList') {
    _testNum = Math.min(testNum, 1000);
  }
  startTime = Date.now();
  for (let i = 0; i < _testNum; ++i) {
    container.getElementByPos(i);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'getElementByPos',
    testNum: _testNum,
    containerSize: container.size(),
    runTime: endTime - startTime
  });

  if (container.constructor.name === 'LinkList') {
    _testNum = Math.min(testNum, 1000);
  }
  startTime = Date.now();
  for (let i = 0; i < _testNum; ++i) container.setElementByPos(i, i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'setElementByPos',
    testNum: _testNum,
    containerSize: container.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  size = container.size();
  for (let i = 0; i < 50; ++i) {
    container.eraseElementByPos(Math.floor(Math.random() * container.size()));
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByPos',
    testNum: 50,
    containerSize: size,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < 50; ++i) {
    container.insert(Math.floor(Math.random() * container.size()), -1, 2);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'insert',
    testNum: 50,
    containerSize: container.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  size = container.size();
  container.eraseElementByValue(-1);
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByValue',
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
    containerSize: container.size(),
    runTime: endTime - startTime
  });

  for (let i = 0; i < 50; ++i) {
    container.insert(Math.floor(Math.random() * container.size()), -1, 2);
  }
  size = container.size();
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
    container.pushBack(Math.random() * testNum);
  }
  startTime = Date.now();
  container.sort((x, y) => x - y);
  endTime = Date.now();
  reportList.push({
    testFunc: 'sort',
    testNum: 1,
    containerSize: container.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  size = container.size();
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
