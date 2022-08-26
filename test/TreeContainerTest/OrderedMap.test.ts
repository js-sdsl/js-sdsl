import { Vector, OrderedMap } from '@/index';

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
    expect(_value).toEqual(value);
  });
  myOrderedMap.forEach(([key, value]) => {
    const _value = stdMap.get(key);
    expect(value).toEqual(_value);
  });
}

describe('OrderedMap test', () => {
  const myOrderedMap = new OrderedMap(arr.map((element, index) => [element, index]));
  const stdMap = new Map(arr.map((element, index) => [element, index]));

  test('OrderedMap eraseElementByKey function test', () => {
    const eraseArr: number[] = [];
    stdMap.forEach((value, key) => {
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
    for (let i = 0; i < testNum; ++i) {
      myOrderedMap.setElement(i, i);
      stdMap.set(i, i);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  test('OrderedMap eraseElementByPos function test', () => {
    for (let i = 0; i < 10; ++i) {
      const pos = Math.floor(Math.random() * myOrderedMap.size());
      const pair = myOrderedMap.getElementByPos(pos);
      myOrderedMap.eraseElementByPos(pos);
      if (pair) stdMap.delete(pair[0]);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  test('OrderedMap union function test', () => {
    const otherMap = new OrderedMap<number, number>();
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * 1000000;
      otherMap.setElement(random, i);
      stdMap.set(random, i);
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
    const v = new Vector<[number, number]>(myOrderedMap);
    v.sort((x, y) => x[0] - y[0]);
    for (let i = 0; i < testNum / 10; ++i) {
      const begin = myOrderedMap.begin();
      stdMap.delete(begin.pointer[0]);
      myOrderedMap.eraseElementByIterator(begin);
      expect(begin.pointer[0]).toBe(v.getElementByPos(i + 1)[0]);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  test('OrderedMap iterator error test', () => {
    myOrderedMap.begin().pointer['1'] = 2;
    expect(myOrderedMap.front()).toEqual([myOrderedMap.begin().pointer[0], 2]);
    expect(() => {
      // @ts-ignore
      myOrderedMap.begin().pointer['0'] = 2;
    }).toThrow(TypeError);
  });

  test('OrderedMap clear function test', () => {
    myOrderedMap.clear();
    stdMap.clear();
    judgeMap(myOrderedMap, stdMap);

    for (let i = 0; i < testNum; ++i) {
      myOrderedMap.setElement(i, i);
      stdMap.set(i, i);
    }
    let i = testNum;
    stdMap.forEach((value, key) => {
      --i;
      myOrderedMap.eraseElementByKey(key);
      expect(myOrderedMap.size()).toEqual(i);
    });
    expect(myOrderedMap.size()).toEqual(0);
    stdMap.clear();

    for (let i = 0; i < testNum; ++i) {
      myOrderedMap.setElement(testNum - i, i);
      stdMap.set(testNum - i, i);
    }
    i = testNum;
    stdMap.forEach((value, key) => {
      --i;
      myOrderedMap.eraseElementByKey(key);
      expect(myOrderedMap.size()).toEqual(i);
    });
    expect(myOrderedMap.size()).toEqual(0);
    stdMap.clear();
  });

  test('OrderedMap empty test', () => {
    const myOrderedMap = new OrderedMap();
    expect(myOrderedMap.front()).toEqual(undefined);
    expect(myOrderedMap.back()).toEqual(undefined);
    expect(() => {
      myOrderedMap.begin().pointer[1] = 1;
    }).toThrowError(RangeError);
    expect(() => {
      myOrderedMap.lowerBound(0).pointer[1] = 1;
    }).toThrowError(RangeError);
    expect(() => {
      myOrderedMap.upperBound(0).pointer[1] = 1;
    }).toThrowError(RangeError);
    expect(() => {
      myOrderedMap.reverseLowerBound(0).pointer[1] = 1;
    }).toThrowError(RangeError);
    expect(() => {
      myOrderedMap.reverseUpperBound(0).pointer[1] = 1;
    }).toThrowError(RangeError);
    expect(() => {
      myOrderedMap.find(0).pointer[0] = 2;
    }).toThrowError(RangeError);
    expect(() => {
      // @ts-ignore
      // eslint-disable-next-line no-unused-expressions
      myOrderedMap.rBegin().pointer.a;
    }).toThrowError(RangeError);
    myOrderedMap.setElement(1, 1);
    expect(myOrderedMap.getElementByKey(0)).toEqual(undefined);
  });
});
