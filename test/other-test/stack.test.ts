import { expect } from 'chai';
import { Vector, Stack } from '@/index';

const arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

function judge(myStack: Stack<number>, myVector: Vector<number>) {
  expect(myStack.toArray()).to.deep.equal(myVector.toArray());
  while (!myStack.empty()) {
    if (myStack.length !== myVector.length) return false;
    const s = myStack.top();
    const v = myVector.back();
    if (s !== v) return false;
    expect(myStack.pop()).to.equal(myVector.pop());
  }
  expect(() => myStack.pop()).to.not.throw();
  expect(myStack.top()).to.equal(undefined);
  return true;
}

describe('stack test', () => {
  const myStack = new Stack(arr);
  const myVector = new Vector(arr);

  it('stack size test', () => {
    expect(myStack.length).to.equal(myVector.length);
  });

  it('stack clear function test', () => {
    myStack.clear();
    myVector.clear();
    expect(judge(myStack, myVector)).to.equal(true);
  });

  it('stack other function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myStack.push(i);
      myVector.push(i);
    }
    expect(judge(myStack, myVector)).to.equal(true);
  });
});
