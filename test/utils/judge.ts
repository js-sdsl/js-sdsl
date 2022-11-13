import { expect } from 'chai';
import { SequentialContainer } from '@/index';

export function judgeSequentialContainer(
  container: SequentialContainer<number>,
  myVector: SequentialContainer<number>
) {
  expect(container.size()).to.equal(myVector.size());
  container.forEach((element, index) => {
    expect(element).to.equal(myVector.getElementByPos(index));
  });
}
