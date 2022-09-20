import { $checkWithinAccessParams } from '@/utils/checkParams.macro';
import { ContainerIterator, IteratorType } from '@/container/ContainerBase';

export abstract class RandomIterator<T> extends ContainerIterator<T> {
  /**
   * @internal
   */
  protected node: number;
  /**
   * @internal
   */
  protected readonly _size: () => number;
  /**
   * @internal
   */
  protected readonly _getElementByPos: (pos: number) => T;
  /**
   * @internal
   */
  protected readonly _setElementByPos: (pos: number, element: T) => void;
  pre: () => this;
  next: () => this;
  constructor(
    index: number,
    size: () => number,
    getElementByPos: (pos: number) => T,
    setElementByPos: (pos: number, element: T) => void,
    iteratorType?: IteratorType
  ) {
    super(iteratorType);
    this.node = index;
    this._size = size;
    this._getElementByPos = getElementByPos;
    this._setElementByPos = setElementByPos;
    if (this.iteratorType === IteratorType.NORMAL) {
      this.pre = function () {
        if (this.node === 0) {
          throw new RangeError('Random iterator access denied!');
        }
        this.node -= 1;
        return this;
      };
      this.next = function () {
        if (this.node === this._size()) {
          throw new RangeError('Random Iterator access denied!');
        }
        this.node += 1;
        return this;
      };
    } else {
      this.pre = function () {
        if (this.node === this._size() - 1) {
          throw new RangeError('Random iterator access denied!');
        }
        this.node += 1;
        return this;
      };
      this.next = function () {
        if (this.node === -1) {
          throw new RangeError('Random iterator access denied!');
        }
        this.node -= 1;
        return this;
      };
    }
  }
  get pointer() {
    $checkWithinAccessParams!(this.node, 0, this._size() - 1);
    return this._getElementByPos(this.node);
  }
  set pointer(newValue: T) {
    $checkWithinAccessParams!(this.node, 0, this._size() - 1);
    this._setElementByPos(this.node, newValue);
  }
  equals(obj: RandomIterator<T>) {
    return this.node === obj.node;
  }
}
