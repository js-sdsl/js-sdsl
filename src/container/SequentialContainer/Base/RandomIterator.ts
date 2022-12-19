import { ContainerIterator, IteratorType } from '@/container/ContainerBase';
import { throwIteratorAccessError } from '@/utils/throwError';

export abstract class RandomIterator<T> extends ContainerIterator<T> {
  /**
   * @internal
   */
  _node: number;
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
  /**
   * @internal
   */
  constructor(
    index: number,
    size: () => number,
    getElementByPos: (pos: number) => T,
    setElementByPos: (pos: number, element: T) => void,
    iteratorType?: IteratorType
  ) {
    super(iteratorType);
    this._node = index;
    this._size = size;
    this._getElementByPos = getElementByPos;
    this._setElementByPos = setElementByPos;
    if (this.iteratorType === IteratorType.NORMAL) {
      this.pre = function () {
        if (this._node === 0) {
          throwIteratorAccessError();
        }
        this._node -= 1;
        return this;
      };
      this.next = function () {
        if (this._node === this._size()) {
          throwIteratorAccessError();
        }
        this._node += 1;
        return this;
      };
    } else {
      this.pre = function () {
        if (this._node === this._size() - 1) {
          throwIteratorAccessError();
        }
        this._node += 1;
        return this;
      };
      this.next = function () {
        if (this._node === -1) {
          throwIteratorAccessError();
        }
        this._node -= 1;
        return this;
      };
    }
  }
  get pointer() {
    return this._getElementByPos(this._node);
  }
  set pointer(newValue: T) {
    this._setElementByPos(this._node, newValue);
  }
  // @ts-ignore
  pre(): this;
  // @ts-ignore
  next(): this;
}
