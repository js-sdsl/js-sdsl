import { expect } from 'chai';
import {
  generateRandomNumber,
  generateRandomString,
  generateRandomSymbol,
  generateRandomBigInt,
  generateRandomObject,
  generateRandomFunction
} from '../utils/generateRandom';
import { HashMap } from '@/index';
import checkObject from '@/utils/checkObject';

const testNum = 10000;

function judgeHashMap(myHashMap: HashMap<unknown, unknown>, stdMap: Map<unknown, unknown>) {
  expect(myHashMap.length).to.equal(stdMap.size);
  let index = 0;
  stdMap.forEach((value, key) => {
    if (index === 0) {
      expect(myHashMap.front()).to.deep.equal([key, value]);
      expect(myHashMap.begin().pointer[0]).to.deep.equal(key);
    } else if (index === myHashMap.length - 1) {
      expect(myHashMap.back()).to.deep.equal([key, value]);
      expect(myHashMap.rBegin().pointer[0]).to.deep.equal(key);
    } else if (index <= 1000) {
      expect(myHashMap.at(index)).to.deep.equal([key, value]);
    }
    expect(myHashMap.get(key)).to.equal(value);
    expect(myHashMap.find(key).pointer[1]).to.equal(value);
    ++index;
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

  it('hash-map forEach test', () => {
    let i = 0;
    myHashMap.forEach((el, index, hashMap) => {
      expect(hashMap).to.equal(myHashMap);
      expect(stdMap.get(el[0])).to.equal(el[1]);
      expect(i++).to.equal(index);
    });
    expect(i).to.equal(stdMap.size);
  });

  it('hash-map find test', () => {
    for (let i = 0; i < testNum; ++i) {
      const random = generateRandom();
      const iter = myHashMap.find(random, isObject);
      if (iter.equals(myHashMap.end())) {
        expect(stdMap.has(random)).to.equal(false);
      } else {
        expect(iter.pointer[1]).to.equal(stdMap.get(random));
      }
      expect(myHashMap.get(random, isObject)).to.equal(stdMap.get(random));
    }
  });

  it('hash-map delete test', () => {
    for (const item of arr) {
      if (Math.random() > 0.6) {
        expect(myHashMap.delete(item, isObject)).to.equal(stdMap.delete(item));
      }
    }
    judgeHashMap(myHashMap, stdMap);

    for (let i = 0; i < testNum; ++i) {
      const random = generateRandom();
      expect(myHashMap.delete(random)).to.equal(stdMap.delete(random));
    }
    judgeHashMap(myHashMap, stdMap);
  });

  it('hash-map set test', () => {
    for (let i = 0; i < testNum; ++i) {
      stdMap.set(arr[i], i - 1);
      expect(myHashMap.set(arr[i], i - 1, isObject).size).to.equal(stdMap.size);
    }
    judgeHashMap(myHashMap, stdMap);
  });

  it('hash-map set iterator value test', () => {
    stdMap.forEach((value, key) => {
      const random = Math.random();
      myHashMap.find(key).pointer[1] = random;
      stdMap.set(key, random);
    });
    judgeHashMap(myHashMap, stdMap);

    // @ts-ignore
    expect(myHashMap.find(myHashMap.front()![0]).pointer['']).to.equal(undefined);

    // @ts-ignore
    // eslint-disable-next-line no-return-assign
    expect(() => myHashMap.find(myHashMap.front()![0]).pointer[3] = 5).to.throw(TypeError);

    expect(() => {
      for (let it = myHashMap.begin(); !it.equals(myHashMap.end()); it.next()) {
        const pointer = it.pointer;
        const [key, value] = pointer;
        expect(key).to.equal(pointer[0]);
        expect(value).to.equal(pointer[1]);
        pointer[1] = 2;
        const [_key, _value] = pointer;
        expect(_key).to.equal(pointer[0]);
        expect(_value).to.equal(2);
      }
    }).to.not.throw(Error);

    expect(() => {
      for (let it = myHashMap.begin(); !it.equals(myHashMap.end()); it.next()) {
        const pointer = it.pointer;
        const [key, value] = pointer;
        expect(key).to.equal(pointer[0]);
        expect(value).to.equal(pointer[1]);
        pointer[1] = 2;
        const [_key, _value] = pointer;
        expect(_key).to.equal(pointer[0]);
        expect(_value).to.equal(2);
      }
    }).to.not.throw(Error);
  });

  it('hash-map clear test', () => {
    myHashMap.clear();
    stdMap.clear();
    expect(myHashMap.front()).to.equal(undefined);
    expect(myHashMap.back()).to.equal(undefined);
    judgeHashMap(myHashMap, stdMap);

    if (arr[0] && typeof arr[0] === 'object') {
      for (const item of arr) {
        const hasOwnProperty = Object.hasOwnProperty.bind(item);
        expect(hasOwnProperty(
          myHashMap.HASH_TAG
        )).to.equal(false);
      }
    }

    expect(() => myHashMap.end().pointer).to.throw(RangeError);
  });
}

describe('hash-map test', () => {
  expect(checkObject(null)).to.equal(false);

  describe('hash-map Number test', () => {
    hashMapTest(generateRandomNumber);
  });

  describe('hash-map String test', () => {
    hashMapTest(generateRandomString);
  });

  describe('hash-map Symbol test', () => {
    hashMapTest(generateRandomSymbol);
  });

  if (typeof BigInt === 'function') {
    describe('hash-map BigInt test', () => {
      hashMapTest(generateRandomBigInt);
    });
  }

  describe('hash-map Object test', () => {
    hashMapTest(generateRandomObject);
  });

  describe('hash-map Function test', () => {
    hashMapTest(generateRandomFunction);
  });
});
