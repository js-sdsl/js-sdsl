import { ContainerIterator } from '@/container/ContainerBase';
import { checkWithinAccessParams } from '@/utils/checkParams';

export abstract class RandomIterator<T> extends ContainerIterator<T> {
  protected node: number;
  protected readonly size: () => number;
  protected readonly getElementByPos: (pos: number) => T;
  protected readonly setElementByPos: (pos: number, element: T) => void;
  pre: () => this;
  next: () => this;
  constructor(
    index: number,
    size: () => number,
    getElementByPos: (pos: number) => T,
    setElementByPos: (pos: number, element: T) => void,
    iteratorType?: boolean
  ) {
    super(iteratorType);
    this.node = index;
    this.size = size;
    this.getElementByPos = getElementByPos;
    this.setElementByPos = setElementByPos;
    if (this.iteratorType === ContainerIterator.NORMAL) {
      this.pre = function () {
        if (this.node === 0) {
          throw new RangeError('Deque iterator access denied!');
        }
        this.node -= 1;
        return this;
      };
      this.next = function () {
        if (this.node === this.size()) {
          throw new RangeError('Deque Iterator access denied!');
        }
        this.node += 1;
        return this;
      };
    } else {
      this.pre = function () {
        if (this.node === this.size() - 1) {
          throw new RangeError('Deque iterator access denied!');
        }
        this.node += 1;
        return this;
      };
      this.next = function () {
        if (this.node === -1) {
          throw new RangeError('Deque iterator access denied!');
        }
        this.node -= 1;
        return this;
      };
    }
  }
  get pointer() {
    checkWithinAccessParams(this.node, 0, this.size() - 1);
    return this.getElementByPos(this.node);
  }
  set pointer(newValue: T) {
    checkWithinAccessParams(this.node, 0, this.size() - 1);
    this.setElementByPos(this.node, newValue);
  }
  equals(obj: RandomIterator<T>) {
    return this.node === obj.node;
  }
}