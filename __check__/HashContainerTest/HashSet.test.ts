import { HashSet } from '@/index';
import { ContainerInitError } from '@/utils/error';

const arr: number[] = [];
const testNum = 100000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeHashSet(myHashSet: HashSet<number>, stdSet: Set<number>) {
  expect(myHashSet.size()).toBe(stdSet.size);
  stdSet.forEach((element) => {
    expect(myHashSet.find(element)).toEqual(true);
  });
}

describe('HashSet test', () => {
  test('constructor test', () => {
    // eslint-disable-next-line no-new
    expect(() => new HashSet([], 28)).toThrow(ContainerInitError);
  });

  test('HashSet hash function test', () => {
    const myHashSet = new HashSet(arr.map(x => JSON.stringify(x)));
    const stdSet = new Set(arr.map(x => JSON.stringify(x)));
    // @ts-ignore
    judgeHashSet(myHashSet, stdSet);
  });

  const myHashSet = new HashSet(arr);
  const stdSet = new Set(arr);

  test('HashSet insert function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashSet.insert(i);
      stdSet.add(i);
      const random = Math.floor(Math.random() * testNum * 10);
      myHashSet.insert(random);
      stdSet.add(random);
    }
    judgeHashSet(myHashSet, stdSet);
  });

  test('HashSet forEach function test', () => {
    myHashSet.forEach((element) => {
      expect(stdSet.has(element)).toEqual(true);
    });
  });

  test('HashSet eraseElementByValue function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashSet.eraseElementByValue(arr[i]);
      stdSet.delete(arr[i]);
      const random = Math.floor(Math.random() * testNum * 10);
      myHashSet.eraseElementByValue(random);
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
    expect(myHashSet.find(1)).toEqual(false);
  });
});
