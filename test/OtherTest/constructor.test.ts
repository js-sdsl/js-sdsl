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

const containerArr = [
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

describe('iterator test', () => {
  it('empty constructor test', () => {
    for (const container of containerArr) {
      expect(container.size()).to.equal(0);
      expect(container.length).to.equal(0);
    }
  });
});
