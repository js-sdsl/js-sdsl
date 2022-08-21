import { Stack } from '@/index';
import { testReportFormat } from '../index';

function testStack(arr: number[], testNum: number) {
  const myStack = new Stack(arr);

  let startTime, endTime;
  const reportList: testReportFormat['reportList'] = [];

  startTime = Date.now();
  for (let i = 0; i < testNum; ++i) {
    myStack.push(Math.random() * 1000000);
  }
  endTime = Date.now();
  reportList.push({
    testFunc: 'push',
    testNum,
    containerSize: myStack.size(),
    runTime: endTime - startTime
  });

  startTime = Date.now();
  const size = myStack.size();
  myStack.clear();
  endTime = Date.now();
  reportList.push({
    testFunc: 'clear',
    testNum: 1,
    containerSize: size,
    runTime: endTime - startTime
  });

  return reportList;
}

export default testStack;
