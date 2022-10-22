import { Stack } from 'dist/isolate/stack';
import { Queue } from 'dist/isolate/queue';
import { Vector } from 'dist/isolate/vector';
import { LinkList } from 'dist/isolate/link-list';
import { Deque } from 'dist/isolate/deque';
import { OrderedSet } from 'dist/isolate/ordered-set';
import { OrderedMap } from 'dist/isolate/ordered-map';
import { HashSet } from 'dist/isolate/hash-set';
import { HashMap } from 'dist/isolate/hash-map';
import { expect } from 'chai';

describe('isolation test', () => {
  const arr = [1, 2, 3];
  const containerArr = [
    new Stack(arr),
    new Queue(arr),
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
