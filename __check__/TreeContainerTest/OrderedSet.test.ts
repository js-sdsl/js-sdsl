import { Vector, OrderedSet } from '@/index';
import { NullValueError, TestError } from '@/types/error';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeSet(myOrderedSet: OrderedSet<number>, myVector: Vector<number>) {
  expect(myOrderedSet.getHeight()).toBeLessThanOrEqual(2 * Math.log2(myOrderedSet.size() + 1));
  expect(myOrderedSet.size()).toEqual(myVector.size());
  myVector.sort((x, y) => x - y);
  myOrderedSet.forEach((element, index) => {
    expect(element).toEqual(myVector.getElementByPos(index));
  });
}

describe('OrderedSet test', () => {
  const myOrderedSet = new OrderedSet(arr);
  const myVector = new Vector(new Set(arr));

  test('OrderedSet insert null test', () => {
    // @ts-ignore
    expect(() => myOrderedSet.insert(null)).toThrowError(NullValueError);
    // @ts-ignore
    expect(() => myOrderedSet.insert(undefined)).toThrowError(NullValueError);
  });

  test('OrderedSet insert function test', () => {
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * 1000000;
      myOrderedSet.insert(random);
      myVector.pushBack(random);
    }
    judgeSet(myOrderedSet, myVector);
  });

  test('OrderedSet eraseElementByValue function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      const pos = Math.floor(Math.random() * myVector.size());
      const eraseValue = myVector.getElementByPos(pos);
      myVector.eraseElementByPos(pos);
      myOrderedSet.eraseElementByValue(eraseValue);
    }
    judgeSet(myOrderedSet, myVector);
  });

  test('OrderedSet union function test', () => {
    const otherOrderedSet = new OrderedSet<number>();
    for (let i = 0; i < testNum * 2; ++i) {
      const random = Math.random() * 1000000;
      otherOrderedSet.insert(random);
      myVector.pushBack(random);
    }
    myOrderedSet.union(otherOrderedSet);
    judgeSet(myOrderedSet, myVector);
  });

  test('OrderedSet eraseElementByPos function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      const pos = Math.floor(Math.random() * myVector.size());
      myVector.eraseElementByPos(pos);
      myOrderedSet.eraseElementByPos(pos);
    }
    judgeSet(myOrderedSet, myVector);
  });

  test('OrderedSet find function test', () => {
    myVector.forEach((element: number) => {
      expect(myOrderedSet.find(element).pointer).toEqual(element);
    });
  });

  myVector.sort((x: number, y: number) => x - y);

  test('OrderedSet binary search function test', () => {
    expect((() => {
      for (let i = 0; i < myVector.size(); ++i) {
        if (myOrderedSet.lowerBound(myVector.getElementByPos(i)).pointer !== myVector.getElementByPos(i)) {
          throw new TestError();
        }
        if (i !== myVector.size() - 1 && myOrderedSet.upperBound(myVector.getElementByPos(i)).pointer !== myVector.getElementByPos(i + 1)) {
          throw new TestError();
        }
      }
    })()).toEqual(undefined);
  });

  test('OrderedSet reverse binary search function test', () => {
    expect((() => {
      for (let i = 0; i < myVector.size(); ++i) {
        if (myOrderedSet.reverseLowerBound(myVector.getElementByPos(i)).pointer !== myVector.getElementByPos(i)) {
          throw new TestError();
        }
        if (i !== 0 && myOrderedSet.reverseUpperBound(myVector.getElementByPos(i)).pointer !== myVector.getElementByPos(i - 1)) {
          throw new TestError();
        }
      }
    })()).toEqual(undefined);
  });

  test('OrderedSet front & back function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myOrderedSet.eraseElementByPos(0);
      myVector.eraseElementByPos(0);
      expect(myOrderedSet.front()).toEqual(myVector.front());
      myOrderedSet.eraseElementByPos(myOrderedSet.size() - 1);
      myVector.eraseElementByPos(myVector.size() - 1);
      expect(myOrderedSet.back()).toEqual(myVector.back());
    }
    judgeSet(myOrderedSet, myVector);
  });

  test('OrderedSet eraseElementByIterator function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myOrderedSet.eraseElementByIterator(myOrderedSet.begin());
      myVector.eraseElementByPos(0);
    }
    judgeSet(myOrderedSet, myVector);
  });

  test('OrderedSet clear function test', () => {
    myOrderedSet.clear();
    myVector.clear();
    judgeSet(myOrderedSet, myVector);
  });
});
