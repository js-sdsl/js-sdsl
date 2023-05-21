import { expect } from 'chai';
import { Vector, Queue } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judge(myQueue: Queue<number>, myVector: Vector<number>) {
  while (!myQueue.empty()) {
    expect(myQueue.length).to.equal(myVector.length);
    const s = myQueue.front();
    const v = myVector.front();
    expect(s).to.equal(v);
    const u = myQueue.unshift();
    expect(u).to.equal(v);
    myVector.splice(0, 1);
  }
  expect(myQueue.unshift()).to.equal(undefined);
  expect(myQueue.front()).to.equal(undefined);
}

describe('Queue test', () => {
  const myQueue = new Queue(arr);
  const myVector = new Vector(arr);

  it('Queue size test', () => {
    expect(myQueue.length).to.equal(myVector.length);
  });

  it('Queue allocate test', () => {
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.push(i);
    }
    let index = 0;
    while (!myQueue.empty()) {
      myQueue.push(1);
      myVector.push(1);
      for (let i = 0; i < 10; ++i) {
        expect(myQueue.unshift()).to.equal((function () {
          try {
            return myVector.at(index++);
          } catch (e) {}
        })());
      }
    }
    expect(myQueue.length).to.equal(0);
  });

  it('Queue clear function test', () => {
    myQueue.clear();
    myVector.clear();
    judge(myQueue, myVector);
  });

  it('Queue other function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.push(i);
    }
    judge(myQueue, myVector);
  });
});
