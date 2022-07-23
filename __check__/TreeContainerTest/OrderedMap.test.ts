import { Vector, OrderedMap } from '@/index';
import { NullValueError, TestError } from '@/types/error';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeMap(myOrderedMap: OrderedMap<number, number>, stdMap: Map<number, number>) {
  expect(myOrderedMap.getHeight()).toBeLessThanOrEqual(2 * Math.log2(myOrderedMap.size() + 1));
  expect(myOrderedMap.size()).toEqual(stdMap.size);
  if (!myOrderedMap.empty()) {
    const front = myOrderedMap.front() as [number, number];
    const back = myOrderedMap.back() as [number, number];
    expect(front[0]).toEqual(myOrderedMap.begin().pointer[0]);
    expect(front[1]).toEqual(myOrderedMap.begin().pointer[1]);
    expect(back[0]).toEqual(myOrderedMap.rBegin().pointer[0]);
    expect(back[1]).toEqual(myOrderedMap.rBegin().pointer[1]);
  }
  stdMap.forEach((value, key) => {
    const _value = myOrderedMap.getElementByKey(key);
    expect(_value).toEqual(stdMap.get(key));
  });
  myOrderedMap.forEach(([key, value]) => {
    const _value = stdMap.get(key);
    expect(value).toEqual(_value);
  });
}

describe('OrderedMap test', () => {
  const myOrderedMap = new OrderedMap(arr.map((element, index) => [element, index]));
  const stdMap = new Map(arr.map((element, index) => [element, index]));

  test('OrderedMap insert null test', () => {
    // @ts-ignore
    expect(() => myOrderedMap.setElement(null, null)).toThrowError(NullValueError);
    // @ts-ignore
    expect(() => myOrderedMap.setElement(undefined, undefined)).toThrowError(NullValueError);
  });

  test('OrderedMap eraseElementByKey function test', () => {
    const eraseArr: number[] = [];
    myOrderedMap.forEach(([key, value]) => {
      const v = stdMap.get(key);
      if (v !== value) {
        throw new TestError('OrderedMap test failed!');
      }
      if (Math.random() > 0.5) {
        eraseArr.push(key);
      }
    });
    eraseArr.forEach(key => {
      myOrderedMap.eraseElementByKey(key);
      stdMap.delete(key);
    });
    judgeMap(myOrderedMap, stdMap);
  });

  test('OrderedMap setElement function test', () => {
    for (let i = testNum; i < testNum * 3; ++i) {
      const random = Math.random() * 1000000;
      myOrderedMap.setElement(i, random);
      stdMap.set(i, random);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  test('OrderedMap eraseElementByPos function test', () => {
    for (let i = 0; i < 100; ++i) {
      const pos = Math.floor(Math.random() * myOrderedMap.size());
      const pair = myOrderedMap.getElementByPos(pos);
      myOrderedMap.eraseElementByPos(pos);
      stdMap.delete(pair[0]);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  test('OrderedMap union function test', () => {
    const otherMap = new OrderedMap<number, number>();
    for (let i = testNum * 2; i < testNum * 3; ++i) {
      const random = Math.random() * 1000000;
      otherMap.setElement(i, random);
      stdMap.set(i, random);
    }
    myOrderedMap.union(otherMap);
    judgeMap(myOrderedMap, stdMap);
  });

  test('OrderedMap binary search function test', () => {
    const myVector = new Vector(myOrderedMap);
    myVector.sort((x, y) => x[0] - y[0]);
    for (let i = 0; i < myVector.size(); ++i) {
      let vElement = myVector.getElementByPos(i);
      let myElement = myOrderedMap.lowerBound(vElement[0]).pointer;
      expect(myElement[0]).toEqual(vElement[0]);
      expect(myElement[1]).toEqual(vElement[1]);
      if (i !== myVector.size() - 1) {
        vElement = myVector.getElementByPos(i);
        myElement = myOrderedMap.upperBound(vElement[0]).pointer;
        vElement = myVector.getElementByPos(i + 1);
        expect(myElement[0]).toEqual(vElement[0]);
        expect(myElement[1]).toEqual(vElement[1]);
      }
    }
  });

  test('OrderedMap reverse binary search function test', () => {
    const myVector = new Vector(myOrderedMap);
    myVector.sort((x, y) => x[0] - y[0]);
    for (let i = 0; i < myVector.size(); ++i) {
      let vElement = myVector.getElementByPos(i);
      let myElement = myOrderedMap.reverseLowerBound(vElement[0]).pointer;
      expect(myElement[0]).toEqual(vElement[0]);
      expect(myElement[1]).toEqual(vElement[1]);
      if (i !== 0) {
        vElement = myVector.getElementByPos(i);
        myElement = myOrderedMap.reverseUpperBound(vElement[0]).pointer;
        vElement = myVector.getElementByPos(i - 1);
        expect(myElement[0]).toEqual(vElement[0]);
        expect(myElement[1]).toEqual(vElement[1]);
      }
    }
  });

  test('OrderedMap eraseElementByIterator function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      const begin = myOrderedMap.begin();
      stdMap.delete(begin.pointer[0]);
      myOrderedMap.eraseElementByIterator(begin);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  test('OrderedMap clear function test', () => {
    myOrderedMap.clear();
    stdMap.clear();
    judgeMap(myOrderedMap, stdMap);
  });
});
