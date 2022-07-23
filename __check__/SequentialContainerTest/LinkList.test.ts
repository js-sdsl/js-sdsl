import { Vector, LinkList } from '@/index';
import { RunTimeError } from '@/types/error';
import judgeSequentialContainer from './SequentialContainer.test';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

describe('LinkList test', () => {
  const myLinkList = new LinkList(arr);
  const tmpArr = [...arr];

  test('LinkList pushFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myLinkList.pushFront(i);
      tmpArr.unshift(i);
    }
    expect(judgeSequentialContainer('pushFront',
      myLinkList,
      new Vector(tmpArr))).toEqual(undefined);
  });

  test('LinkList popFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myLinkList.popFront();
      tmpArr.shift();
    }
    expect(judgeSequentialContainer('popFront',
      myLinkList,
      new Vector(tmpArr))).toEqual(undefined);
  });

  test('LinkList merge function test', () => {
    for (let i = 0; i < testNum; ++i) {
      tmpArr.push(i);
    }
    const otherLinkList = new LinkList(tmpArr);
    myLinkList.forEach(element => tmpArr.push(element));
    myLinkList.sort((x, y) => x - y);
    otherLinkList.sort((x, y) => x - y);
    tmpArr.sort((x, y) => x - y);
    myLinkList.merge(otherLinkList);
    expect(judgeSequentialContainer('merge',
      myLinkList,
      new Vector(tmpArr))).toEqual(undefined);
  });

  test('LinkList find function test', () => {
    myLinkList.forEach((element, index) => {
      if (index >= 1000) return;
      expect(myLinkList.find(element).pointer).toEqual(element);
    });
  });

  test('LinkList eraseElementByIterator function test', () => {
    for (let i = 0; i < testNum / 10; ++i) {
      myLinkList.eraseElementByIterator(myLinkList.begin());
      tmpArr.shift();
    }
    judgeSequentialContainer('eraseElementByIterator', myLinkList, new Vector(tmpArr));
  });

  test('LinkList run time error test', () => {
    expect(() => myLinkList.getElementByPos(myLinkList.size())).toThrowError(RunTimeError);
  });
});
