import HashContainerBase from '@/container/HashContainer/Base/index';
import { LinkList, HashMap } from '@/index';

function generateRandom(low = 0, high = 1e6, fix = 6) {
  return (low + Math.random() * (high - low)).toFixed(fix);
}

const arr: string[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(generateRandom());
}

function judgeHashMap(myHashMap: HashMap<string, number>, stdMap: Map<string, number>) {
  expect(myHashMap.size()).toBe(stdMap.size);
  stdMap.forEach((value, key) => {
    expect(myHashMap.getElementByKey(key)).toEqual(value);
    expect(myHashMap.find(key)).toEqual(true);
  });
}

describe('HashMap test', () => {
  // @ts-ignore
  HashContainerBase.treeifyThreshold = 2;
  // @ts-ignore
  HashContainerBase.untreeifyThreshold = 1;
  const myHashMap = new HashMap(arr.map((element, index) => [element, index]));
  const stdMap = new Map(arr.map((element, index) => [element, index]));

  test('HashSet hash function test', () => {
    judgeHashMap(
      // @ts-ignore
      new HashMap(arr.map(x => [Math.floor(Number(x)), 1])),
      new Map(arr.map(x => [Math.floor(Number(x)), 1]))
    );
  });

  test('constructor test', () => {
    expect(new HashMap().size()).toBe(0);
  });

  test('HashMap setElement function test', () => {
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

  test('HashMap forEach function test', () => {
    myHashMap.forEach(([key, value]) => {
      expect(stdMap.get(key)).toEqual(value);
    });
    expect(myHashMap.find('-1')).toEqual(false);
    let cnt = 0;
    for (const element of myHashMap) {
      ++cnt;
      expect(stdMap.has(element[0])).toEqual(true);
    }
    expect(cnt).toBe(myHashMap.size());
  });

  test('HashMap eraseElementByKey function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashMap.eraseElementByKey(i.toString());
      stdMap.delete(i.toString());
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
    judgeHashMap(myHashMap, stdMap);
  });

  test('HashMap clear function test', () => {
    myHashMap.clear();
    stdMap.clear();
    judgeHashMap(myHashMap, stdMap);
  });

  test('HashMap empty test', () => {
    expect(myHashMap.eraseElementByKey('1')).toEqual(undefined);
    expect(myHashMap.find('1')).toEqual(false);
    for (let i = -1; i >= -1000; --i) {
      expect(myHashMap.getElementByKey(i.toString())).toEqual(undefined);
      expect(myHashMap.find(i.toString())).toEqual(false);
    }
    // @ts-ignore
    expect(myHashMap.reAllocate(HashContainerBase.maxBucketNum)).toEqual(undefined);
    // @ts-ignore
    myHashMap.hashTable[0] = new LinkList();
    // @ts-ignore
    myHashMap.hashTable[myHashMap.bucketNum - 5] = new LinkList();
    // @ts-ignore
    expect(myHashMap.reAllocate(myHashMap.bucketNum)).toEqual(undefined);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, no-empty
    for (const _ of myHashMap) {}
  });
});
