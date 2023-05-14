import { expect } from 'chai';
import { SequentialContainer } from '@/index';

export function judgeSequentialContainer(
  container: SequentialContainer<number>,
  myVector: SequentialContainer<number>
) {
  expect(container.length).to.equal(myVector.length);
  myVector.forEach((element, index) => {
    try {
      expect(element).to.equal(container.at(index));
    } catch (e) {
      console.error('Error index:', index);
      throw e;
    }
  });
}
