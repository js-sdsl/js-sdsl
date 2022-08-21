import { LinkList } from '@/index';
import testSequentialContainer from './SequentialContainer.performance';

function testLinkList(arr: number[], testNum: number) {
  const myLinkList = new LinkList(arr);

  const reportList = testSequentialContainer(myLinkList, testNum);

  const tmpArr = [];
  for (let i = 0; i < 10000; ++i) {
    tmpArr.push(Math.random() * 1000000);
  }

  let startTime, endTime;

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) myLinkList.pushFront(i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'pushFront',
    testNum,
    containerSize: myLinkList.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  const size = myLinkList.size();
  for (let i = 0; i < testNum; ++i) myLinkList.popFront();
  endTime = Date.now();
  reportList.push({
    testFunc: 'popFront',
    testNum,
    containerSize: size,
    runTime: endTime - startTime
  });

  const _otherLinkList = new LinkList<number>();
  for (let i = 0; i < testNum; ++i) _otherLinkList.pushBack(Math.random() * 1000000);
  myLinkList.forEach(element => tmpArr.push(element));
  myLinkList.sort((x, y) => x - y);
  _otherLinkList.sort((x, y) => x - y);
  startTime = Date.now();
  myLinkList.merge(_otherLinkList);
  endTime = Date.now();
  reportList.push({
    testFunc: 'merge',
    testNum: 1,
    containerSize: myLinkList.size(),
    runTime: endTime - startTime
  });

  return reportList;
}

export default testLinkList;
