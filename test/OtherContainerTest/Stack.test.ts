import { expect } from 'chai';
import { Vector, Stack } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judge(myStack: Stack<number>, myVector: Vector<number>) {
  while (!myStack.empty()) {
    if (myStack.size() !== myVector.size()) return false;
    const s = myStack.top();
    const v = myVector.back();
    if (s !== v) return false;
    expect(myStack.pop()).to.equal(myVector.popBack());
  }
  expect(() => myStack.pop()).to.not.throw();
  expect(myStack.top()).to.equal(undefined);
  return true;
}

describe('Stack test', () => {
  const myStack = new Stack(arr);
  const myVector = new Vector(arr);

  it('Stack size test', () => {
    expect(myStack.size()).to.equal(myVector.size());
  });

  it('Stack clear function test', () => {
    myStack.clear();
    myVector.clear();
    expect(judge(myStack, myVector)).to.equal(true);
  });

  it('Stack other function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myStack.push(i);
      myVector.pushBack(i);
    }
    expect(judge(myStack, myVector)).to.equal(true);
  });
});
