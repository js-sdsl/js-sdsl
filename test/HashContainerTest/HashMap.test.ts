import { HashMap } from '@/index';
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

const testNum = 10000;

function judgeHashMap(myHashMap: HashMap<unknown, unknown>, stdMap: Map<unknown, unknown>) {
  expect(myHashMap.size()).to.equal(stdMap.size);
  stdMap.forEach((value, key) => {
    expect(myHashMap.getElementByKey(key)).to.equal(value);
    expect(myHashMap.find(key)).to.equal(true);
  });
}

function hashMapTest(generateRandom: () => unknown) {
  const arr: unknown[] = [];
  for (let i = 0; i < testNum; ++i) {
    arr.push(generateRandom());
  }

  const stdMap = new Map<unknown, unknown>(
    arr.map(
      (el, index) => {
        return [el, index];
      }
    ));
  const myHashMap = new HashMap<unknown, unknown>(
    arr.map(
      (el, index) => {
        return [el, index];
      }
    ));
  judgeHashMap(myHashMap, stdMap);

  let i = 0;
  myHashMap.forEach((el, index, hashMap) => {
    expect(hashMap).to.equal(myHashMap);
    expect(stdMap.get(el[0])).to.equal(el[1]);
    expect(i++).to.equal(index);
  });

  for (let i = 0; i < testNum; ++i) {
    const random = generateRandom();
    expect(myHashMap.find(random)).to.equal(stdMap.has(random));
    expect(myHashMap.getElementByKey(random)).to.equal(stdMap.get(random));
  }

  i = 0;
  for (const item of myHashMap) {
    ++i;
    expect(stdMap.get(item[0])).to.equal(item[1]);
  }
  expect(i).to.equal(stdMap.size);

  for (const item of arr) {
    if (Math.random() > 0.6) {
      stdMap.delete(item);
      myHashMap.eraseElementByKey(item);
    }
  }
  judgeHashMap(myHashMap, stdMap);

  for (let i = 0; i < testNum; ++i) {
    const random = generateRandom();
    stdMap.delete(random);
    myHashMap.eraseElementByKey(random);
  }
  judgeHashMap(myHashMap, stdMap);

  for (let i = 0; i < testNum; ++i) {
    myHashMap.setElement(arr[i], i - 1);
    stdMap.set(arr[i], i - 1);
  }
  judgeHashMap(myHashMap, stdMap);

  for (let i = 0; i < testNum; ++i) {
    const random = generateRandom();
    stdMap.delete(random);
    myHashMap.setElement(random, undefined);
  }
  judgeHashMap(myHashMap, stdMap);

  myHashMap.clear();
  stdMap.clear();
  judgeHashMap(myHashMap, stdMap);

  if (arr[0] && typeof arr[0] === 'object') {
    for (const item of arr) {
      const hasOwnProperty = Object.hasOwnProperty.bind(item);
      expect(hasOwnProperty(
        // @ts-ignore
        myHashMap.HASH_KEY_TAG
      )).to.equal(false);
    }
  }
}

describe('HashMap test', () => {
  it('HashMap Number test', () => {
    hashMapTest(generateRandomNumber);
  });

  it('HashMap String test', () => {
    hashMapTest(generateRandomString);
  });

  it('HashMap Symbol test', () => {
    hashMapTest(generateRandomSymbol);
  });

  it('HashMap BigInt test', () => {
    hashMapTest(generateRandomBigInt);
  });

  it('HashMap Boolean test', () => {
    hashMapTest(generateRandomBoolean);
  });

  it('HashMap Null test', () => {
    hashMapTest(generateRandomNull);
  });

  it('HashMap Object test', () => {
    hashMapTest(generateRandomObject);
  });

  it('HashMap Function test', () => {
    hashMapTest(generateRandomFunction);
  });
});
