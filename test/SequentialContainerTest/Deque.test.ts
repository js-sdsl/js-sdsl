import { expect } from 'chai';
import { judgeSequentialContainer } from '../utils/judge';
import { Vector, Deque } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

describe('Deque test', () => {
  let myDeque = new Deque(arr);
  const tmpArr = [...arr];

  it('Deque pushFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      expect(myDeque.unshift(i)).to.equal(tmpArr.unshift(i));
    }
    judgeSequentialContainer(myDeque, new Vector(tmpArr));
  });

  it('Deque popFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      expect(myDeque.shift()).to.equal(tmpArr.shift());
    }
    judgeSequentialContainer(myDeque, new Vector(tmpArr));
  });

  it('Deque shrinkToFit function test', () => {
    myDeque.shrinkToFit();
    judgeSequentialContainer(myDeque, new Vector(tmpArr));
  });

  it('Deque find function test', () => {
    for (let i = 0; i <= 1000; ++i) {
      const index = Math.floor(Math.random() * myDeque.length);
      expect(myDeque.find(tmpArr[index]).pointer).to.equal(tmpArr[index]);
    }
    expect(myDeque.find(tmpArr[tmpArr.length - 1]).pointer).to.equal(tmpArr[tmpArr.length - 1]);
    expect(myDeque.find(tmpArr[tmpArr.length / 2]).pointer).to.equal(tmpArr[tmpArr.length / 2]);
    expect(() => {
      const a = myDeque.find(-1).pointer;
      return a;
    }).to.throw(RangeError);
    myDeque.push(-1);
    expect(myDeque.find(-1).pointer).to.equal(-1);
    myDeque.pop();
  });

  it('Deque eraseElementByIterator function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myDeque.eraseElementByIterator(myDeque.begin());
      tmpArr.shift();
    }
    judgeSequentialContainer(myDeque, new Vector(tmpArr));
    let index = 0;
    for (const element of myDeque) {
      expect(element).to.equal(tmpArr[index++]);
    }
  });

  it('Deque run time error test', () => {
    expect(() => myDeque.at(myDeque.length)).to.throw(RangeError);
  });

  it('Deque empty test', () => {
    myDeque.clear();
    expect(myDeque.back()).to.equal(undefined);
    for (let i = 0; i < (1 << 15); ++i) {
      myDeque.push(i);
    }
    while (!myDeque.empty()) {
      myDeque.pop();
    }
    expect(myDeque.front()).to.equal(undefined);
    expect(myDeque.length).to.equal(0);
    myDeque.shrinkToFit();
    myDeque.unshift(1);
    myDeque.shrinkToFit();
    expect(myDeque.length).to.equal(1);
    expect(myDeque.find(1).pointer).to.equal(1);
    myDeque.begin().pointer = 2;
    expect(myDeque.front()).to.equal(2);
    expect(new Deque(new Set([2])).length).to.equal(1);
    expect(new Deque(new Vector([2])).length).to.equal(1);
    // @ts-ignore
    expect(() => new Deque({})).to.throw(TypeError);
    myDeque.cut(-1);
    myDeque.pop();
    myDeque.shift();
    expect(myDeque.length).to.equal(0);
    myDeque = myDeque.filter(item => item !== 0);
    expect(myDeque.find(0).equals(myDeque.end())).to.equal(true);
    myDeque.unique();
    // eslint-disable-next-line no-empty, no-unused-vars, @typescript-eslint/no-unused-vars
    for (const element of myDeque) {}
    myDeque.push(1);
    myDeque.splice(1, 0, 1);
    expect(myDeque.back()).to.equal(1);
    for (const element of myDeque) {
      expect(element).to.equal(1);
    }
    myDeque.splice(1, 1);
    myDeque.splice(0, 0, 3);
    expect(myDeque.front()).to.equal(3);

    const a = {
      b: [1, 2, 3, 4, 5],
      forEach(c: (el: number) => void) {
        this.b.forEach(c);
      },
      get length() {
        return this.b.length;
      }
    };
    expect(new Deque(a).length).to.equal(a.length);

    const q = new Deque<number>([], (1 << 10));
    const v = new Vector<number>();
    for (let i = 0; i < (1 << 15); ++i) {
      const random = Math.random();
      q.push(random);
      v.push(random);
    }
    q.shrinkToFit();
    judgeSequentialContainer(q, v);
    q.clear();
    for (let i = 0; i < testNum; ++i) q.unshift(arr[i]);
    arr.reverse();
    judgeSequentialContainer(q, new Vector(arr));
  });
});
