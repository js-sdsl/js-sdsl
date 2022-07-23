import { HashMap } from '@/index';

const arr: number[] = [];
const testNum = 100000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeHashMap(myHashMap: HashMap<number, number>, stdMap: Map<number, number>) {
  expect(myHashMap.size()).toBe(stdMap.size);
  stdMap.forEach((value, key) => {
    expect(myHashMap.find(key)).toEqual(true);
  });
  myHashMap.forEach(([key, value]) => {
    expect(stdMap.get(key)).toEqual(value);
  });
}

describe('HashMap test', () => {
  const myHashMap = new HashMap(arr.map((element, index) => [element, index]));
  const stdMap = new Map(arr.map((element, index) => [element, index]));

  test('HashMap setElement function test', () => {
    for (let i = 0; i <= testNum; ++i) {
      myHashMap.setElement(i, i);
      stdMap.set(i, i);
    }
    for (let i = testNum; i < testNum * 2; ++i) {
      const random = Math.floor(Math.random() * 1000000);
      myHashMap.setElement(random, i);
      stdMap.set(random, i);
    }
    judgeHashMap(myHashMap, stdMap);
  });

  test('HashMap eraseElementByValue function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashMap.eraseElementByKey(i);
      stdMap.delete(i);
    }
    judgeHashMap(myHashMap, stdMap);
  });

  test('HashMap clear function test', () => {
    myHashMap.clear();
    stdMap.clear();
    judgeHashMap(myHashMap, stdMap);
  });
});
