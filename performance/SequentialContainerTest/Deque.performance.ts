import testSequentialContainer from './SequentialContainer.performance';
import { Deque } from '@/index';

function testDeque(arr: number[], testNum: number) {
  const myDeque = new Deque(arr);

  const reportList = testSequentialContainer(myDeque, testNum);

  let startTime, endTime;

  startTime = Date.now();
  for (let i = 0; i < testNum * 2; ++i) myDeque.pushFront(i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'pushFront',
    testNum: testNum * 2,
    containerSize: myDeque.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  const size = myDeque.size();
  for (let i = 0; i < testNum; ++i) myDeque.popFront();
  endTime = Date.now();
  reportList.push({
    testFunc: 'popFront',
    testNum,
    containerSize: size,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  myDeque.shrinkToFit();
  endTime = Date.now();
  reportList.push({
    testFunc: 'shrinkToFit',
    testNum: 1,
    containerSize: myDeque.size(),
    runTime: endTime - startTime
  });

  return reportList;
}

export default testDeque;
