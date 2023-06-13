import { Iterator, ITERATOR_TYPE } from '@/base/iterator';
import SequentialContainer from '@/sequential/base';
import { throwIteratorAccessError } from '@/utils/throwError';

export abstract class RandomIterator<T> extends Iterator<T> {
  abstract readonly container: SequentialContainer<T>;
  /**
   * @internal
   */
  declare _node: number;
  prev: () => this;
  next: () => this;
  /**
   * @internal
   */
  protected constructor(props: {
    node: number,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    if (this.type === ITERATOR_TYPE.NORMAL) {
      this.prev = function () {
        if (this._node === 0) {
          throwIteratorAccessError();
        }
        this._node -= 1;
        return this;
      };
      this.next = function () {
        if (this._node === this.container.length) {
          throwIteratorAccessError();
        }
        this._node += 1;
        return this;
      };
    } else {
      this.prev = function () {
        if (this._node === this.container.length - 1) {
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
    return this.container.at(this._node) as T;
  }
  set pointer(newValue: T) {
    this.container.set(this._node, newValue);
  }
}
