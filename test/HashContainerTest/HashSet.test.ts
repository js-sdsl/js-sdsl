import { expect } from 'chai';
import {
  generateRandomNumber,
  generateRandomString,
  generateRandomSymbol,
  generateRandomBigInt,
  generateRandomBoolean,
  generateRandomNull,
  generateRandomObject,
  generateRandomFunction
} from '../utils/generateRandom';
import { HashSet } from '@/index';
import checkObject from '@/utils/checkObject';

const testNum = 10000;

function judgeHashSet(myHashSet: HashSet<unknown>, stdSet: Set<unknown>) {
  expect(myHashSet.size()).to.equal(stdSet.size);
  stdSet.forEach(element => {
    expect(myHashSet.find(element)).to.equal(true);
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

  let i = 0;
  myHashSet.forEach((el, index, hashSet) => {
    expect(hashSet).to.equal(myHashSet);
    expect(stdSet.has(el)).to.equal(true);
    expect(i++).to.equal(index);
  });
  expect(i).to.equal(stdSet.size);

  for (let i = 0; i < testNum; ++i) {
    const random = generateRandom();
    expect(myHashSet.find(random, isObject)).to.equal(stdSet.has(random));
  }

  i = 0;
  for (const item of myHashSet) {
    ++i;
    expect(stdSet.has(item)).to.equal(true);
  }
  expect(i).to.equal(stdSet.size);

  for (const item of arr) {
    if (Math.random() > 0.6) {
      stdSet.delete(item);
      myHashSet.eraseElementByKey(item, isObject);
    }
  }
  judgeHashSet(myHashSet, stdSet);

  for (let i = 0; i < testNum; ++i) {
    const random = generateRandom();
    stdSet.delete(random);
    myHashSet.eraseElementByKey(random, isObject);
  }
  judgeHashSet(myHashSet, stdSet);

  myHashSet.clear();
  stdSet.clear();
  judgeHashSet(myHashSet, stdSet);

  if (arr[0] && typeof arr[0] === 'object') {
    for (const item of arr) {
      const hasOwnProperty = Object.hasOwnProperty.bind(item);
      expect(hasOwnProperty(
        // @ts-ignore
        myHashSet.HASH_KEY_TAG
      )).to.equal(false);
    }
  }
}

describe('HashSet test', () => {
  it('HashSet Number test', () => {
    hashSetTest(generateRandomNumber);
  });

  it('HashSet String test', () => {
    hashSetTest(generateRandomString);
  });

  it('HashSet Symbol test', () => {
    hashSetTest(generateRandomSymbol);
  });

  if (typeof BigInt === 'function') {
    it('HashSet BigInt test', () => {
      hashSetTest(generateRandomBigInt);
    });
  }

  it('HashSet Boolean test', () => {
    hashSetTest(generateRandomBoolean);
  });

  it('HashSet Null test', () => {
    hashSetTest(generateRandomNull);
  });

  it('HashSet Object test', () => {
    hashSetTest(generateRandomObject);
  });

  it('HashSet Function test', () => {
    hashSetTest(generateRandomFunction);
  });
});
