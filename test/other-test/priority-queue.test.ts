import { expect } from 'chai';
import { Vector, PriorityQueue } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judge(myQueue: PriorityQueue<number>, myVector: Vector<number>) {
  myVector.sort((x, y) => y - x);
  expect(myQueue.toArray().sort((x, y) => y - x)).to.deep.equal(Array.from(myVector));
  let index = 0;
  while (!myQueue.empty()) {
    expect(myQueue.length).to.equal(myVector.length - index);
    const u = myQueue.top() as number;
    expect(myQueue.find(u)).to.equal(true);
    expect(u).to.equal(myVector.at(index++));
    const v = myQueue.pop();
    expect(v).to.equal(u);
    expect(myQueue.find(-u - 1)).to.equal(false);
  }
  expect(myQueue.pop()).to.equal(undefined);
  return true;
}

describe('priority-queue test', () => {
  it('priority-queue empty insert test', () => {
    const myQueue = new PriorityQueue();
    myQueue.pop();
    expect(myQueue.length).to.equal(0);
    myQueue.push(1);
    expect(myQueue.length).to.equal(1);
    expect(myQueue.top()).to.equal(1);
  });

  const myQueue = new PriorityQueue(arr);
  const myVector = new Vector(arr);

  it('priority-queue size test', () => {
    expect(myQueue.length).to.equal(myVector.length);
  });

  it('priority-queue other function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.push(i);
    }
    judge(myQueue, myVector);
  });

  it('priority-queue remove function test', () => {
    const myQueue = new PriorityQueue<number>();
    let myVector = new Vector<number>();
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.push(i);
    }
    for (let i = 1; i < testNum; ++i) {
      if (Math.random() > 0.5) {
        expect(myQueue.remove(i)).to.equal(true);
        myVector = myVector.filter(function (item) {
          return item !== i;
        });
      }
      expect(myQueue.remove(-i)).to.equal(false);
    }
    myQueue.push(testNum);
    myQueue.remove(testNum);
    // @ts-ignore
    const back = myQueue._priorityQueue[myQueue.length - 1];
    myQueue.remove(back);
    myQueue.push(back);
    judge(myQueue, myVector);
  });

  it('priority-queue updateItem function test', () => {
    type obj = { num: number };
    const arr: obj[] = [];
    for (let i = 0; i < testNum; ++i) {
      arr.push({ num: i });
    }
    const cmp = (x: obj, y: obj) => x.num - y.num;
    const myQueue = new PriorityQueue<obj>(arr, { cmp });
    for (let i = 0; i < testNum; ++i) {
      arr[i].num = -i;
      expect(myQueue.updateItem(arr[i])).to.equal(true);
      expect(myQueue.updateItem({ num: 1 })).to.equal(false);
      expect(myQueue.top()).to.equal(arr[i]);
    }
    arr.sort(cmp);
    let index = 0;
    while (!myQueue.empty()) {
      const u = myQueue.top();
      myQueue.pop();
      expect(u).to.equal(arr[index++]);
    }
  });

  it('priority-queue clear function test', () => {
    myQueue.clear();
    myVector.clear();
    judge(myQueue, myVector);
  });

  it('init test', () => {
    const q = new PriorityQueue([1, 2, 3], {
      copy: false
    });
    expect(q.top()).to.equal(3);
    q.pop();
    expect(q.top()).to.equal(2);
    q.pop();
    expect(q.top()).to.equal(1);
    q.pop();
    expect(q.top()).to.equal(undefined);
    const que = new PriorityQueue(new Vector([1, 2, 3]));
    expect(que.length).to.equal(3);
    expect(que.top()).to.equal(3);
    que.pop();
    expect(que.top()).to.equal(2);
    que.pop();
    expect(que.top()).to.equal(1);
    que.pop();
    expect(q.top()).to.equal(undefined);
  });
});
