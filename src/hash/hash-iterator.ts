import { Iterator, ITERATOR_TYPE } from '@/base/iterator';
import { HashContainer, HashLinkNode } from '@/hash/base';
import { throwIteratorAccessError } from '@/utils/throwError';

export abstract class HashContainerIterator<K, V> extends Iterator<K | [K, V]> {
  abstract readonly container: HashContainer<K, V>;
  /**
   * @internal
   */
  declare _node: HashLinkNode<K, V>;
  /**
   * @internal
   */
  protected readonly _header: HashLinkNode<K, V>;
  prev: () => this;
  next: () => this;
  /**
   * @internal
   */
  protected constructor(props: {
    node: HashLinkNode<K, V>,
    header: HashLinkNode<K, V>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    const { header } = props;
    this._header = header;
    if (this.type === ITERATOR_TYPE.NORMAL) {
      this.prev = function () {
        if (this._node._prev === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._prev;
        return this;
      };
      this.next = function () {
        if (this._node === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._next;
        return this;
      };
    } else {
      this.prev = function () {
        if (this._node._next === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._next;
        return this;
      };
      this.next = function () {
        if (this._node === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._prev;
        return this;
      };
    }
  }
}
