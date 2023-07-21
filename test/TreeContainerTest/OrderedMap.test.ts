import { expect } from 'chai';
import { Vector, OrderedMap } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judgeMap(myOrderedMap: OrderedMap<number, number>, stdMap: Map<number, number>) {
  expect(myOrderedMap.getHeight()).to.lessThan(2 * Math.log2(myOrderedMap.size() + 1) + 1);
  expect(myOrderedMap.size()).to.equal(stdMap.size);
  if (!myOrderedMap.empty()) {
    const front = myOrderedMap.front() as [number, number];
    const back = myOrderedMap.back() as [number, number];
    expect(front[0]).to.equal(myOrderedMap.begin().pointer[0]);
    expect(front[1]).to.equal(myOrderedMap.begin().pointer[1]);
    expect(back[0]).to.equal(myOrderedMap.rBegin().pointer[0]);
    expect(back[1]).to.equal(myOrderedMap.rBegin().pointer[1]);
  }
  stdMap.forEach((value, key) => {
    const _value = myOrderedMap.getElementByKey(key);
    expect(_value).to.equal(value);
  });
  myOrderedMap.forEach(([key, value]) => {
    const _value = stdMap.get(key);
    expect(value).to.equal(_value);
  });
}

describe('OrderedMap test', () => {
  const myOrderedMap = new OrderedMap(arr.map((element, index) => [element, index]));
  const stdMap = new Map(arr.map((element, index) => [element, index]));

  it('OrderedMap eraseElementByKey function test', () => {
    const eraseArr: number[] = [];
    stdMap.forEach((value, key) => {
      if (Math.random() > 0.5) {
        eraseArr.push(key);
      }
    });
    eraseArr.forEach(key => {
      expect(myOrderedMap.eraseElementByKey(key)).to.equal(stdMap.delete(key));
    });
    judgeMap(myOrderedMap, stdMap);
  });

  it('OrderedMap setElement function test', () => {
    for (let i = 0; i < testNum; ++i) {
      stdMap.set(i, i);
      expect(myOrderedMap.setElement(i, i)).to.equal(stdMap.size);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  it('OrderedMap find function test', () => {
    const myOrderedMap = new OrderedMap<number, number>();
    expect(myOrderedMap.find(0).equals(myOrderedMap.end())).to.equal(true);
    expect(myOrderedMap.find(1).equals(myOrderedMap.end())).to.equal(true);
    expect(myOrderedMap.find(2).equals(myOrderedMap.end())).to.equal(true);
    myOrderedMap.setElement(1, 1);
    expect(myOrderedMap.find(0).equals(myOrderedMap.end())).to.equal(true);
    expect(myOrderedMap.find(1).equals(myOrderedMap.begin())).to.equal(true);
    expect(myOrderedMap.find(2).equals(myOrderedMap.end())).to.equal(true);
    myOrderedMap.setElement(2, 2);
    myOrderedMap.eraseElementByKey(1);
    expect(myOrderedMap.find(0).equals(myOrderedMap.end())).to.equal(true);
    expect(myOrderedMap.find(1).equals(myOrderedMap.end())).to.equal(true);
    expect(myOrderedMap.find(2).equals(myOrderedMap.begin())).to.equal(true);
  });

  it('OrderedMap eraseElementByPos function test', () => {
    for (let i = 0; i < 10; ++i) {
      const pos = Math.floor(Math.random() * myOrderedMap.size());
      const pair = myOrderedMap.getElementByPos(pos);
      myOrderedMap.eraseElementByPos(pos);
      if (pair) stdMap.delete(pair[0]);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  it('OrderedMap union function test', () => {
    const otherMap = new OrderedMap<number, number>();
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * 1000000;
      otherMap.setElement(random, i);
      stdMap.set(random, i);
    }
    expect(myOrderedMap.union(otherMap)).to.equal(stdMap.size);
    judgeMap(myOrderedMap, stdMap);
  });

  it('OrderedMap binary search function test', () => {
    const myVector = new Vector(myOrderedMap);
    myVector.sort((x, y) => x[0] - y[0]);
    for (let i = 0; i < myVector.size(); ++i) {
      let vElement = myVector.getElementByPos(i);
      let myElement = myOrderedMap.lowerBound(vElement[0]).pointer;
      expect(myElement[0]).to.equal(vElement[0]);
      expect(myElement[1]).to.equal(vElement[1]);
      if (i !== myVector.size() - 1) {
        vElement = myVector.getElementByPos(i);
        myElement = myOrderedMap.upperBound(vElement[0]).pointer;
        vElement = myVector.getElementByPos(i + 1);
        expect(myElement[0]).to.equal(vElement[0]);
        expect(myElement[1]).to.equal(vElement[1]);
      }
    }
  });

  it('OrderedMap reverse binary search function test', () => {
    const myVector = new Vector(myOrderedMap);
    myVector.sort((x, y) => x[0] - y[0]);
    for (let i = 0; i < myVector.size(); ++i) {
      let vElement = myVector.getElementByPos(i);
      let myElement = myOrderedMap.reverseLowerBound(vElement[0]).pointer;
      expect(myElement[0]).to.equal(vElement[0]);
      expect(myElement[1]).to.equal(vElement[1]);
      if (i !== 0) {
        vElement = myVector.getElementByPos(i);
        myElement = myOrderedMap.reverseUpperBound(vElement[0]).pointer;
        vElement = myVector.getElementByPos(i - 1);
        expect(myElement[0]).to.equal(vElement[0]);
        expect(myElement[1]).to.equal(vElement[1]);
      }
    }
  });

  it('OrderedMap eraseElementByIterator function test', () => {
    const v = new Vector<[number, number]>(myOrderedMap);
    v.sort((x, y) => x[0] - y[0]);
    for (let i = 0; i < testNum / 10; ++i) {
      const begin = myOrderedMap.begin();
      stdMap.delete(begin.pointer[0]);
      let iter = myOrderedMap.eraseElementByIterator(begin);
      expect(iter.equals(myOrderedMap.begin())).to.equal(true);
      expect(begin.pointer[0]).to.equal(v.getElementByPos(i + 1)[0]);
      const rBegin = myOrderedMap.rBegin();
      stdMap.delete(rBegin.pointer[0]);
      iter = myOrderedMap.eraseElementByIterator(rBegin);
      expect(iter.equals(myOrderedMap.rBegin())).to.equal(true);
      v.popBack();
      expect((iter.pointer)[0]).to.equal(v.back()![0]);
    }
    judgeMap(myOrderedMap, stdMap);
  });

  it('OrderedMap iterator error test', () => {
    myOrderedMap.begin().pointer[1] = 2;
    // @ts-ignore
    expect(myOrderedMap.begin().pointer[3]).to.equal(undefined);
    expect(myOrderedMap.front()).to.deep.equal([myOrderedMap.begin().pointer[0], 2]);
    expect(() => {
      myOrderedMap.begin().pointer[0] = 2;
    }).to.throw(TypeError);
  });

  it('OrderedMap updateKeyByIterator function test', () => {
    const mp = new OrderedMap();
    mp.setElement(1, 1);
    expect(mp.updateKeyByIterator(mp.begin(), 2)).to.equal(true);
    expect(mp.front()).to.deep.equal([2, 1]);
    mp.eraseElementByKey(2);
    expect(mp.size()).to.equal(0);
    expect(() => mp.updateKeyByIterator(mp.begin(), 1)).to.throw(RangeError);
    for (let i = 0; i < testNum; ++i) {
      mp.setElement(i * 2, i);
    }
    expect(() => mp.updateKeyByIterator(mp.end(), 1)).to.throw(RangeError);
    for (let i = 0; i < testNum; ++i) {
      const iter = mp.lowerBound(i * 2);
      expect(mp.updateKeyByIterator(iter, i * 2 + 1)).to.equal(true);
      expect(iter.pointer[0]).to.equal(i * 2 + 1);
      expect(iter.pointer[1]).to.equal(i);
      if (i !== testNum - 1) {
        expect(mp.updateKeyByIterator(iter, testNum * 3)).to.equal(false);
        expect(iter.pointer[0]).to.equal(i * 2 + 1);
        expect(iter.pointer[1]).to.equal(i);
      }
      if (i !== 0) {
        expect(mp.updateKeyByIterator(iter, -1)).to.equal(false);
        expect(iter.pointer[0]).to.equal(i * 2 + 1);
        expect(iter.pointer[1]).to.equal(i);
      }
    }
  });

  it('OrderedMap iterator index function test', () => {
    const mp = new OrderedMap<number, number>(undefined, undefined, true);
    const v = new Vector<number>();
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random() * 10000000;
      mp.setElement(random, i);
      v.pushBack(random);
    }
    v.sort((x, y) => x - y);
    for (let i = 0; i < testNum; ++i) {
      expect(mp.lowerBound(v.getElementByPos(i)).index).to.equal(i);
    }
    expect(mp.end().index).to.equal(mp.size() - 1);

    v.forEach(element => {
      if (Math.random() > 0.5) {
        mp.eraseElementByKey(element);
      }
    });

    mp.forEach((element, index) => {
      expect(mp.lowerBound(element[0]).index).to.equal(index);
    });

    expect(mp.end().index).to.equal(mp.size() - 1);
  });

  it('OrderedMap iterator iterator test', () => {
    expect(() => {
      for (let it = myOrderedMap.begin(); !it.equals(myOrderedMap.end()); it.next()) {
        const pointer = it.pointer;
        const [key, value] = pointer;
        expect(key).to.equal(pointer[0]);
        expect(value).to.equal(pointer[1]);
        pointer[1] = 2;
        const [_key, _value] = pointer;
        expect(_key).to.equal(pointer[0]);
        expect(_value).to.equal(2);
      }
    }).to.not.throw(Error);
  });

  it('OrderedMap clear function test', () => {
    myOrderedMap.clear();
    stdMap.clear();
    judgeMap(myOrderedMap, stdMap);

    for (let i = 0; i < testNum; ++i) {
      stdMap.set(i, i);
      expect(myOrderedMap.setElement(i, i)).to.equal(stdMap.size);
    }
    let i = testNum;
    stdMap.forEach((value, key) => {
      --i;
      myOrderedMap.eraseElementByKey(key);
      expect(myOrderedMap.size()).to.equal(i);
    });
    expect(myOrderedMap.size()).to.equal(0);
    stdMap.clear();

    for (let i = 0; i < testNum; ++i) {
      myOrderedMap.setElement(testNum - i, i);
      stdMap.set(testNum - i, i);
    }
    i = testNum;
    stdMap.forEach((value, key) => {
      --i;
      myOrderedMap.eraseElementByKey(key);
      expect(myOrderedMap.size()).to.equal(i);
    });
    expect(myOrderedMap.front()).to.equal(undefined);
    expect(myOrderedMap.back()).to.equal(undefined);
    expect(myOrderedMap.size()).to.equal(0);
    stdMap.clear();
  });

  it('OrderedMap empty test', () => {
    const myOrderedMap = new OrderedMap();
    expect(myOrderedMap.front()).to.equal(undefined);
    expect(myOrderedMap.back()).to.equal(undefined);
    expect(() => {
      myOrderedMap.begin().pointer[1] = 1;
    }).to.throw(RangeError);
    expect(() => {
      myOrderedMap.lowerBound(0).pointer[1] = 1;
    }).to.throw(RangeError);
    expect(() => {
      myOrderedMap.upperBound(0).pointer[1] = 1;
    }).to.throw(RangeError);
    expect(() => {
      myOrderedMap.reverseLowerBound(0).pointer[1] = 1;
    }).to.throw(RangeError);
    expect(() => {
      myOrderedMap.reverseUpperBound(0).pointer[1] = 1;
    }).to.throw(RangeError);
    expect(() => {
      myOrderedMap.find(0).pointer[0] = 2;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myOrderedMap.rBegin().pointer;
    }).to.throw(RangeError);
    myOrderedMap.setElement(1, 1);
    expect(myOrderedMap.getElementByKey(0)).to.equal(undefined);
  });
});
