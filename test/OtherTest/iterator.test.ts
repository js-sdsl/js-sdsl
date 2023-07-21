import { expect } from 'chai';
import {
  Vector,
  LinkList,
  Deque,
  OrderedSet,
  OrderedMap,
  Container,
  ContainerIterator,
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

const containerArr: Container<unknown>[] = [
  new Vector(arr),
  new LinkList(arr),
  new Deque(arr),
  new OrderedSet(arr),
  new OrderedMap(arr.map((element, index) => [index, element])),
  new HashSet(arr),
  new HashMap(arr.map((element, index) => [index, element]))
];

describe('iterator test', () => {
  it('normal iterator next function test', () => {
    for (const container of containerArr) {
      let index = 0;
      for (let it = container.begin() as ContainerIterator<unknown>;
        !it.equals(container.end() as ContainerIterator<unknown>);
        it = it.next()
      ) {
        expect(it.container).to.equal(container);
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((it as ContainerIterator<[number, number]>).pointer[1])
            .to.equal(arr[index++]);
        } else {
          expect(it.pointer).to.equal(arr[index++]);
        }
      }
    }
  });

  it('normal iterator pre function test', () => {
    for (const container of containerArr) {
      let index = arr.length - 1;
      for (let it = container.end().pre() as ContainerIterator<unknown>;
        !it.equals(container.begin() as ContainerIterator<unknown>);
        it = it.pre()
      ) {
        expect(it.container).to.equal(container);
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((it as ContainerIterator<[number, number]>).pointer[1])
            .to.equal(arr[index--]);
        } else {
          expect(it.pointer).to.equal(arr[index--]);
        }
      }
    }
  });

  it('reverse iterator next function test', () => {
    for (const container of containerArr) {
      let index = arr.length - 1;
      for (let it = container.rBegin() as ContainerIterator<unknown>;
        !it.equals(container.rEnd() as ContainerIterator<unknown>);
        it = it.next()
      ) {
        expect(it.container).to.equal(container);
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((it as ContainerIterator<[number, number]>).pointer[1])
            .to.equal(arr[index--]);
        } else {
          expect(it.pointer).to.equal(arr[index--]);
        }
      }
    }
  });

  it('reverse iterator pre function test', () => {
    for (const container of containerArr) {
      let index = 0;
      for (let it = container.rEnd().pre() as ContainerIterator<unknown>;
        !it.equals(container.rBegin() as ContainerIterator<unknown>);
        it = it.pre()
      ) {
        expect(it.container).to.equal(container);
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((it as ContainerIterator<[number, number]>).pointer[1])
            .to.equal(arr[index++]);
        } else {
          expect(it.pointer).to.equal(arr[index++]);
        }
      }
    }
  });

  for (const container of containerArr) {
    it('normal iterator next run time error test', () => {
      expect(() => container.end().next()).to.throw(RangeError);
    });

    it('normal iterator pre run time error test', () => {
      expect(() => container.begin().pre()).to.throw(RangeError);
    });

    it('reverse iterator next run time error test', () => {
      expect(() => container.rEnd().next()).to.throw(RangeError);
    });

    it('reverse iterator pre run time error test', () => {
      expect(() => container.rBegin().pre()).to.throw(RangeError);
    });
  }

  it('copy test', () => {
    for (const container of containerArr) {
      const iter = container.begin() as ContainerIterator<unknown>;
      const copy = iter.copy() as ContainerIterator<unknown>;
      iter.next();
      expect(iter.equals(copy)).to.equal(false);
      copy.next();
      expect(iter.equals(copy)).to.equal(true);
    }
    for (const container of containerArr) {
      const iter = container.end() as ContainerIterator<unknown>;
      const copy = iter.copy() as ContainerIterator<unknown>;
      iter.pre();
      expect(iter.equals(copy)).to.equal(false);
      copy.pre();
      expect(iter.equals(copy)).to.equal(true);
    }
    for (const container of containerArr) {
      const iter = container.rBegin() as ContainerIterator<unknown>;
      const copy = iter.copy() as ContainerIterator<unknown>;
      iter.next();
      expect(iter.equals(copy)).to.equal(false);
      copy.next();
      expect(iter.equals(copy)).to.equal(true);
    }
    for (const container of containerArr) {
      const iter = container.rEnd() as ContainerIterator<unknown>;
      const copy = iter.copy() as ContainerIterator<unknown>;
      iter.pre();
      expect(iter.equals(copy)).to.equal(false);
      copy.pre();
      expect(iter.equals(copy)).to.equal(true);
    }
  });

  it('eraseElementByIterator test', () => {
    for (const container of containerArr) {
      expect(() => container.eraseElementByIterator(container.end())).to.throw(RangeError);
      expect(() => container.eraseElementByIterator(container.rEnd())).to.throw(RangeError);
    }
  });

  it('isAccessible test', () => {
    for (const container of containerArr) {
      expect(container.begin().isAccessible()).to.equal(true);
      expect(container.begin().next().isAccessible()).to.equal(true);
      expect(container.end().isAccessible()).to.equal(false);
      expect(container.end().pre().isAccessible()).to.equal(true);
    }
  });
});
