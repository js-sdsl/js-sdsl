import { Vector, LinkList, Deque, SequentialContainer } from '@/index';
import { expect } from 'chai';

const arr: number[] = [];
const testNum = 1000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeSequentialContainer(
  container: SequentialContainer<number>,
  myVector: SequentialContainer<number>
) {
  expect(container.size()).to.equal(myVector.size());
  container.forEach((element, index) => {
    expect(element).to.equal(myVector.getElementByPos(index));
  });
}

function testSequentialContainer(container: SequentialContainer<number>) {
  const myVector = new Vector<number>(arr);

  if (container.size() !== myVector.size()) {
    throw new Error('size test failed.');
  }

  if (container.front() !== myVector.front()) {
    throw new Error('front test failed!');
  }

  if (container.back() !== myVector.back()) {
    throw new Error('back test failed!');
  }

  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    container.pushBack(i);
    myVector.pushBack(i);
  }
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    container.popBack();
    myVector.popBack();
  }
  judgeSequentialContainer(container, myVector);

  let testResult = true;
  const len = container.size();
  testResult = testResult && (container.size() === myVector.size());
  for (let i = 0; i < len; ++i) {
    testResult = testResult && (container.getElementByPos(i) === myVector.getElementByPos(i));
  }
  if (!testResult) {
    throw new Error('getElementByPos test failed.');
  }

  for (let i = 0; i < len; ++i) {
    myVector.setElementByPos(i, i);
    container.setElementByPos(i, i);
  }
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * myVector.size());
    container.eraseElementByPos(pos);
    myVector.eraseElementByPos(pos);
  }
  judgeSequentialContainer(container, myVector);

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
  judgeSequentialContainer(container, myVector);

  container.eraseElementByValue(-2);
  myVector.eraseElementByValue(-2);
  container.eraseElementByValue(container.back() as number);
  myVector.eraseElementByValue(myVector.back() as number);
  judgeSequentialContainer(container, myVector);

  container.reverse();
  myVector.reverse();
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.size());
    const num = 10;
    container.insert(pos, -1, num);
    myVector.insert(pos, -1, num);
  }
  container.unique();
  myVector.unique();
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    container.pushBack(i);
    myVector.pushBack(i);
  }
  container.sort((x, y) => x - y);
  myVector.sort((x: number, y: number) => x - y);
  judgeSequentialContainer(container, myVector);

  container.clear();
  myVector.clear();
  judgeSequentialContainer(container, myVector);
}

describe('SequentialContainer test', () => {
  it('Vector test', () => {
    const myVector = new Vector([1], false);
    myVector.begin().pointer = 0;
    expect(myVector.front()).to.equal(0);
    expect(myVector.find(0).pointer).to.equal(0);
    myVector.eraseElementByIterator(myVector.begin());
    expect(myVector.size()).to.equal(0);
    expect(myVector.front()).to.equal(undefined);
    expect(myVector.back()).to.equal(undefined);
    myVector.insert(0, 100);
    expect(() => {
      myVector.find(0).pointer = 1;
    }).to.to.throw(RangeError);
    myVector.clear();
    myVector.popBack();
  });

  it('LinkList standard test', () => {
    const myLinkList = new LinkList(arr);
    expect(() => {
      testSequentialContainer(myLinkList);
    }).not.to.to.throw(Error);
  });

  it('Deque standard test', () => {
    const myDeque = new Deque(arr);
    expect(() => testSequentialContainer(myDeque)).not.to.to.throw(Error);
  });
});
