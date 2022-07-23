import { Vector, Deque } from '@/index';
import { RunTimeError } from '@/utils/error';
import judgeSequentialContainer from './SequentialContainer.test';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

describe('Deque test', () => {
  const myDeque = new Deque(arr);
  const tmpArr = [...arr];

  test('Deque pushFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myDeque.pushFront(i);
      tmpArr.unshift(i);
    }
    expect(judgeSequentialContainer(
      'pushFront',
      myDeque,
      new Vector(tmpArr))).toEqual(undefined);
  });

  test('Deque popFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myDeque.popFront();
      tmpArr.shift();
    }
    expect(judgeSequentialContainer(
      'popFront',
      myDeque,
      new Vector(tmpArr))).toEqual(undefined);
  });

  test('Deque shrinkToFit function test', () => {
    myDeque.shrinkToFit();
    expect(judgeSequentialContainer(
      'shrinkToFit',
      myDeque,
      new Vector(tmpArr))).toEqual(undefined);
  });

  test('Deque find function test', () => {
    myDeque.forEach((element, index) => {
      if (index >= 1000) return;
      expect(myDeque.find(element).pointer).toEqual(element);
    });
  });

  test('Deque eraseElementByIterator function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myDeque.eraseElementByIterator(myDeque.begin());
      tmpArr.shift();
    }
    judgeSequentialContainer('eraseElementByIterator', myDeque, new Vector(tmpArr));
  });

  test('Deque run time error test', () => {
    expect(() => myDeque.getElementByPos(myDeque.size())).toThrowError(RunTimeError);
  });
});
