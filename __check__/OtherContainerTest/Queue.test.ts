import { Vector, Queue } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judge(myQueue: Queue<number>, myVector: Vector<number>) {
  while (!myQueue.empty()) {
    if (myQueue.size() !== myVector.size()) return false;
    const s = myQueue.front();
    const v = myVector.front();
    if (s !== v) return false;
    myQueue.pop();
    myVector.eraseElementByPos(0);
  }
  return true;
}

describe('Queue test', () => {
  const myQueue = new Queue(arr);
  const myVector = new Vector(arr);

  test('Queue size test', () => {
    expect(myQueue.size()).toBe(myVector.size());
  });

  test('Queue clear function test', () => {
    myQueue.clear();
    myVector.clear();
    expect(judge(myQueue, myVector)).toEqual(true);
  });

  test('Queue other function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myQueue.push(i);
      myVector.pushBack(i);
    }
    expect(judge(myQueue, myVector)).toEqual(true);
  });
});
