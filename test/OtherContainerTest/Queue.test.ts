import { expect } from 'chai';
import { Vector, Queue } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judge(myQueue: Queue<number>, myVector: Vector<number>) {
  while (!myQueue.empty()) {
    expect(myQueue.size()).to.equal(myVector.size());
    const s = myQueue.front();
    const v = myVector.front();
    expect(s).to.equal(v);
    const u = myQueue.pop();
    expect(u).to.equal(v);
    myVector.eraseElementByPos(0);
  }
  expect(myQueue.pop()).to.equal(undefined);
  expect(myQueue.front()).to.equal(undefined);
}

describe('Queue test', () => {
  const myQueue = new Queue(arr);
  const myVector = new Vector(arr);

  it('Queue size test', () => {
    expect(myQueue.size()).to.equal(myVector.size());
  });

  it('Queue allocate test', () => {
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.pushBack(i);
    }
    let index = 0;
    while (!myQueue.empty()) {
      myQueue.push(1);
      myVector.pushBack(1);
      for (let i = 0; i < 10; ++i) {
        expect(myQueue.pop()).to.equal((function () {
          try {
            return myVector.getElementByPos(index++);
          } catch (e) {}
        })());
      }
    }
    expect(myQueue.size()).to.equal(0);
  });

  it('Queue clear function test', () => {
    myQueue.clear();
    myVector.clear();
    judge(myQueue, myVector);
  });

  it('Queue other function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.pushBack(i);
    }
    judge(myQueue, myVector);
  });
});
