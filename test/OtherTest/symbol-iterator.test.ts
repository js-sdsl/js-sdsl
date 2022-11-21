import { expect } from 'chai';
import {
  Vector,
  LinkList,
  Deque,
  OrderedSet,
  OrderedMap,
  HashSet,
  HashMap
} from '@/index';

let arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}
arr = Array.from(new Set(arr));
arr.sort((x, y) => x - y);

const containerArr = [
  new Vector(arr),
  new LinkList(arr),
  new Deque(arr),
  new OrderedSet(arr),
  new OrderedMap(arr.map((element, index) => [index, element])),
  new HashSet(arr),
  new HashMap(arr.map((element, index) => [index, element]))
];

describe('symbol iterator test', () => {
  it('HashSet symbol iterator test', () => {
    const myHashSet = new HashSet(arr);
    const st = new Set(arr);
    for (const element of myHashSet) {
      expect(st.has(element)).to.equal(true);
      st.delete(element);
    }
    expect(st.size).to.equal(0);
  });

  it('HashSet symbol iterator test', () => {
    const myHashMap = new HashMap(arr.map((element, index) => [index, element]));
    const mp = new Map(arr.map((element, index) => [index, element]));
    for (const element of myHashMap) {
      expect(element[1]).to.equal(mp.get(element[0]));
      mp.delete(element[0]);
    }
    expect(mp.size).to.equal(0);
  });

  it('non-hash-container symbol iterator test', () => {
    for (const container of containerArr) {
      let index = 0;
      for (const element of container) {
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((element as [number, number])[1])
            .to.equal(arr[index++]);
        } else {
          expect(element).to.equal(arr[index++]);
        }
      }
    }
  });

  it('forEach test', () => {
    const baseArr = [...containerArr, new HashSet([1]), new HashMap([[1, 1] as [number, number]])];
    baseArr.forEach(container =>
      container.forEach((element, index, _container) =>
        expect(container === _container).to.equal(true)
      ));
  });
});
