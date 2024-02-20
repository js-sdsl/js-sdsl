import { expect } from 'chai';
import { judgeSequentialContainer } from '../utils/judge';
import { Vector, Deque } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

describe('deque test', () => {
  let myDeque = new Deque(arr);
  const tmpArr = [...arr];

  it('deque unshift function test', () => {
    for (let i = 0; i < testNum; ++i) {
      expect(myDeque.unshift(i)).to.equal(tmpArr.unshift(i));
    }
    judgeSequentialContainer(myDeque, tmpArr);
  });

  it('deque shift function test', () => {
    for (let i = 0; i < testNum; ++i) {
      expect(myDeque.shift()).to.equal(tmpArr.shift());
    }
    judgeSequentialContainer(myDeque, tmpArr);
  });

  it('deque shrink function test', () => {
    myDeque.shrink();
    judgeSequentialContainer(myDeque, tmpArr);

    const bucketSize = 1 << 12;
    const q = new Deque<number>([], { bucketSize });
    const arr = [];
    for (let i = bucketSize << 1; i > 0; --i) {
      q.push(i);
      q.unshift(i);
      arr.push(i);
      arr.unshift(i);
    }
    q.push(1);
    arr.push(1);
    for (let i = 0; i < bucketSize; ++i) {
      q.unshift(i);
      arr.unshift(i);
    }
    for (let i = 0; i < (bucketSize << 2); ++i) {
      q.unshift(i);
      arr.unshift(i);
    }
    judgeSequentialContainer(q, arr);
    q.shrink();
    judgeSequentialContainer(q, arr);
  });

  it('deque find function test', () => {
    for (let i = 0; i <= 1000; ++i) {
      const index = Math.floor(Math.random() * myDeque.length);
      expect(myDeque.find(tmpArr[index]).pointer).to.equal(tmpArr[index]);
    }
    expect(myDeque.find(tmpArr[tmpArr.length - 1]).pointer).to.equal(tmpArr[tmpArr.length - 1]);
    expect(myDeque.find(tmpArr[tmpArr.length / 2]).pointer).to.equal(tmpArr[tmpArr.length / 2]);
    expect(myDeque.find(-1).pointer).to.equal(undefined);
    myDeque.push(-1);
    expect(myDeque.find(-1).pointer).to.equal(-1);
    myDeque.pop();
  });

  it('deque erase function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myDeque.erase(myDeque.begin());
      tmpArr.shift();
    }
    judgeSequentialContainer(myDeque, tmpArr);
    let index = 0;
    for (const element of myDeque) {
      expect(element).to.equal(tmpArr[index++]);
    }
  });

  it('deque run time error test', () => {
    expect(myDeque.at(myDeque.length)).to.equal(undefined);
  });

  it('deque unshift function test', () => {
    const arr0 = new Array((1 << 11) + 2).fill(1);
    const arr1 = new Array((1 << 11) - 2).fill(2);
    const q = new Deque<number>();
    q.unshift(...arr0);
    q.push(...arr1);
    q.push(3);
    expect(q.toArray()).to.deep.equal([...arr0, ...arr1, 3]);
  });

  it('deque at function test', () => {
    const bucketSize = 1 << 12;
    const q = new Deque<number>([], { bucketSize });
    q.push(1);
    expect(q.at(q.length - 1)).to.equal(1);
    const restSize = (bucketSize >> 1) + bucketSize - 2;
    q.push(...new Array(restSize).fill(1));
    q.push(2);
    expect(q.at(q.length - 1)).to.equal(2);
    q.push(...new Array(bucketSize).fill(1));
    q.push(3);
    expect(q.at(q.length - 1)).to.equal(3);
  });

  it('deque empty test', () => {
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
    myDeque.shrink();
    myDeque.unshift(1);
    myDeque.shrink();
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

    const q = new Deque<number>([], { bucketSize: 1 << 10 });
    const v = [];
    for (let i = 0; i < (1 << 15); ++i) {
      const random = Math.random();
      q.push(random);
      v.push(random);
    }
    q.shrink();
    judgeSequentialContainer(q, v);
    q.clear();
    for (let i = 0; i < testNum; ++i) q.unshift(arr[i]);
    arr.reverse();
    judgeSequentialContainer(q, arr);
  });
});
