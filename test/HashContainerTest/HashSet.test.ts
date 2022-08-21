import HashContainerBase from '@/container/HashContainer/Base/index';
import { Vector, HashSet } from '@/index';

function generateRandom(low = 0, high = 1e6, fix = 6) {
  return (low + Math.random() * (high - low)).toFixed(fix);
}

const arr: string[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(generateRandom());
}

function judgeHashSet(myHashSet: HashSet<string>, stdSet: Set<string>) {
  expect(myHashSet.size()).toBe(stdSet.size);
  stdSet.forEach((element) => {
    expect(myHashSet.find(element)).toEqual(true);
  });
}

describe('HashSet test', () => {
  // @ts-ignore
  HashContainerBase.treeifyThreshold = 2;
  // @ts-ignore
  HashContainerBase.untreeifyThreshold = 1;
  test('constructor test', () => {
    // eslint-disable-next-line no-new
    expect(() => new HashSet([], 28)).toThrow(RangeError);
    expect(new HashSet().size()).toBe(0);
  });

  test('HashSet hash function test', () => {
    judgeHashSet(
      // @ts-ignore
      new HashSet(arr.map(x => Math.floor(Number(x)))),
      new Set(arr.map(x => Math.floor(Number(x))))
    );
  });

  const myHashSet = new HashSet(arr);
  const stdSet = new Set(arr);

  test('HashSet insert function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashSet.insert(i.toString());
      stdSet.add(i.toString());
      const random = generateRandom();
      myHashSet.insert(random);
      stdSet.add(random);
    }
    judgeHashSet(myHashSet, stdSet);
  });

  test('HashSet forEach function test', () => {
    myHashSet.forEach((element) => {
      expect(stdSet.has(element)).toEqual(true);
    });
    let cnt = 0;
    for (const element of myHashSet) {
      ++cnt;
      expect(stdSet.has(element)).toEqual(true);
    }
    expect(cnt).toBe(myHashSet.size());
  });

  test('HashSet eraseElementByKey function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashSet.eraseElementByKey(arr[i]);
      stdSet.delete(arr[i]);
      const random = generateRandom();
      myHashSet.eraseElementByKey(random);
      stdSet.delete(random);
    }
    judgeHashSet(myHashSet, stdSet);
  });

  test('HashSet clear function test', () => {
    myHashSet.clear();
    stdSet.clear();
    judgeHashSet(myHashSet, stdSet);
  });

  test('HashSet empty test', () => {
    expect(myHashSet.find('1')).toEqual(false);
    myHashSet.insert(arr[0]);
    myHashSet.insert(arr[0]);
    expect(myHashSet.size()).toBe(1);
    // @ts-ignore
    const bucketNum = myHashSet.bucketNum;
    // @ts-ignore
    myHashSet.bucketNum = HashContainerBase.maxBucketNum;
    // @ts-ignore
    myHashSet.reAllocate();
    // @ts-ignore
    myHashSet.hashTable[0] = new Vector();
    // @ts-ignore
    myHashSet.hashTable[myHashSet.bucketNum - 5] = new Vector();
    // @ts-ignore
    myHashSet.reAllocate(myHashSet.bucketNum);
    // @ts-ignore
    myHashSet.bucketNum = bucketNum;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, no-empty
    for (const _ of myHashSet) {}
  });
});
