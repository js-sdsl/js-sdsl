import { expect } from 'chai';
import { Vector, OrderedSet } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeSet(myOrderedSet: OrderedSet<number>, myVector: Vector<number>) {
  // expect(myOrderedSet.getHeight()).to.lessThan(2 * Math.log2(myOrderedSet.length + 1) + 1);
  expect(myOrderedSet.length).to.equal(myVector.length);
  myVector.sort((x, y) => x - y);
  myOrderedSet.forEach((element, index) => {
    expect(element).to.equal(myVector.at(index));
  });
}

describe('ordered-set test', () => {
  const myOrderedSet = new OrderedSet(arr);
  const myVector = new Vector(new Set(arr));

  it('ordered-set add function test', () => {
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * testNum * 10;
      expect(myOrderedSet.add(random).size).to.equal(myVector.push(random));
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('ordered-set delete function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      const pos = Math.floor(Math.random() * myVector.length);
      const eraseValue = myVector.at(pos)!;
      myVector.splice(pos, 1);
      expect(myOrderedSet.delete(eraseValue)).to.equal(true);
      expect(myOrderedSet.delete(-Math.random())).to.equal(false);
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('ordered-set union function test', () => {
    const otherOrderedSet = new OrderedSet<number>();
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * testNum * 10;
      otherOrderedSet.add(random);
      myVector.push(random);
    }
    expect(myOrderedSet.union(otherOrderedSet)).to.equal(myVector.length);
    judgeSet(myOrderedSet, myVector);
  });

  it('ordered-set splice function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      const pos = Math.floor(Math.random() * myVector.length);
      myOrderedSet.erase(pos);
      myVector.splice(pos, 1);
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('ordered-set find function test', () => {
    myVector.forEach((element: number) => {
      expect(myOrderedSet.find(element).pointer).to.equal(element);
    });
  });

  myVector.sort((x: number, y: number) => x - y);

  it('ordered-set binary search function test', () => {
    for (let i = 0; i < myVector.length; ++i) {
      expect(myOrderedSet.lowerBound(myVector.at(i)!).pointer)
        .to.equal(myVector.at(i));
      if (i !== myVector.length - 1) {
        expect(myOrderedSet.upperBound(myVector.at(i)!).pointer)
          .to.equal(myVector.at(i + 1));
      }
      if (i !== 0) {
        const mid = (myVector.at(i)! + myVector.at(i - 1)!) / 2;
        expect(myOrderedSet.lowerBound(mid).pointer)
          .to.equal(myVector.at(i));
        expect(myOrderedSet.upperBound(mid).pointer)
          .to.equal(myVector.at(i));
      }
    }
  });

  it('ordered-set reverse binary search function test', () => {
    for (let i = 0; i < myVector.length; ++i) {
      expect(myOrderedSet.reverseLowerBound(myVector.at(i)!).pointer)
        .to.equal(myVector.at(i));
      if (i !== 0) {
        expect(myOrderedSet.reverseUpperBound(myVector.at(i)!).pointer)
          .to.equal(myVector.at(i - 1));
      }
      if (i !== 0) {
        const mid = (myVector.at(i)! + myVector.at(i - 1)!) / 2;
        expect(myOrderedSet.reverseLowerBound(mid).pointer)
          .to.equal(myVector.at(i - 1));
        expect(myOrderedSet.reverseUpperBound(mid).pointer)
          .to.equal(myVector.at(i - 1));
      }
    }
  });

  it('ordered-set front & back function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myOrderedSet.erase(0);
      myVector.splice(0, 1);
      expect(myOrderedSet.front()).to.equal(myVector.front());
      myOrderedSet.erase(myOrderedSet.length - 1);
      myVector.splice(myVector.length - 1, 1);
      expect(myOrderedSet.back()).to.equal(myVector.back());
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('ordered-set erase function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      let iter = myOrderedSet.erase(myOrderedSet.begin());
      expect(iter.equals(myOrderedSet.begin())).to.equal(true);
      myVector.splice(0, 1);
      iter = myOrderedSet.erase(myOrderedSet.rBegin().next());
      expect(iter.equals(myOrderedSet.rBegin().next())).to.equal(true);
      iter = myOrderedSet.erase(myOrderedSet.rBegin());
      expect(iter.equals(myOrderedSet.rBegin())).to.equal(true);
      myVector.pop();
      myVector.pop();
    }
    const eraseQueue = [1, 10, 1000];
    for (const index of eraseQueue) {
      const el = myVector.at(index)!;
      myVector.splice(index, 1);
      myOrderedSet.erase(myOrderedSet.find(el));
    }
    judgeSet(myOrderedSet, myVector);
  });

  it('ordered-set update function test', () => {
    const st = new OrderedSet();
    st.add(1);
    expect(st.update(st.begin(), 2)).to.equal(true);
    expect(st.front()).to.equal(2);
    st.delete(2);
    expect(st.length).to.equal(0);
    expect(() => st.update(st.begin(), 1)).to.throw(RangeError);
    for (let i = 0; i < testNum; ++i) {
      st.add(i * 2);
    }
    expect(() => st.update(st.end(), 1)).to.throw(RangeError);
    for (let i = 0; i < testNum; ++i) {
      const iter = st.lowerBound(i * 2);
      expect(st.update(iter, i * 2 + 1)).to.equal(true);
      expect(iter.pointer).to.equal(i * 2 + 1);
      if (i !== testNum - 1) {
        expect(st.update(iter, testNum * 3)).to.equal(false);
        expect(iter.pointer).to.equal(i * 2 + 1);
      }
      if (i !== 0) {
        expect(st.update(iter, -1)).to.equal(false);
        expect(iter.pointer).to.equal(i * 2 + 1);
      }
    }
  });

  it('ordered-set iterator index function test', () => {
    const st = new OrderedSet<number>([], {
      enableIndex: true
    });
    const v = new Vector<number>();
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * 10000000;
      st.add(random);
      v.push(random);
    }
    v.sort((x, y) => x - y);
    for (let i = 0; i < testNum; ++i) {
      expect(st.at(i)!).equal(v.at(i));
    }
    for (let i = 0; i < testNum; ++i) {
      expect(st.lowerBound(v.at(i)!).index).to.equal(i);
    }
    expect(st.end().index).to.equal(st.length - 1);

    v.forEach(element => {
      if (Math.random() > 0.5) {
        st.delete(element);
      }
    });

    st.forEach((element, index) => {
      expect(st.lowerBound(element).index).to.equal(index);
    });

    expect(st.end().index).to.equal(st.length - 1);

    v.forEach(key => {
      st.delete(key);
      expect(st.begin().index).to.equal(0);
    });
  });

  it('ordered-set insert by hint function test', () => {
    const st = new OrderedSet<number>();
    const v = new Vector<number>();
    expect(() => st.begin().index).to.throw(TypeError);
    for (let i = 0; i < testNum; ++i) {
      st.add(i * 3);
      v.push(i * 3);
    }
    for (let i = 0; i < testNum; ++i) {
      const iter = st.lowerBound(i * 3);
      st.add(i * 3 - 1, iter);
      st.add(i * 3, iter);
      st.add(i * 3 - 1, iter);
      st.add(i * 3 - 2, iter);
      st.add(i * 3 - 1, st.end());
      v.push(i * 3 - 2);
      v.push(i * 3 - 1);
      expect(st.find(i * 3).equals(st.end())).to.equal(false);
      expect(st.find(i * 3 - 1).equals(st.end())).to.equal(false);
      expect(st.find(i * 3 - 2).equals(st.end())).to.equal(false);
    }
    v.sort((x, y) => x - y);
    judgeSet(st, v);
  });

  it('ordered-set clear function test', () => {
    myOrderedSet.clear();
    myVector.clear();
    judgeSet(myOrderedSet, myVector);
  });

  it('ordered-set common test', () => {
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
    myOrderedSet.delete(0);
    expect(myOrderedSet.length).to.equal(0);
    myOrderedSet.add(1);
    expect(myOrderedSet.begin().next().equals(myOrderedSet.end())).to.equal(true);
    myOrderedSet.delete(0);
    expect(myOrderedSet.at(0)).to.equal(1);
    myOrderedSet.add(3);
    expect(myOrderedSet.at(1)).to.equal(3);
    myOrderedSet.clear();
    myOrderedSet.add(1);
    expect(myOrderedSet.front()).to.equal(1);
    myOrderedSet.delete(1);
    expect(myOrderedSet.length).to.equal(0);
    expect(() => myOrderedSet.erase(myOrderedSet.begin())).to.throw(RangeError);
  });

  it('ordered-set iterator test', function () {
    (function () {
      const st = new OrderedSet([]);
      for (let it = st.begin(), index = 1; !it.equals(st.end()); it.next()) {
        expect(it.pointer).to.equal(index);
        index += 1;
      }
    })();

    (function () {
      const st = new OrderedSet([1]);
      for (let it = st.begin(), index = 1; !it.equals(st.end()); it.next()) {
        expect(it.pointer).to.equal(index);
        index += 1;
      }
    })();

    (function () {
      const st = new OrderedSet([1, 2]);
      for (let it = st.begin(), index = 1; !it.equals(st.end()); it.next()) {
        expect(it.pointer).to.equal(index);
        index += 1;
      }
    })();

    (function () {
      const st = new OrderedSet([1, 2, 3]);
      for (let it = st.begin(), index = 1; !it.equals(st.end()); it.next()) {
        expect(it.pointer).to.equal(index);
        index += 1;
      }
    })();
  });

  it('ordered-set reverse iterator test', function () {
    (function () {
      const st = new OrderedSet([]);
      for (let it = st.rBegin(), index = 3; !it.equals(st.rEnd()); it.next()) {
        expect(it.pointer).to.equal(index);
        index -= 1;
      }
    })();

    (function () {
      const st = new OrderedSet([3]);
      for (let it = st.rBegin(), index = 3; !it.equals(st.rEnd()); it.next()) {
        expect(it.pointer).to.equal(index);
        index -= 1;
      }
    })();

    (function () {
      const st = new OrderedSet([2, 3]);
      for (let it = st.rBegin(), index = 3; !it.equals(st.rEnd()); it.next()) {
        expect(it.pointer).to.equal(index);
        index -= 1;
      }
    })();

    (function () {
      const st = new OrderedSet([1, 2, 3]);
      for (let it = st.rBegin(), index = 3; !it.equals(st.rEnd()); it.next()) {
        expect(it.pointer).to.equal(index);
        index -= 1;
      }
    })();
  });
});
