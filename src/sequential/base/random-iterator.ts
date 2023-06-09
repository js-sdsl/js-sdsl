import { ContainerIterator, IteratorType } from '@/base';
import SequentialContainer from '@/sequential/base/index';
import { throwIteratorAccessError } from '@/utils/throwError';

export abstract class RandomIterator<T> extends ContainerIterator<T> {
  abstract readonly container: SequentialContainer<T>;
  /**
   * @internal
   */
  _node: number;
  /**
   * @internal
   */
  protected constructor(props: {
    node: number,
    type?: IteratorType
  }) {
    super(props);
    this._node = props.node;
    if (this.type === IteratorType.NORMAL) {
      this.pre = function () {
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
      this.pre = function () {
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
  // @ts-ignore
  pre(): this;
  // @ts-ignore
  next(): this;
}
