import { expect } from 'chai';
import { HashMap } from '@/index';
import { generateRandom } from '../utils/generateRandom';

const arr: (string | number)[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(generateRandom());
}

function judgeHashMap(
  myHashMap: HashMap<string | number, number>,
  stdMap: Map<string | number, number>
) {
  expect(myHashMap.size()).to.equal(stdMap.size);
  stdMap.forEach((value, key) => {
    expect(myHashMap.getElementByKey(key)).to.equal(value);
    expect(myHashMap.find(key)).to.equal(true);
  });
}

describe('HashMap test', () => {
  const myHashMap = new HashMap(arr.map((element, index) => [element, index]));
  const stdMap = new Map(arr.map((element, index) => [element, index]));

  it('HashSet hash function test', () => {
    judgeHashMap(
      // @ts-ignore
      new HashMap(arr.map(x => [Math.floor(Number(x)), 1])),
      new Map(arr.map(x => [Math.floor(Number(x)), 1]))
    );
  });

  it('constructor test', () => {
    expect(new HashMap().size()).to.equal(0);
  });

  it('HashMap setElement function test', () => {
    for (let i = 0; i <= testNum; ++i) {
      myHashMap.setElement(i.toString(), i);
      stdMap.set(i.toString(), i);
    }
    for (let i = 0; i <= testNum / 10; ++i) {
      myHashMap.setElement(i.toString(), i);
    }
    for (let i = testNum; i < testNum * 2; ++i) {
      const random = generateRandom();
      myHashMap.setElement(random, i);
      stdMap.set(random, i);
    }
    judgeHashMap(myHashMap, stdMap);
  });

  it('HashMap forEach function test', () => {
    myHashMap.forEach(([key, value]) => {
      expect(stdMap.get(key)).to.equal(value);
    });
    expect(myHashMap.find('-1')).to.equal(false);
    let cnt = 0;
    for (const element of myHashMap) {
      ++cnt;
      expect(stdMap.has(element[0])).to.equal(true);
    }
    expect(cnt).to.equal(myHashMap.size());
  });

  it('HashMap eraseElementByKey function test', () => {
    for (let i = 0; i < testNum; ++i) {
      const str = i.toString();
      myHashMap.eraseElementByKey(str);
      stdMap.delete(str);
    }
    judgeHashMap(myHashMap, stdMap);
  });

  it('HashMap clear function test', () => {
    myHashMap.clear();
    stdMap.clear();
    judgeHashMap(myHashMap, stdMap);
  });

  it('HashMap empty test', () => {
    myHashMap.eraseElementByKey('1');
    expect(myHashMap.find('1')).to.equal(false);
    for (let i = -1; i >= -1000; --i) {
      expect(myHashMap.getElementByKey(i.toString())).to.equal(undefined);
      expect(myHashMap.find(i.toString())).to.equal(false);
    }
    // eslint-disable-next-line no-empty, @typescript-eslint/no-unused-vars
    for (const _ of myHashMap) {}
  });

  it('HashMap normal test', () => {
    const mp = new HashMap<string | number, number>();
    const stdMap = new Map();
    for (let i = 0; i < testNum; ++i) {
      const str = i.toString();
      mp.setElement(str, i);
      stdMap.set(str, i);
    }
    judgeHashMap(mp, stdMap);
    let size = testNum;
    for (let i = 0; i < testNum; ++i) {
      mp.eraseElementByKey(i.toString());
      expect(mp.size()).to.equal(--size);
    }
    expect(mp.size()).to.equal(0);
  });

  it('HashMap hash func test', () => {
    const normalMap = new HashMap<string | number, number>();
    const mp = new HashMap<string | number, number>([], () => -1);
    const stdMap = new Map<string, number>();
    const arr: string[] = [];
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      mp.setElement(random, i);
      normalMap.setElement(random, i);
      stdMap.set(random, i);
      arr.push(random);
    }
    judgeHashMap(normalMap, stdMap);
    judgeHashMap(mp, stdMap);
    for (let i = 0; i < testNum; ++i) {
      if (Math.random() > 0.5) {
        mp.eraseElementByKey(arr[i]);
        normalMap.eraseElementByKey(arr[i]);
        stdMap.delete(arr[i]);
      }
    }
    judgeHashMap(normalMap, stdMap);
    judgeHashMap(mp, stdMap);
    arr.length = 0;
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      mp.setElement(random, i);
      normalMap.setElement(random, i);
      stdMap.set(random, i);
      arr.push(random);
    }
    judgeHashMap(normalMap, stdMap);
    judgeHashMap(mp, stdMap);
    for (let i = 0; i < testNum; ++i) {
      if (Math.random() > 0.5) {
        mp.eraseElementByKey(arr[i]);
        normalMap.eraseElementByKey(arr[i]);
        stdMap.delete(arr[i]);
      }
    }
    judgeHashMap(normalMap, stdMap);
    judgeHashMap(mp, stdMap);
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      mp.setElement(random, i);
      normalMap.setElement(random, i);
      stdMap.set(random, i);
      arr.push(random);
    }
    judgeHashMap(normalMap, stdMap);
    judgeHashMap(mp, stdMap);
    for (let i = 0; i < testNum; ++i) {
      mp.eraseElementByKey(arr[i]);
      normalMap.eraseElementByKey(arr[i]);
      stdMap.delete(arr[i]);
    }
    judgeHashMap(normalMap, stdMap);
    judgeHashMap(mp, stdMap);
    normalMap.clear();
    mp.clear();
    stdMap.clear();
  });

  it('difficult test', () => {
    const hashMapList: HashMap<string | number, number>[] = [];
    for (let i = -10; i <= 10; ++i) {
      hashMapList.push(new HashMap<string | number, number>([], () => i));
    }
    const arr: string[] = [];
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      stdMap.set(random, i);
      hashMapList.forEach(mp => {
        mp.setElement(random, i);
        expect(mp.getElementByKey('-1')).to.equal(undefined);
        expect(mp.find('-1')).to.equal(false);
      });
      arr.push(random);
    }
    hashMapList.forEach(mp => judgeHashMap(mp, stdMap));
    arr.forEach(v => {
      stdMap.delete(v);
      hashMapList.forEach(mp => mp.eraseElementByKey(v));
    });
    hashMapList.forEach(mp => judgeHashMap(mp, stdMap));
  });
});
