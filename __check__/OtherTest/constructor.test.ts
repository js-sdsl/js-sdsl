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
  test('empty constructor test', () => {
    for (const container of containerArr) {
      expect(container.size()).toEqual(0);
    }
  });
});
