import SequentialContainer from '@/container/SequentialContainer/Base/index';
import { Vector, LinkList } from '@/index';
import { RunTimeError } from '@/utils/error';

function judgeSequentialContainer(
  container: SequentialContainer<number, unknown>,
  myVector: SequentialContainer<number, unknown>
) {
  expect(container.size()).toEqual(myVector.size());
  container.forEach((element, index) => {
    expect(element).toEqual(myVector.getElementByPos(index));
  });
}

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
    myLinkList.begin().pointer = 100;
    tmpArr[0] = 100;
    judgeSequentialContainer(myLinkList, new Vector(tmpArr));
  });

  test('LinkList popFront function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myLinkList.popFront();
      tmpArr.shift();
    }
    judgeSequentialContainer(myLinkList, new Vector(tmpArr));
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
    judgeSequentialContainer(myLinkList, new Vector(tmpArr));
  });

  test('LinkList find function test', () => {
    myLinkList.forEach((element, index) => {
      if (index >= 1000) return;
      expect(myLinkList.find(element).pointer).toEqual(element);
    });
  });

  test('LinkList eraseElementByIterator function test', () => {
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

  test('LinkList run time error test', () => {
    expect(() => myLinkList.getElementByPos(myLinkList.size())).toThrowError(RunTimeError);
  });

  test('LinkList pushFront function test', () => {
    const myLinkList = new LinkList();
    expect(myLinkList.front()).toEqual(undefined);
    expect(myLinkList.back()).toEqual(undefined);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myLinkList.begin().pointer;
    }).toThrowError(RunTimeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myLinkList.end().pointer;
    }).toThrowError(RunTimeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myLinkList.rBegin().pointer;
    }).toThrowError(RunTimeError);
    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      myLinkList.rEnd().pointer;
    }).toThrowError(RunTimeError);
    expect(() => {
      myLinkList.eraseElementByIterator(myLinkList.begin());
    }).toThrowError(RunTimeError);
    expect(() => {
      myLinkList.begin().pointer = 0;
    }).toThrowError(RunTimeError);
    myLinkList.popBack();
    expect(myLinkList.size()).toBe(0);
    myLinkList.pushBack(1);
    expect(myLinkList.size()).toBe(1);
    myLinkList.popBack();
    expect(myLinkList.size()).toBe(0);
    myLinkList.insert(0, 100);
    expect(myLinkList.front()).toBe(100);
    myLinkList.insert(myLinkList.size(), 100);
    expect(myLinkList.back()).toBe(100);
    myLinkList.clear();
    myLinkList.pushFront(1);
    expect(myLinkList.front()).toBe(1);
    myLinkList.popFront();
    myLinkList.popFront();
    expect(myLinkList.size()).toBe(0);
    myLinkList.pushBack(1);
    myLinkList.merge(new LinkList([2]));
    expect(myLinkList.size()).toBe(2);
    myLinkList.clear();
    myLinkList.merge(new LinkList([2]));
    expect(myLinkList.size()).toBe(1);
    expect(myLinkList.front()).toBe(2);
  });
});
