import { Vector, PriorityQueue } from '@/index';
import { expect } from 'chai';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judge(myQueue: PriorityQueue<number>, myVector: Vector<number>) {
  while (!myQueue.empty()) {
    expect(myQueue.size()).to.equal(myVector.size());
    const u = myQueue.top();
    expect(u).to.equal(myVector.front());
    myQueue.pop();
    myVector.eraseElementByPos(0);
  }
  return true;
}

describe('PriorityQueue test', () => {
  it('PriorityQueue empty insert test', () => {
    const myQueue = new PriorityQueue();
    myQueue.pop();
    expect(myQueue.size()).to.equal(0);
    myQueue.push(1);
    expect(myQueue.size()).to.equal(1);
    expect(myQueue.top()).to.equal(1);
  });

  const myQueue = new PriorityQueue(arr);
  const myVector = new Vector(arr);

  it('PriorityQueue size test', () => {
    expect(myQueue.size()).to.equal(myVector.size());
  });

  it('PriorityQueue other function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.pushBack(i);
    }
    myVector.sort((x, y) => y - x);
    judge(myQueue, myVector);
  });

  it('PriorityQueue clear function test', () => {
    myQueue.clear();
    myVector.clear();
    judge(myQueue, myVector);
  });

  it('init test', () => {
    const q = new PriorityQueue([1, 2, 3], undefined, false);
    expect(q.top()).to.equal(3);
    q.pop();
    expect(q.top()).to.equal(2);
    q.pop();
    expect(q.top()).to.equal(1);
    q.pop();
    expect(q.top()).to.equal(undefined);
    const que = new PriorityQueue(new Vector([1, 2, 3]));
    expect(que.size()).to.equal(3);
    expect(que.top()).to.equal(3);
    que.pop();
    expect(que.top()).to.equal(2);
    que.pop();
    expect(que.top()).to.equal(1);
    que.pop();
    expect(q.top()).to.equal(undefined);
  });
});
