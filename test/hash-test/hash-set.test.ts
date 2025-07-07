import { expect } from 'chai';
import {
  generateRandomNumber,
  generateRandomString,
  generateRandomSymbol,
  generateRandomBigInt,
  generateRandomObject,
  generateRandomFunction
} from '../utils/generateRandom';
import { HashSet } from '@/index';
import checkObject from '@/utils/checkObject';

const testNum = 10000;

function judgeHashSet(myHashSet: HashSet<unknown>, stdSet: Set<unknown>) {
  expect(myHashSet.length).to.equal(stdSet.size);
  let index = 0;
  stdSet.forEach(element => {
    if (index === 0) {
      expect(myHashSet.front()).to.equal(element);
      expect(myHashSet.begin().pointer).to.equal(element);
    } else if (index === myHashSet.length - 1) {
      expect(myHashSet.back()).to.equal(element);
      expect(myHashSet.rBegin().pointer).to.equal(element);
    } else if (index <= 1000) {
      expect(myHashSet.at(index)).to.equal(element);
    }
    expect(myHashSet.find(element).pointer).to.equal(element);
    ++index;
  });
}

function hashSetTest(generateRandom: () => unknown) {
  const arr: unknown[] = [];
  for (let i = 0; i < testNum; ++i) {
    arr.push(generateRandom());
  }

  const isObject = checkObject(arr[0]);

  const stdSet = new Set<unknown>(arr);
  const myHashSet = new HashSet<unknown>(arr);
  judgeHashSet(myHashSet, stdSet);

  it('hash-set forEach test', () => {
    let i = 0;
    myHashSet.forEach((el, index, hashSet) => {
      expect(hashSet).to.equal(myHashSet);
      expect(stdSet.has(el)).to.equal(true);
      expect(i++).to.equal(index);
    });
    expect(i).to.equal(stdSet.size);
  });

  it('hash-set find test', () => {
    for (let i = 0; i < testNum; ++i) {
      const random = generateRandom();
      const iter = myHashSet.find(random, isObject);
      if (iter.equals(myHashSet.end())) {
        expect(stdSet.has(random)).to.equal(false);
      } else {
        expect(iter.pointer).to.equal(random);
      }
    }
  });

  it('hash-set delete test', () => {
    for (const item of arr) {
      if (Math.random() > 0.6) {
        expect(myHashSet.delete(item, isObject)).to.equal(stdSet.delete(item));
      }
    }
    judgeHashSet(myHashSet, stdSet);

    for (let i = 0; i < testNum; ++i) {
      const random = generateRandom();
      expect(myHashSet.delete(random, isObject)).to.equal(stdSet.delete(random));
    }
    judgeHashSet(myHashSet, stdSet);
  });

  it('hash-set erase test', () => {
    stdSet.delete(myHashSet.begin().pointer);
    myHashSet.erase(myHashSet.begin());
    const el = myHashSet.rBegin().pointer;
    stdSet.delete(el);
    const iter = myHashSet.erase(myHashSet.rBegin());
    expect(iter.equals(myHashSet.rBegin())).to.equal(true);
    expect(myHashSet.length).to.equal(stdSet.size);
    const eraseQueue = [1, 10, 100, 1000];
    for (const index of eraseQueue) {
      const el = myHashSet.at(index);
      myHashSet.erase(myHashSet.find(el));
      stdSet.delete(el);
    }
    judgeHashSet(myHashSet, stdSet);
  });

  it('hash-set clear test', () => {
    myHashSet.clear();
    stdSet.clear();
    expect(myHashSet.front()).to.equal(undefined);
    expect(myHashSet.back()).to.equal(undefined);
    judgeHashSet(myHashSet, stdSet);

    if (arr[0] && typeof arr[0] === 'object') {
      for (const item of arr) {
        const hasOwnProperty = Object.hasOwnProperty.bind(item);
        expect(hasOwnProperty(
          myHashSet.HASH_TAG
        )).to.equal(false);
      }
    }

    expect(() => myHashSet.end().pointer).to.throw(RangeError);
  });
}

describe('hash-set test', () => {
  describe('hash-set Number test', () => {
    hashSetTest(generateRandomNumber);
  });

  describe('hash-set String test', () => {
    hashSetTest(generateRandomString);
  });

  describe('hash-set Symbol test', () => {
    hashSetTest(generateRandomSymbol);
  });

  if (typeof BigInt === 'function') {
    describe('hash-set BigInt test', () => {
      hashSetTest(generateRandomBigInt);
    });
  }

  describe('hash-set Object test', () => {
    hashSetTest(generateRandomObject);
  });

  describe('hash-set Function test', () => {
    hashSetTest(generateRandomFunction);
  });
});
