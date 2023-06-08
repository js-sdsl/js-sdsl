import { expect } from 'chai';
import { Vector } from '@/index';

const arr: number[] = [];
const testNum = 1000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}

describe('Vector test', () => {
  it('Vector test', () => {
    const vector = new Vector([1], false);
    vector.begin().pointer = 0;
    expect(vector.find(0).pointer).to.equal(0);
    vector.erase(vector.begin());
  });
});
