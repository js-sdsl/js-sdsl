import { expect } from 'chai';
import { Deque } from 'dist/isolate/deque';
import { HashMap } from 'dist/isolate/hash-map';
import { HashSet } from 'dist/isolate/hash-set';
import { LinkList } from 'dist/isolate/link-list';
import { OrderedMap } from 'dist/isolate/ordered-map';
import { OrderedSet } from 'dist/isolate/ordered-set';
import { PriorityQueue } from 'dist/isolate/priority-queue';
import { Queue } from 'dist/isolate/queue';
import { Stack } from 'dist/isolate/stack';
import { Vector } from 'dist/isolate/vector';

describe('isolation test', () => {
  const arr = [3, 1, 2];
  const containerArr = [
    new Stack(arr),
    new Queue(arr),
    new PriorityQueue(arr),
    new Vector(arr),
    new LinkList(arr),
    new Deque(arr),
    new OrderedSet(arr),
    new OrderedMap(arr.map((element, index) => [element, index])),
    new HashSet(arr),
    new HashMap(arr.map((element, index) => [element, index]))
  ];
  it('base test', () => {
    containerArr.forEach(container => expect(container.size()).equal(arr.length));
  });
});
