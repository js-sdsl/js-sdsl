import { expect } from 'chai';
import { judgeSequentialContainer } from '../utils/judge';
import { Vector, LinkList, Deque, SequentialContainer } from '@/index';

const arr: number[] = [];
const testNum = 1000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function testSequentialContainer(container: SequentialContainer<number>) {
  const myVector = new Vector<number>(arr);

  expect(container.length).to.equal(myVector.length);
  expect(container.front()).to.equal(myVector.front());
  expect(container.back()).to.equal(myVector.back());

  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    expect(container.pushBack(i)).to.equal(myVector.pushBack(i));
  }
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    expect(container.popBack()).to.equal(myVector.popBack());
  }
  judgeSequentialContainer(container, myVector);

  const len = container.size();
  expect(container.size()).to.equal(myVector.length);
  for (let i = 0; i < len; ++i) {
    expect(container.getElementByPos(i)).to.equal(myVector.getElementByPos(i));
  }

  for (let i = 0; i < len; ++i) {
    myVector.setElementByPos(i, i);
    container.setElementByPos(i, i);
  }
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * myVector.size());
    expect(container.eraseElementByPos(pos)).to.equal(myVector.eraseElementByPos(pos));
  }
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    expect(container.pushBack(i)).to.equal(myVector.pushBack(i));
  }
  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.size());
    const num = 10;
    expect(container.insert(pos, -2, num)).to.equal(myVector.insert(pos, -2, num));
  }
  judgeSequentialContainer(container, myVector);

  expect(container.eraseElementByValue(-2)).to.equal(myVector.eraseElementByValue(-2));
  expect(container.eraseElementByValue(container.back()!))
    .to.equal(myVector.eraseElementByValue(myVector.back()!));

  judgeSequentialContainer(container, myVector);

  container.reverse();
  myVector.reverse();
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.size());
    const num = 10;
    expect(container.insert(pos, -1, num)).to.equal(myVector.insert(pos, -1, num));
  }
  expect(container.unique()).to.equal(myVector.unique());
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    expect(container.pushBack(i)).to.equal(myVector.pushBack(i));
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
    }).to.throw(RangeError);
    myVector.clear();
    myVector.popBack();
  });

  it('LinkList standard test', () => {
    testSequentialContainer(new LinkList(arr));
  });

  it('Deque standard test', () => {
    testSequentialContainer(new Deque(arr));
  });
});
