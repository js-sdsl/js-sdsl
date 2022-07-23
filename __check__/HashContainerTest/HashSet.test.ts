import { HashSet } from '@/index';

const arr: number[] = [];
const testNum = 200000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeHashSet(myHashSet: HashSet<number>, stdSet: Set<number>) {
  expect(myHashSet.size()).toBe(stdSet.size);
  stdSet.forEach((element) => {
    expect(myHashSet.find(element)).toEqual(true);
  });
  myHashSet.forEach((element) => {
    expect(stdSet.has(element)).toEqual(true);
  });
}

describe('HashSet test', () => {
  const myHashSet = new HashSet(arr);
  const stdSet = new Set(arr);

  test('HashSet insert function test', () => {
    for (let i = 0; i < testNum; ++i) {
      const random = Math.floor(Math.random() * 1000000);
      myHashSet.insert(random);
      stdSet.add(random);
    }
    judgeHashSet(myHashSet, stdSet);
  });

  test('HashSet eraseElementByValue function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashSet.eraseElementByValue(arr[i]);
      stdSet.delete(arr[i]);
      const random = Math.random() * 1000000;
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
});
