import SequentialContainer from '@/container/SequentialContainer/Base/index';
import { Vector, Deque } from '@/index';
import { ContainerInitError, RunTimeError } from '@/utils/error';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeSequentialContainer(
  container: SequentialContainer<number>,
  myVector: SequentialContainer<number>
) {
  expect(container.size()).toEqual(myVector.size());
  container.forEach((element, index) => {
    expect(element).toEqual(myVector.getElementByPos(index));
  });
}

describe('Deque test', () => {
  const myDeque = new Deque(arr);
  const tmpArr = [...arr];

  test('Deque pushFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myDeque.pushFront(i);
      tmpArr.unshift(i);
    }
    judgeSequentialContainer(myDeque, new Vector(tmpArr));
  });

  test('Deque popFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myDeque.popFront();
      tmpArr.shift();
    }
    judgeSequentialContainer(myDeque, new Vector(tmpArr));
  });

  test('Deque shrinkToFit function test', () => {
    myDeque.shrinkToFit();
    judgeSequentialContainer(myDeque, new Vector(tmpArr));
  });

  test('Deque find function test', () => {
    myDeque.forEach((element, index) => {
      if (index >= 1000) return;
      expect(myDeque.find(element).pointer).toEqual(element);
    });
    expect(myDeque.find(tmpArr[tmpArr.length - 1]).pointer).toEqual(tmpArr[tmpArr.length - 1]);
    expect(myDeque.find(tmpArr[tmpArr.length / 2]).pointer).toEqual(tmpArr[tmpArr.length / 2]);
    expect(() => {
      const a = myDeque.find(-1).pointer;
      return a;
    }).toThrowError(RunTimeError);
    myDeque.pushBack(-1);
    expect(myDeque.find(-1).pointer).toEqual(-1);
    myDeque.popBack();
  });

  test('Deque eraseElementByIterator function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myDeque.eraseElementByIterator(myDeque.begin());
      tmpArr.shift();
    }
    judgeSequentialContainer(myDeque, new Vector(tmpArr));
    let index = 0;
    for (const element of myDeque) {
      expect(element).toEqual(tmpArr[index++]);
    }
  });

  test('Deque run time error test', () => {
    expect(() => myDeque.getElementByPos(myDeque.size())).toThrowError(RunTimeError);
  });

  test('Deque empty test', () => {
    myDeque.clear();
    myDeque.shrinkToFit();
    myDeque.pushBack(1);
    expect(myDeque.find(1).pointer).toBe(1);
    myDeque.begin().pointer = 2;
    expect(myDeque.front()).toBe(2);
    expect(new Deque(new Set([2])).size()).toBe(1);
    expect(new Deque(new Vector([2])).size()).toBe(1);
    // @ts-ignore
    expect(() => new Deque({})).toThrowError(ContainerInitError);
    myDeque.cut(-1);
    myDeque.popBack();
    myDeque.popFront();
    expect(myDeque.size()).toBe(0);
    expect(() => myDeque.eraseElementByPos(-1)).toThrowError(RunTimeError);
    myDeque.eraseElementByValue(0);
    expect(myDeque.find(0).equals(myDeque.end())).toEqual(true);
    myDeque.unique();
    // eslint-disable-next-line no-empty, no-unused-vars, @typescript-eslint/no-unused-vars
    for (const element of myDeque) {}
    myDeque.pushBack(1);
    myDeque.insert(1, 1);
    expect(myDeque.back()).toEqual(1);
    for (const element of myDeque) {
      expect(element).toBe(1);
    }
    myDeque.eraseElementByPos(1);
    myDeque.insert(0, 3);
    expect(myDeque.front()).toBe(3);

    const q = new Deque<number>([], (1 << 10));
    for (let i = 0; i < testNum; ++i) q.pushFront(arr[i]);
    arr.reverse();
    judgeSequentialContainer(q, new Vector(arr));
  });
});
