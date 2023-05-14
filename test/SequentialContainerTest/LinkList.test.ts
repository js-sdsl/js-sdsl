import { expect } from 'chai';
import { judgeSequentialContainer } from '../utils/judge';
import { Vector, LinkList } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

describe('LinkList test', () => {
  const myLinkList = new LinkList(arr);
  const tmpArr = [...arr];

  it('LinkList pushFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      expect(myLinkList.unshift(i)).to.equal(tmpArr.unshift(i));
    }
    myLinkList.begin().pointer = 100;
    tmpArr[0] = 100;
    judgeSequentialContainer(myLinkList, new Vector(tmpArr));
  });

  it('LinkList popFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      expect(myLinkList.shift()).to.equal(tmpArr.shift());
    }
    judgeSequentialContainer(myLinkList, new Vector(tmpArr));
  });

  it('LinkList merge function test', () => {
    for (let i = 0; i < testNum; ++i) {
      tmpArr.push(i);
    }
    const otherLinkList = new LinkList(tmpArr);
    myLinkList.forEach(element => tmpArr.push(element));
    myLinkList.sort((x, y) => x - y);
    otherLinkList.sort((x, y) => x - y);
    tmpArr.sort((x, y) => x - y);
    expect(myLinkList.merge(otherLinkList)).to.equal(tmpArr.length);
    judgeSequentialContainer(myLinkList, new Vector(tmpArr));
  });

  it('LinkList find function test', () => {
    myLinkList.forEach((element, index) => {
      if (index >= 1000) return;
      expect(myLinkList.find(element).pointer).to.equal(element);
    });
    expect(myLinkList.find(-1).equals(myLinkList.end())).to.equal(true);
  });

  it('LinkList eraseElementByIterator function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myLinkList.eraseElementByIterator(myLinkList.begin().next());
      myLinkList.eraseElementByIterator(myLinkList.begin());
      tmpArr.shift();
      tmpArr.shift();
      myLinkList.eraseElementByIterator(myLinkList.rBegin().next());
      myLinkList.eraseElementByIterator(myLinkList.rBegin());
      tmpArr.pop();
      tmpArr.pop();
    }
    judgeSequentialContainer(myLinkList, new Vector(tmpArr));
  });

  it('LinkList run time error test', () => {
    expect(() => myLinkList.at(myLinkList.length)).to.throw(RangeError);
  });

  it('LinkList pushFront function test', () => {
    let myLinkList = new LinkList();
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, no-empty
    for (const _ of myLinkList) {}
    myLinkList.reverse();
    expect(myLinkList.front()).to.equal(undefined);
    expect(myLinkList.back()).to.equal(undefined);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myLinkList.begin().pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myLinkList.end().pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myLinkList.rBegin().pointer;
    }).to.throw(RangeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myLinkList.rEnd().pointer;
    }).to.throw(RangeError);
    expect(() => {
      myLinkList.eraseElementByIterator(myLinkList.begin());
    }).to.throw(RangeError);
    expect(() => {
      myLinkList.begin().pointer = 0;
    }).to.throw(RangeError);
    myLinkList.pop();
    expect(myLinkList.length).to.equal(0);
    myLinkList.push(1);
    expect(myLinkList.length).to.equal(1);
    myLinkList.pop();
    expect(myLinkList.front()).to.equal(undefined);
    expect(myLinkList.back()).to.equal(undefined);
    expect(myLinkList.length).to.equal(0);
    myLinkList.splice(0, 0, 100);
    expect(myLinkList.front()).to.equal(100);
    myLinkList.splice(myLinkList.length, 0, 100);
    expect(myLinkList.back()).to.equal(100);
    myLinkList.clear();
    myLinkList.unshift(1);
    expect(myLinkList.front()).to.equal(1);
    myLinkList.shift();
    myLinkList.shift();
    expect(myLinkList.length).to.equal(0);
    myLinkList.push(1);
    myLinkList.merge(new LinkList([2]));
    expect(myLinkList.length).to.equal(2);
    myLinkList.clear();
    myLinkList = myLinkList.filter(item => item !== 0);
    expect(myLinkList.find(0).equals(myLinkList.end())).to.equal(true);
    myLinkList.merge(new LinkList([2]));
    expect(myLinkList.length).to.equal(1);
    expect(myLinkList.front()).to.equal(2);
    myLinkList.splice(1, 0);
    expect(myLinkList.length).to.equal(1);
    myLinkList.unshift(0);
    expect(myLinkList.length).to.equal(2);
    myLinkList = myLinkList.filter(item => item !== 0);
    expect(myLinkList.length).to.equal(1);
    myLinkList.clear();
    myLinkList.sort();
    myLinkList.unique();
    expect(myLinkList.length).to.equal(0);
    const newLink = new LinkList([1, 2, 3]);
    myLinkList.push(4);
    myLinkList.merge(newLink);
    myLinkList.forEach((element, index) => expect(element).to.equal(index + 1));
  });
});
