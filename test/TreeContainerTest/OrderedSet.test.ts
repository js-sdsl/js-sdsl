import { expect } from 'chai';
import { Vector, OrderedSet } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeSet(myOrderedSet: OrderedSet<number>, myVector: Vector<number>) {
  expect(myOrderedSet.getHeight()).to.lessThan(2 * Math.log2(myOrderedSet.size() + 1) + 1);
  expect(myOrderedSet.size()).to.equal(myVector.size());
  myVector.sort((x, y) => x - y);
  myOrderedSet.forEach((element, index) => {
    expect(element).to.equal(myVector.getElementByPos(index));
  });
}

describe('OrderedSet test', () => {
  const myOrderedSet = new OrderedSet(arr);
  const myVector = new Vector(new Set(arr));

  it('OrderedSet insert function test', () => {
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * testNum * 10;
      expect(myOrderedSet.insert(random)).to.equal(myVector.pushBack(random));
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('OrderedSet eraseElementByKey function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      const pos = Math.floor(Math.random() * myVector.size());
      const eraseValue = myVector.getElementByPos(pos);
      myVector.eraseElementByPos(pos);
      expect(myOrderedSet.eraseElementByKey(eraseValue)).to.equal(true);
      expect(myOrderedSet.eraseElementByKey(-Math.random())).to.equal(false);
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('OrderedSet union function test', () => {
    const otherOrderedSet = new OrderedSet<number>();
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * testNum * 10;
      otherOrderedSet.insert(random);
      myVector.pushBack(random);
    }
    expect(myOrderedSet.union(otherOrderedSet)).to.equal(myVector.length);
    judgeSet(myOrderedSet, myVector);
  });

  it('OrderedSet eraseElementByPos function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      const pos = Math.floor(Math.random() * myVector.size());
      expect(myOrderedSet.eraseElementByPos(pos)).to.equal(myVector.eraseElementByPos(pos));
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('OrderedSet find function test', () => {
    myVector.forEach((element: number) => {
      expect(myOrderedSet.find(element).pointer).to.equal(element);
    });
  });

  myVector.sort((x: number, y: number) => x - y);

  it('OrderedSet binary search function test', () => {
    for (let i = 0; i < myVector.size(); ++i) {
      expect(myOrderedSet.lowerBound(myVector.getElementByPos(i)).pointer)
        .to.equal(myVector.getElementByPos(i));
      if (i !== myVector.size() - 1) {
        expect(myOrderedSet.upperBound(myVector.getElementByPos(i)).pointer)
          .to.equal(myVector.getElementByPos(i + 1));
      }
      if (i !== 0) {
        const mid = (myVector.getElementByPos(i) + myVector.getElementByPos(i - 1)) / 2;
        expect(myOrderedSet.lowerBound(mid).pointer)
          .to.equal(myVector.getElementByPos(i));
        expect(myOrderedSet.upperBound(mid).pointer)
          .to.equal(myVector.getElementByPos(i));
      }
    }
  });

  it('OrderedSet reverse binary search function test', () => {
    for (let i = 0; i < myVector.size(); ++i) {
      expect(myOrderedSet.reverseLowerBound(myVector.getElementByPos(i)).pointer)
        .to.equal(myVector.getElementByPos(i));
      if (i !== 0) {
        expect(myOrderedSet.reverseUpperBound(myVector.getElementByPos(i)).pointer)
          .to.equal(myVector.getElementByPos(i - 1));
      }
      if (i !== 0) {
        const mid = (myVector.getElementByPos(i) + myVector.getElementByPos(i - 1)) / 2;
        expect(myOrderedSet.reverseLowerBound(mid).pointer)
          .to.equal(myVector.getElementByPos(i - 1));
        expect(myOrderedSet.reverseUpperBound(mid).pointer)
          .to.equal(myVector.getElementByPos(i - 1));
      }
    }
  });

  it('OrderedSet front & back function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myOrderedSet.eraseElementByPos(0);
      myVector.eraseElementByPos(0);
      expect(myOrderedSet.front()).to.equal(myVector.front());
      myOrderedSet.eraseElementByPos(myOrderedSet.size() - 1);
      myVector.eraseElementByPos(myVector.size() - 1);
      expect(myOrderedSet.back()).to.equal(myVector.back());
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('OrderedSet eraseElementByIterator function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      let iter = myOrderedSet.eraseElementByIterator(myOrderedSet.begin());
      expect(iter.equals(myOrderedSet.begin())).to.equal(true);
      myVector.eraseElementByPos(0);
      iter = myOrderedSet.eraseElementByIterator(myOrderedSet.rBegin().next());
      expect(iter.equals(myOrderedSet.rBegin().next())).to.equal(true);
      iter = myOrderedSet.eraseElementByIterator(myOrderedSet.rBegin());
      expect(iter.equals(myOrderedSet.rBegin())).to.equal(true);
      myVector.popBack();
      myVector.popBack();
    }
    const eraseQueue = [1, 10, 1000];
    for (const index of eraseQueue) {
      const el = myVector.getElementByPos(index);
      myVector.eraseElementByPos(index);
      myOrderedSet.eraseElementByIterator(myOrderedSet.find(el));
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('OrderedSet updateKeyByIterator function test', () => {
    const st = new OrderedSet();
    st.insert(1);
    expect(st.updateKeyByIterator(st.begin(), 2)).to.equal(true);
    expect(st.front()).to.equal(2);
    st.eraseElementByKey(2);
    expect(st.size()).to.equal(0);
    expect(() => st.updateKeyByIterator(st.begin(), 1)).to.throw(RangeError);
    for (let i = 0; i < testNum; ++i) {
      st.insert(i * 2);
    }
    expect(() => st.updateKeyByIterator(st.end(), 1)).to.throw(RangeError);
    for (let i = 0; i < testNum; ++i) {
      const iter = st.lowerBound(i * 2);
      expect(st.updateKeyByIterator(iter, i * 2 + 1)).to.equal(true);
      expect(iter.pointer).to.equal(i * 2 + 1);
      if (i !== testNum - 1) {
        expect(st.updateKeyByIterator(iter, testNum * 3)).to.equal(false);
        expect(iter.pointer).to.equal(i * 2 + 1);
      }
      if (i !== 0) {
        expect(st.updateKeyByIterator(iter, -1)).to.equal(false);
        expect(iter.pointer).to.equal(i * 2 + 1);
      }
    }
  });

  it('OrderedSet iterator index function test', () => {
    const st = new OrderedSet<number>(undefined, undefined, true);
    const v = new Vector<number>();
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * 10000000;
      st.insert(random);
      v.pushBack(random);
    }
    v.sort((x, y) => x - y);
    for (let i = 0; i < testNum; ++i) {
      expect(st.lowerBound(v.getElementByPos(i)).index).to.equal(i);
    }
    expect(st.end().index).to.equal(st.size() - 1);

    v.forEach(element => {
      if (Math.random() > 0.5) {
        st.eraseElementByKey(element);
      }
    });

    st.forEach((element, index) => {
      expect(st.lowerBound(element).index).to.equal(index);
    });

    expect(st.end().index).to.equal(st.size() - 1);

    v.forEach(key => {
      st.eraseElementByKey(key);
      expect(st.begin().index).to.equal(0);
    });
  });

  it('OrderedSet insert by hint function test', () => {
    const st = new OrderedSet<number>();
    const v = new Vector<number>();
    expect(st.begin().index).to.equal(0);
    for (let i = 0; i < testNum; ++i) {
      st.insert(i * 3);
      v.pushBack(i * 3);
    }
    for (let i = 0; i < testNum; ++i) {
      const iter = st.lowerBound(i * 3);
      st.insert(i * 3 - 1, iter);
      st.insert(i * 3, iter);
      st.insert(i * 3 - 1, iter);
      st.insert(i * 3 - 2, iter);
      st.insert(i * 3 - 1, st.end());
      v.pushBack(i * 3 - 2);
      v.pushBack(i * 3 - 1);
      expect(st.find(i * 3).equals(st.end())).to.equal(false);
      expect(st.find(i * 3 - 1).equals(st.end())).to.equal(false);
      expect(st.find(i * 3 - 2).equals(st.end())).to.equal(false);
    }
    v.sort((x, y) => x - y);
    judgeSet(st, v);
  });

  it('OrderedSet clear function test', () => {
    myOrderedSet.clear();
    myVector.clear();
    judgeSet(myOrderedSet, myVector);
  });

  it('OrderedSet empty test', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedSet.begin().pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedSet.rBegin().pointer;
    }).to.throw(RangeError);
    expect(myOrderedSet.front()).to.equal(undefined);
    expect(myOrderedSet.back()).to.equal(undefined);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedSet.find(0).pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedSet.begin().pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedSet.lowerBound(0).pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedSet.upperBound(0).pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedSet.reverseLowerBound(0).pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedSet.reverseUpperBound(0).pointer;
    }).to.throw(RangeError);
    myOrderedSet.eraseElementByKey(0);
    expect(myOrderedSet.size()).to.equal(0);
    myOrderedSet.insert(1);
    expect(myOrderedSet.begin().next().equals(myOrderedSet.end())).to.equal(true);
    myOrderedSet.eraseElementByKey(0);
    expect(myOrderedSet.getElementByPos(0)).to.equal(1);
    myOrderedSet.insert(3);
    expect(myOrderedSet.getElementByPos(1)).to.equal(3);
    myOrderedSet.clear();
    myOrderedSet.insert(1);
    expect(myOrderedSet.front()).to.equal(1);
    myOrderedSet.eraseElementByKey(1);
    expect(myOrderedSet.size()).to.equal(0);
    expect(() => myOrderedSet.eraseElementByIterator(myOrderedSet.begin())).to.throw(RangeError);
  });

  it('OrderedSet iterator test', function () {
    const st = new OrderedSet([1, 2, 3]);
    for (let it = st.begin(), index = 1; !it.equals(st.end()); it.next()) {
      expect(it.pointer).to.equal(index);
      index += 1;
    }
  });

  it('OrderedSet reverse iterator test', function () {
    const st = new OrderedSet([2, 3]);
    for (let it = st.rBegin(), index = 3; !it.equals(st.rEnd()); it.next()) {
      expect(it.pointer).to.equal(index);
      index -= 1;
    }
  });
});
