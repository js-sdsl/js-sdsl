import { expect } from 'chai';
import {
  Vector,
  LinkList,
  Deque,
  OrderedSet,
  OrderedMap,
  Container,
  Iterator,
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
      for (let it = container.begin() as Iterator<unknown>;
        !it.equals(container.end() as Iterator<unknown>);
        it = it.next()
      ) {
        expect(it.container).to.equal(container);
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((it as Iterator<[number, number]>).pointer[1])
            .to.equal(arr[index++]);
        } else {
          expect(it.pointer).to.equal(arr[index++]);
        }
      }
    }
  });

  it('normal iterator prev function test', () => {
    for (const container of containerArr) {
      let index = arr.length - 1;
      for (let it = container.end().prev() as Iterator<unknown>;
        !it.equals(container.begin() as Iterator<unknown>);
        it = it.prev()
      ) {
        expect(it.container).to.equal(container);
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((it as Iterator<[number, number]>).pointer[1])
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
      for (let it = container.rBegin() as Iterator<unknown>;
        !it.equals(container.rEnd() as Iterator<unknown>);
        it = it.next()
      ) {
        expect(it.container).to.equal(container);
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((it as Iterator<[number, number]>).pointer[1])
            .to.equal(arr[index--]);
        } else {
          expect(it.pointer).to.equal(arr[index--]);
        }
      }
    }
  });

  it('reverse iterator prev function test', () => {
    for (const container of containerArr) {
      let index = 0;
      for (let it = container.rEnd().prev() as Iterator<unknown>;
        !it.equals(container.rBegin() as Iterator<unknown>);
        it = it.prev()
      ) {
        expect(it.container).to.equal(container);
        if (container instanceof OrderedMap || container instanceof HashMap) {
          expect((it as Iterator<[number, number]>).pointer[1])
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

    it('normal iterator prev run time error test', () => {
      expect(() => container.begin().prev()).to.throw(RangeError);
    });

    it('reverse iterator next run time error test', () => {
      expect(() => container.rEnd().next()).to.throw(RangeError);
    });

    it('reverse iterator prev run time error test', () => {
      expect(() => container.rBegin().prev()).to.throw(RangeError);
    });
  }

  it('copy test', () => {
    for (const container of containerArr) {
      const iter = container.begin() as Iterator<unknown>;
      const copy = iter.copy() as Iterator<unknown>;
      iter.next();
      expect(iter.equals(copy)).to.equal(false);
      copy.next();
      expect(iter.equals(copy)).to.equal(true);
    }
    for (const container of containerArr) {
      const iter = container.end() as Iterator<unknown>;
      const copy = iter.copy() as Iterator<unknown>;
      iter.prev();
      expect(iter.equals(copy)).to.equal(false);
      copy.prev();
      expect(iter.equals(copy)).to.equal(true);
    }
    for (const container of containerArr) {
      const iter = container.rBegin() as Iterator<unknown>;
      const copy = iter.copy() as Iterator<unknown>;
      iter.next();
      expect(iter.equals(copy)).to.equal(false);
      copy.next();
      expect(iter.equals(copy)).to.equal(true);
    }
    for (const container of containerArr) {
      const iter = container.rEnd() as Iterator<unknown>;
      const copy = iter.copy() as Iterator<unknown>;
      iter.prev();
      expect(iter.equals(copy)).to.equal(false);
      copy.prev();
      expect(iter.equals(copy)).to.equal(true);
    }
  });

  it('erase test', () => {
    for (const container of containerArr) {
      expect(() => container.erase(container.end())).to.throw(RangeError);
      expect(() => container.erase(container.rEnd())).to.throw(RangeError);
    }
  });

  it('isAccessible test', () => {
    for (const container of containerArr) {
      expect(container.begin().isAccessible()).to.equal(true);
      expect(container.begin().next().isAccessible()).to.equal(true);
      expect(container.end().isAccessible()).to.equal(false);
      expect(container.end().prev().isAccessible()).to.equal(true);
    }
  });
});
