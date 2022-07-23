import SequentialContainer from '@/container/SequentialContainer/Base/index';
import { Vector, LinkList, Deque } from '@/index';
import { TestError } from '@/utils/error';

const arr: number[] = [];
const testNum = 1000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeSequentialContainer(funcName: string,
  container: SequentialContainer<number, unknown>,
  myVector: SequentialContainer<number, unknown>
) {
  expect(container.size()).toEqual(myVector.size());
  container.forEach((element, index) => {
    expect(element).toEqual(myVector.getElementByPos(index));
  });
}

export default judgeSequentialContainer;

function testSequentialContainer(container: SequentialContainer<number, unknown>) {
  const myVector = new Vector<number>(arr);

  if (container.size() !== myVector.size()) {
    throw new TestError('size test failed.');
  }

  if (container.front() !== myVector.front()) {
    throw new TestError('front test failed!');
  }

  if (container.back() !== myVector.back()) {
    throw new TestError('back test failed!');
  }

  judgeSequentialContainer('forEach', container, myVector);

  for (let i = 0; i < testNum; ++i) {
    container.pushBack(i);
    myVector.pushBack(i);
  }
  judgeSequentialContainer('pushBack', container, myVector);

  for (let i = 0; i < testNum; ++i) {
    container.popBack();
    myVector.popBack();
  }
  judgeSequentialContainer('popBack', container, myVector);

  let testResult = true;
  const len = container.size();
  testResult = testResult && (container.size() === myVector.size());
  for (let i = 0; i < len; ++i) {
    testResult = testResult && (container.getElementByPos(i) === myVector.getElementByPos(i));
  }
  if (!testResult) {
    throw new TestError('getElementByPos test failed.');
  }

  for (let i = 0; i < len; ++i) {
    myVector.setElementByPos(i, i);
    container.setElementByPos(i, i);
  }
  judgeSequentialContainer('setElementByPos', container, myVector);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * myVector.size());
    container.eraseElementByPos(pos);
    myVector.eraseElementByPos(pos);
  }
  judgeSequentialContainer('eraseElementByPos', container, myVector);

  for (let i = 0; i < testNum; ++i) {
    container.pushBack(i);
    myVector.pushBack(i);
  }
  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.size());
    const num = 10;
    container.insert(pos, -2, num);
    myVector.insert(pos, -2, num);
  }
  judgeSequentialContainer('insert', container, myVector);

  container.eraseElementByValue(-2);
  myVector.eraseElementByValue(-2);
  judgeSequentialContainer('eraseElementByValue', container, myVector);

  container.reverse();
  myVector.reverse();
  judgeSequentialContainer('reverse', container, myVector);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.size());
    const num = 10;
    container.insert(pos, -1, num);
    myVector.insert(pos, -1, num);
  }
  container.unique();
  myVector.unique();
  judgeSequentialContainer('unique', container, myVector);

  for (let i = 0; i < testNum; ++i) {
    container.pushBack(i);
    myVector.pushBack(i);
  }
  container.sort((x, y) => x - y);
  myVector.sort((x: number, y: number) => x - y);
  judgeSequentialContainer('sort', container, myVector);

  container.clear();
  myVector.clear();
  judgeSequentialContainer('clear', container, myVector);
}

describe('SequentialContainer test', () => {
  test('LinkList standard test', () => {
    const myLinkList = new LinkList(arr);
    expect(testSequentialContainer(myLinkList)).toEqual(undefined);
  });

  test('Deque standard test', () => {
    const myDeque = new Deque(arr);
    expect(testSequentialContainer(myDeque)).toEqual(undefined);
  });
});
