import { expect } from 'chai';
import { SequentialContainer } from '@/index';

export function judgeSequentialContainer(
  container: SequentialContainer<number>,
  arr: number[]
) {
  expect(container.length).to.equal(arr.length);
  arr.forEach((element, index) => {
    try {
      expect(container.at(index)).to.equal(element);
    } catch (e) {
      console.error('Error index:', index);
      throw e;
    }
  });
}
