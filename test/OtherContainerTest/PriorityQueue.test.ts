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
    expect(myQueue.size()).to.equal(myVector.size() - index);
    const u = myQueue.top() as number;
    expect(myQueue.find(u)).to.equal(true);
    expect(u).to.equal(myVector.getElementByPos(index++));
    const v = myQueue.pop();
    expect(v).to.equal(u);
    expect(myQueue.find(-u - 1)).to.equal(false);
  }
  expect(myQueue.pop()).to.equal(undefined);
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
    judge(myQueue, myVector);
  });

  it('PriorityQueue remove function test', () => {
    const myQueue = new PriorityQueue<number>();
    const myVector = new Vector<number>();
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.pushBack(i);
    }
    for (let i = 1; i < testNum; ++i) {
      if (Math.random() > 0.5) {
        expect(myQueue.remove(i)).to.equal(true);
        myVector.eraseElementByValue(i);
      }
      expect(myQueue.remove(-i)).to.equal(false);
    }
    myQueue.push(testNum);
    myQueue.remove(testNum);
    // @ts-ignore
    const back = myQueue._priorityQueue[myQueue.size() - 1];
    myQueue.remove(back);
    myQueue.push(back);
    judge(myQueue, myVector);
  });

  it('PriorityQueue updateItem function test', () => {
    type obj = { num: number };
    const arr: obj[] = [];
    for (let i = 0; i < testNum; ++i) {
      arr.push({ num: i });
    }
    const cmp = (x: obj, y: obj) => x.num - y.num;
    const myQueue = new PriorityQueue<obj>(arr, cmp);
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
