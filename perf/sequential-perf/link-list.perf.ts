import testSequentialContainer from './coomon.perf';
import { LinkList } from '@/index';

function testLinkList(arr: number[], testNum: number) {
  const myLinkList = new LinkList(arr);

  const reportList = testSequentialContainer(myLinkList, testNum);

  const tmpArr = [];
  for (let i = 0; i < 10000; ++i) {
    tmpArr.push(Math.random() * 1000000);
  }

  let startTime, endTime;

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) myLinkList.unshift(i);
  endTime = Date.now();
  reportList.push({
    testFunc: 'unshift',
    testNum,
    containerSize: myLinkList.length,
    runTime: endTime - startTime
  });

  startTime = Date.now();
  const size = myLinkList.length;
  for (let i = 0; i < testNum; ++i) myLinkList.shift();
  endTime = Date.now();
  reportList.push({
    testFunc: 'shift',
    testNum,
    containerSize: size,
    runTime: endTime - startTime
  });

  const _otherLinkList = new LinkList<number>();
  for (let i = 0; i < testNum; ++i) _otherLinkList.push(Math.random() * 1000000);
  myLinkList.forEach(element => tmpArr.push(element));
  myLinkList.sort((x, y) => x - y);
  _otherLinkList.sort((x, y) => x - y);
  startTime = Date.now();
  myLinkList.merge(_otherLinkList);
  endTime = Date.now();
  reportList.push({
    testFunc: 'merge',
    testNum: 1,
    containerSize: myLinkList.length,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testLinkList;
