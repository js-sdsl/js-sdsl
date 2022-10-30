import { HashMap } from '@/index';
import { expect } from 'chai';

function generateRandom(low = 0, high = 1e6, fix = 6) {
  return (low + Math.random() * (high - low)).toFixed(fix);
}

const arr: string[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(generateRandom());
}

function judgeHashMap(myHashMap: HashMap<string, number>, stdMap: Map<string, number>) {
  expect(myHashMap.size()).to.equal(stdMap.size);
  stdMap.forEach((value, key) => {
    if (myHashMap.getElementByKey(key) !== value) {
      console.error('1');
    }
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
    myHashMap.eraseElementByKey('-1');
    myHashMap.eraseElementByKey('-2');
    myHashMap.eraseElementByKey('-3');
    myHashMap.eraseElementByKey('-4');
    myHashMap.eraseElementByKey('-5');
    myHashMap.eraseElementByKey('-6');
    myHashMap.eraseElementByKey('-7');
    myHashMap.eraseElementByKey('-8');
    myHashMap.eraseElementByKey('-9');
    expect(myHashMap.getElementByKey('-1')).to.equal(undefined);
    expect(myHashMap.getElementByKey('-2')).to.equal(undefined);
    expect(myHashMap.getElementByKey('-3')).to.equal(undefined);
    expect(myHashMap.getElementByKey('-4')).to.equal(undefined);
    expect(myHashMap.getElementByKey('-5')).to.equal(undefined);
    expect(myHashMap.getElementByKey('-6')).to.equal(undefined);
    expect(myHashMap.getElementByKey('-7')).to.equal(undefined);
    expect(myHashMap.getElementByKey('-8')).to.equal(undefined);
    expect(myHashMap.getElementByKey('-9')).to.equal(undefined);
    expect(myHashMap.find('-1')).to.equal(false);
    expect(myHashMap.find('-2')).to.equal(false);
    expect(myHashMap.find('-3')).to.equal(false);
    expect(myHashMap.find('-4')).to.equal(false);
    expect(myHashMap.find('-5')).to.equal(false);
    expect(myHashMap.find('-6')).to.equal(false);
    expect(myHashMap.find('-7')).to.equal(false);
    expect(myHashMap.find('-8')).to.equal(false);
    expect(myHashMap.find('-9')).to.equal(false);
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
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, no-empty
    for (const _ of myHashMap) {}
  });

  it('HashMap normal test', () => {
    const mp = new HashMap<string, number>();
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
    const mp = new HashMap<string, number>([]);
    const stdMap = new Map<string, number>();
    const arr: string[] = [];
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      mp.setElement(random, i);
      stdMap.set(random, i);
      arr.push(random);
    }
    judgeHashMap(mp, stdMap);
    for (let i = 0; i < testNum; ++i) {
      if (Math.random() > 0.5) {
        mp.eraseElementByKey(arr[i]);
        stdMap.delete(arr[i]);
      }
    }
    judgeHashMap(mp, stdMap);
    arr.length = 0;
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      mp.setElement(random, i);
      stdMap.set(random, i);
      arr.push(random);
    }
    judgeHashMap(mp, stdMap);
    for (let i = 0; i < testNum; ++i) {
      if (Math.random() > 0.5) {
        mp.eraseElementByKey(arr[i]);
        stdMap.delete(arr[i]);
      }
    }
    judgeHashMap(mp, stdMap);
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      mp.setElement(random, i);
      stdMap.set(random, i);
      arr.push(random);
    }
    judgeHashMap(mp, stdMap);
    for (let i = 0; i < testNum; ++i) {
      mp.eraseElementByKey(arr[i]);
      stdMap.delete(arr[i]);
    }
    judgeHashMap(mp, stdMap);
    mp.clear();
    stdMap.clear();
  });
});
