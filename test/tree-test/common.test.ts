import { expect } from 'chai';
import { OrderedMap, OrderedSet, TreeContainer } from '@/index';

const testNum = 10000;
const arr: number[] = [];
for (let i = 0; i < testNum; ++i) {
  arr.push(i);
}

const treeContainerArr: TreeContainer<number, number | undefined>[] = [
  new OrderedSet(arr),
  new OrderedMap(arr.map((item, index) => [item, index]))
];

describe('TreeContainer common test', () => {
  it('has function test', () => {
    for (const container of treeContainerArr) {
      for (const item of arr) {
        expect(container.has(item)).to.equal(true);
      }
      for (let i = 0; i < 100; ++i) {
        container.delete(arr[i]);
        expect(container.has(arr[i])).to.equal(false);
      }
      for (let i = 0; i < 200; ++i) {
        if (container instanceof OrderedMap) {
          container.set(arr[i], undefined);
          expect(container.has(arr[i])).to.equal(true);
        }
      }
    }
  });
});
