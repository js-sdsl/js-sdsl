import { Vector, PriorityQueue } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judge(myQueue: PriorityQueue<number>, myVector: Vector<number>) {
  while (!myQueue.empty()) {
    expect(myQueue.size()).toBe(myVector.size());
    const u = myQueue.top();
    expect(u).toBe(myVector.front());
    myQueue.pop();
    myVector.eraseElementByPos(0);
  }
  return true;
}

describe('PriorityQueue test', () => {
  test('PriorityQueue empty insert test', () => {
    const myQueue = new PriorityQueue();
    myQueue.pop();
    expect(myQueue.size()).toEqual(0);
    myQueue.push(1);
    expect(myQueue.size()).toEqual(1);
    expect(myQueue.top()).toEqual(1);
  });

  const myQueue = new PriorityQueue(arr);
  const myVector = new Vector(arr);

  test('PriorityQueue size test', () => {
    expect(myQueue.size()).toBe(myVector.size());
  });

  test('PriorityQueue other function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.pushBack(i);
    }
    myVector.sort((x, y) => y - x);
    judge(myQueue, myVector);
  });

  test('PriorityQueue clear function test', () => {
    myQueue.clear();
    myVector.clear();
    judge(myQueue, myVector);
  });

  test('init test', () => {
    const q = new PriorityQueue([1, 2, 3], undefined, false);
    expect(q.top()).toEqual(3);
    q.pop();
    expect(q.top()).toEqual(2);
    q.pop();
    expect(q.top()).toEqual(1);
    q.pop();
    expect(q.top()).toBe(undefined);
    const que = new PriorityQueue(new Vector([1, 2, 3]));
    expect(que.size()).toEqual(3);
    expect(que.top()).toEqual(3);
    que.pop();
    expect(que.top()).toEqual(2);
    que.pop();
    expect(que.top()).toEqual(1);
    que.pop();
    expect(q.top()).toBe(undefined);
  });
});
