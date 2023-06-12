import { Iterator, ITERATOR_TYPE } from '@/base/iterator';
import { HashContainer, HashLinkNode } from '@/hash/base';
import { throwIteratorAccessError } from '@/utils/throwError';

export abstract class HashContainerIterator<K, V> extends Iterator<K | [K, V]> {
  abstract readonly container: HashContainer<K, V>;
  /**
   * @internal
   */
  _node: HashLinkNode<K, V>;
  /**
   * @internal
   */
  protected readonly _header: HashLinkNode<K, V>;
  /**
   * @internal
   */
  protected constructor(props: {
    node: HashLinkNode<K, V>,
    header: HashLinkNode<K, V>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    const { node, header } = props;
    this._node = node;
    this._header = header;
    if (this.type === ITERATOR_TYPE.NORMAL) {
      this.pre = function () {
        if (this._node._pre === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._pre;
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
      this.pre = function () {
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
        this._node = this._node._pre;
        return this;
      };
    }
  }
  // @ts-ignore
  pre(): this;
  // @ts-ignore
  next(): this;
}
