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
    expect(container.push(i)).to.equal(myVector.push(i));
  }
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    expect(container.pop()).to.equal(myVector.pop());
  }
  judgeSequentialContainer(container, myVector);

  const len = container.length;
  expect(container.length).to.equal(myVector.length);
  for (let i = 0; i < len; ++i) {
    expect(container.at(i)).to.equal(myVector.at(i));
  }

  for (let i = 0; i < len; ++i) {
    myVector.set(i, i);
    container.set(i, i);
  }
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * myVector.length);
    expect(container.splice(pos, 1).toArray()).to.deep.equal(myVector.splice(pos, 1).toArray());
  }
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    expect(container.push(i)).to.equal(myVector.push(i));
  }
  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.length);
    const num = 10;
    expect(
      container.splice(pos, 0, ...new Array(num).fill(-2)).toArray()
    ).to.deep.equal(
      myVector.splice(pos, 0, ...new Array(num).fill(-2)).toArray()
    );
  }
  judgeSequentialContainer(container, myVector);

  expect(
    container.filter(item => item !== -2).toArray()
  ).to.deep.equal(
    myVector.filter(item => item !== -2).toArray()
  );
  expect(container.filter(item => item !== container.back()!).toArray())
    .to.deep.equal(myVector.filter(item => item !== myVector.back()!).toArray());

  judgeSequentialContainer(container, myVector);

  container.reverse();
  myVector.reverse();
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.length);
    const num = 10;
    expect(
      container.splice(pos, 0, ...new Array(num).fill(-1)).toArray()
    ).to.deep.equal(
      myVector.splice(pos, 0, ...new Array(num).fill(-1)).toArray()
    );
  }
  judgeSequentialContainer(container, myVector);

  expect(container.unique()).to.equal(myVector.unique());
  judgeSequentialContainer(container, myVector);

  for (let i = 0; i < testNum; ++i) {
    expect(container.push(i)).to.equal(myVector.push(i));
  }
  judgeSequentialContainer(container, myVector);

  container.sort((x, y) => x - y);
  myVector.sort((x, y) => x - y);
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
    expect(myVector.length).to.equal(0);
    expect(myVector.front()).to.equal(undefined);
    expect(myVector.back()).to.equal(undefined);
    myVector.splice(0, 0, 100);
    expect(() => {
      myVector.find(0).pointer = 1;
    }).to.throw(RangeError);
    myVector.clear();
    myVector.pop();
  });

  it('LinkList standard test', () => {
    testSequentialContainer(new LinkList(arr));
  });

  it('Deque standard test', () => {
    testSequentialContainer(new Deque(arr));
  });
});
