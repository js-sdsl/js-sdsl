import { expect } from 'chai';
import {
  Vector,
  LinkList,
  Deque,
  OrderedSet,
  OrderedMap,
  HashSet,
  HashMap,
  Stack,
  Queue,
  PriorityQueue
} from '@/index';

const arr: [number, number][] = [];
for (let i = 0; i < 100; ++i) {
  arr.push([i + 1, i - 1]);
}

const containerArr = [
  new Vector(arr),
  new LinkList(arr),
  new Deque(arr),
  new OrderedSet(arr, function (a, b) {
    return a[0] - b[0];
  }),
  new OrderedMap(arr),
  new HashSet(arr),
  new HashMap(arr)
];

describe('common test', () => {
  it('empty constructor test', () => {
    const copyContainerArr = [
      new Stack(),
      new Queue(),
      new PriorityQueue(),
      new Vector(),
      new LinkList(),
      new Deque(),
      new OrderedSet(),
      new OrderedMap(),
      new HashSet(),
      new HashMap()
    ];
    for (const container of copyContainerArr) {
      expect(container.size).to.equal(0);
      expect(container.size).to.equal(0);
      expect(container.length).to.equal(0);
      expect(container.length).to.equal(0);
    }
  });

  it('constructor test', () => {
    const copyContainerArr = [
      new Stack(arr),
      new Queue(arr),
      new PriorityQueue(arr),
      ...containerArr
    ];
    for (const container of copyContainerArr) {
      expect(container.size).to.equal(arr.length);
      expect(container.size).to.equal(arr.length);
      expect(container.length).to.equal(arr.length);
      expect(container.length).to.equal(arr.length);
    }
  });

  it('some function test', () => {
    for (const container of containerArr) {
      expect(container.some(function (item, index) {
        return arr[index][0] !== item[0] || arr[index][1] !== item[1];
      })).to.equal(false);

      expect(container.some(function (item, index) {
        return arr[index][0] === item[0] && arr[index][1] === item[1];
      })).to.equal(true);
    }
  });

  it('every function test', () => {
    for (const container of containerArr) {
      expect(container.every(function (item, index) {
        return arr[index][0] === item[0] && arr[index][1] === item[1];
      })).to.equal(true);

      expect(container.every(function (item, index) {
        return arr[index][0] !== item[0] || arr[index][1] !== item[1];
      })).to.equal(false);
    }
  });

  it('filter function test', () => {
    for (const container of containerArr) {
      expect(container.filter(function (item) {
        return Math.floor((item[0] + item[1]) * 2 / 5);
      }).toArray()).to.deep.equal(arr.filter(function (item) {
        return Math.floor((item[0] + item[1]) * 2 / 5);
      }));
    }
  });

  it('entries function test', () => {
    for (const container of containerArr) {
      let index = 0;
      for (const [key, value] of container.entries()) {
        const keyIsArray = Array.isArray(key);
        const valueIsArray = Array.isArray(value);
        if (keyIsArray && valueIsArray) {
          expect(key).to.deep.equal(arr[index]);
          expect(value).to.deep.equal(arr[index]);
        } else if (!keyIsArray && !valueIsArray) {
          expect([key, value]).to.deep.equal(arr[index]);
        } else {
          expect(key).to.equal(index);
          expect(value).to.deep.equal(arr[index]);
        }
        index += 1;
      }
      expect(index).to.equal(arr.length);
    }
  });

  it('values function test', () => {
    for (const container of containerArr) {
      let index = 0;
      for (const value of container.values()) {
        const valueIsArray = Array.isArray(value);
        if (valueIsArray) {
          expect(value).to.deep.equal(arr[index]);
        } else {
          expect(value).to.deep.equal(arr[index][1]);
        }
        index += 1;
      }
      expect(index).to.equal(arr.length);
    }
  });

  it('toArray function test', () => {
    for (const container of containerArr) {
      expect(container.toArray()).to.deep.equal(arr);
    }
  });
});
