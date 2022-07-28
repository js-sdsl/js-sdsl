
import { testReportFormat } from '__performance__/index';
import SequentialContainer from '@/container/SequentialContainer/Base/index';

function testSequentialContainer(container: SequentialContainer<number, unknown>, testNum: number) {
  let startTime, endTime;
  const reportList: testReportFormat['reportList'] = [];

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
  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) {
    container.getElementByPos(i);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'getElementByPos',
    testNum,
    containerSize: container.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) container.setElementByPos(i, i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'setElementByPos',
    testNum,
    containerSize: container.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  size = container.size();
  for (let i = 0; i < (container.constructor.name === 'Deque' ? 10 : testNum); ++i) {
    container.eraseElementByPos(Math.floor(Math.random() * container.size()));
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'eraseElementByPos',
    testNum: (container.constructor.name === 'Deque' ? 10 : testNum),
    containerSize: size,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  for (let i = 0; i < (container.constructor.name === 'Deque' ? 50 : testNum); ++i) {
    container.insert(Math.floor(Math.random() * container.size()), -1, 2);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'insert',
    testNum: container.constructor.name === 'Deque' ? 50 : testNum,
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

  for (let i = 0; i < (container.constructor.name === 'Deque' ? 50 : testNum); ++i) {
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
