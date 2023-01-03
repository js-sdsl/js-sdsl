import { expect } from 'chai';
import { SORT_CONSTANT } from '@/algorithm/constant';
import nthElement from '@/algorithm/nthElement';

describe('nth_element test', () => {
  it(`nth_element ${SORT_CONSTANT.INSERT_SORT_MAX} test`, () => {
    const arr = [];
    for (let i = 0; i < SORT_CONSTANT.INSERT_SORT_MAX; ++i) {
      arr.push(Math.random());
    }
    const sorted = [...arr];
    sorted.sort((x, y) => x - y);
    expect(nthElement(arr, 3)).to.deep.equal(sorted);
  });

  it('nth_element test', () => {
    const arr = [];
    for (let i = 0; i < 1000; ++i) {
      arr.push(Math.random());
    }
    const sorted = [...arr];
    sorted.sort((x, y) => x - y);
    for (let i = 1; i <= 1000; ++i) {
      expect(nthElement(arr, i)[i]).to.equal(sorted[i]);
    }
  });
});
