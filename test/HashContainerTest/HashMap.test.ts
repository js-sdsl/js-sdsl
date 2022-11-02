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
import { HashMap } from '@/index';
import checkObject from '@/utils/checkObject';

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

  const isObject = checkObject(arr[0]);

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
    expect(myHashMap.find(random, isObject)).to.equal(stdMap.has(random));
    expect(myHashMap.getElementByKey(random, isObject)).to.equal(stdMap.get(random));
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
      myHashMap.eraseElementByKey(item, isObject);
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
    stdMap.set(arr[i], i - 1);
    myHashMap.setElement(arr[i], i - 1, isObject);
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

  if (typeof BigInt === 'function') {
    it('HashMap BigInt test', () => {
      hashMapTest(generateRandomBigInt);
    });
  }

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
