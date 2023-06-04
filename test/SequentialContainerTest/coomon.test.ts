import { expect } from 'chai';
import { judgeSequentialContainer } from '../utils/judge';
import { Vector, LinkList, Deque, SequentialContainer } from '@/index';
import { compareFromS2L } from '@/utils/compareFn';

const arr: number[] = [];
const testNum = 1000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

const containerArr = [
  // new Vector(arr),
  // new LinkList(arr),
  new Deque(arr)
];

function testSequentialContainer(container: SequentialContainer<number>) {
  const copyArr = [...arr];

  expect(container.length).to.equal(copyArr.length);
  expect(container.front()).to.equal(copyArr[0]);
  expect(container.back()).to.equal(copyArr[copyArr.length - 1]);

  judgeSequentialContainer(container, copyArr);

  for (let i = 0; i < testNum; ++i) {
    expect(container.push(i)).to.equal(copyArr.push(i));
  }
  judgeSequentialContainer(container, copyArr);

  for (let i = 0; i < testNum; ++i) {
    expect(container.pop()).to.equal(copyArr.pop());
  }
  judgeSequentialContainer(container, copyArr);

  const len = container.length;
  expect(container.length).to.equal(copyArr.length);
  for (let i = 0; i < len; ++i) {
    expect(container.at(i)).to.equal(copyArr[i]);
  }

  for (let i = 0; i < len; ++i) {
    copyArr[i] = i;
    container.set(i, i);
  }
  judgeSequentialContainer(container, copyArr);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * copyArr.length);
    expect(container.splice(pos, 1).toArray()).to.deep.equal(copyArr.splice(pos, 1));
  }
  judgeSequentialContainer(container, copyArr);

  for (let i = 0; i < testNum; ++i) {
    expect(container.push(i)).to.equal(copyArr.push(i));
  }
  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.length);
    const num = 10;
    expect(
      container.splice(pos, 0, ...new Array(num).fill(-2)).toArray()
    ).to.deep.equal(
      copyArr.splice(pos, 0, ...new Array(num).fill(-2))
    );
  }
  judgeSequentialContainer(container, copyArr);

  let start = Math.floor(Math.random() * copyArr.length);
  let end = Math.floor(Math.random() * copyArr.length);
  if (start > end) {
    [start, end] = [end, start];
  }

  expect(container.slice(start, end).toArray()).to.deep.equal(copyArr.slice(start, end));

  expect(container.map(function (item) {
    return Math.abs(Math.floor(item * 2 / 5)) % 3;
  }).toArray()).to.deep.equal(copyArr.map(function (item) {
    return Math.abs(Math.floor(item * 2 / 5)) % 3;
  }));
  judgeSequentialContainer(container, copyArr);

  container.reverse();
  copyArr.reverse();
  judgeSequentialContainer(container, copyArr);

  for (let i = 0; i < testNum; ++i) {
    const pos = Math.floor(Math.random() * container.length);
    const num = 10;
    // const a = container.toArray();
    // container.splice(pos, 0, ...new Array(num).fill(-1)).toArray();
    // const b = container.toArray();
    // expect(a.length).to.equal(b.length - 10);
    expect(
      container.splice(pos, 0, ...new Array(num).fill(-1)).toArray()
    ).to.deep.equal(
      copyArr.splice(pos, 0, ...new Array(num).fill(-1))
    );
    judgeSequentialContainer(container, copyArr);
  }
  judgeSequentialContainer(container, copyArr);

  const sourceArr = [...copyArr];
  copyArr.length = 0;
  copyArr.push(sourceArr[0]);
  const length = sourceArr.length;
  for (let i = 1; i < length; ++i) {
    if (sourceArr[i] === sourceArr[i - 1]) continue;
    copyArr.push(sourceArr[i]);
  }

  expect(container.unique()).to.equal(copyArr.length);
  judgeSequentialContainer(container, copyArr);

  expect(container.slice().toArray()).to.deep.equal(copyArr.slice());
  expect(container.slice(-1).toArray()).to.deep.equal(copyArr.slice(-1));
  expect(container.slice(-1, -2).toArray()).to.deep.equal(copyArr.slice(-1, -2));
  expect(container.slice(-copyArr.length - 1, -2).toArray())
    .to.deep.equal(copyArr.slice(-copyArr.length, -2));
  expect(container.slice(-copyArr.length - 1, copyArr.length + 1).toArray())
    .to.deep.equal(copyArr.slice(-copyArr.length, copyArr.length + 1));
  expect(container.slice(copyArr.length).toArray()).to.deep.equal(copyArr.slice(copyArr.length));
  judgeSequentialContainer(container, copyArr);

  // @ts-ignore
  expect(container.splice().toArray()).to.deep.equal(copyArr.splice());
  expect(container.splice(-1).toArray()).to.deep.equal(copyArr.splice(-1));
  expect(container.splice(-1, -1).toArray()).to.deep.equal(copyArr.splice(-1, -1));
  expect(container.splice(-copyArr.length - 1, -1).toArray())
    .to.deep.equal(copyArr.splice(-copyArr.length - 1, -1));
  expect(container.splice(0).toArray()).to.deep.equal(copyArr.splice(0));
  judgeSequentialContainer(container, copyArr);

  for (let i = 0; i < testNum * 20; ++i) {
    expect(container.push(i)).to.equal(copyArr.push(i));
  }
  judgeSequentialContainer(container, copyArr);

  expect(container.splice(5000, 1000, ...[1, 2, 3])
    .toArray()).to.deep.equal(copyArr.splice(5000, 1000, ...[1, 2, 3]));
  expect(container.splice(5000, 10000, ...[1, 2, 3])
    .toArray()).to.deep.equal(copyArr.splice(5000, 10000, ...[1, 2, 3]));
  expect(container.splice(5000, 5000, ...[1, 2, 3])
    .toArray()).to.deep.equal(copyArr.splice(5000, 5000, ...[1, 2, 3]));
  judgeSequentialContainer(container, copyArr);

  container.sort();
  copyArr.sort(compareFromS2L);
  judgeSequentialContainer(container, copyArr);

  container.clear();
  copyArr.length = 0;
  judgeSequentialContainer(container, copyArr);

  container.pop();
  copyArr.length = 0;
  judgeSequentialContainer(container, copyArr);
}

describe('SequentialContainer common test', () => {
  it('common test', () => {
    for (const container of containerArr) {
      testSequentialContainer(container);
    }
  });
});
