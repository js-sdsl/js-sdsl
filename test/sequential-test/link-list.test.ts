import { expect } from 'chai';
import { judgeSequentialContainer } from '../utils/judge';
import { LinkList } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

describe('link-list test', () => {
  const myLinkList = new LinkList(arr);
  const tmpArr = [...arr];

  it('link-list unshift function test', () => {
    for (let i = 0; i < testNum; ++i) {
      expect(myLinkList.unshift(i)).to.equal(tmpArr.unshift(i));
    }
    myLinkList.begin().pointer = 100;
    tmpArr[0] = 100;
    judgeSequentialContainer(myLinkList, tmpArr);
  });

  it('link-list shift function test', () => {
    for (let i = 0; i < testNum; ++i) {
      expect(myLinkList.shift()).to.equal(tmpArr.shift());
    }
    judgeSequentialContainer(myLinkList, tmpArr);
  });

  it('link-list merge function test', () => {
    for (let i = 0; i < testNum; ++i) {
      tmpArr.push(i);
    }
    const otherLinkList = new LinkList(tmpArr);
    myLinkList.forEach(element => tmpArr.push(element));
    myLinkList.sort((x, y) => x - y);
    otherLinkList.sort((x, y) => x - y);
    tmpArr.sort((x, y) => x - y);
    expect(myLinkList.merge(otherLinkList)).to.equal(tmpArr.length);
    judgeSequentialContainer(myLinkList, tmpArr);
  });

  it('link-list find function test', () => {
    myLinkList.forEach((element, index) => {
      if (index >= 1000) return;
      expect(myLinkList.find(element).pointer).to.equal(element);
    });
    expect(myLinkList.find(-1).equals(myLinkList.end())).to.equal(true);
  });

  it('link-list erase function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myLinkList.erase(myLinkList.begin().next());
      myLinkList.erase(myLinkList.begin());
      tmpArr.shift();
      tmpArr.shift();
      myLinkList.erase(myLinkList.rBegin().next());
      myLinkList.erase(myLinkList.rBegin());
      tmpArr.pop();
      tmpArr.pop();
    }
    judgeSequentialContainer(myLinkList, tmpArr);
  });

  it('link-list run time error test', () => {
    expect(myLinkList.at(myLinkList.length)).to.equal(undefined);
  });

  it('link-list common test', () => {
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
      myLinkList.erase(myLinkList.begin());
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
