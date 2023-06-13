import type { TreeNodeEnableIndex } from './tree-node';
import { Iterator, ITERATOR_TYPE } from '@/base/iterator';
import TreeContainer from '@/tree/base';
import { throwIteratorAccessError } from '@/utils/throwError';

abstract class TreeIterator<K, V> extends Iterator<K | [K, V]> {
  abstract readonly container: TreeContainer<K, V>;
  /**
   * @internal
   */
  declare _node: TreeNodeEnableIndex<K, V>;
  /**
   * @internal
   */
  protected _header: TreeNodeEnableIndex<K, V>;
  prev: () => this;
  next: () => this;
  /**
   * @internal
   */
  protected constructor(props: {
    node: TreeNodeEnableIndex<K, V>,
    header: TreeNodeEnableIndex<K, V>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    const { header } = props;
    this._header = header;
    if (this.type === ITERATOR_TYPE.NORMAL) {
      this.prev = function () {
        if (this._node === this._header._left) {
          throwIteratorAccessError();
        }
        this._node = this._node._prev();
        return this;
      };
      this.next = function () {
        if (this._node === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._next();
        return this;
      };
    } else {
      this.prev = function () {
        if (this._node === this._header._right) {
          throwIteratorAccessError();
        }
        this._node = this._node._next();
        return this;
      };
      this.next = function () {
        if (this._node === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._prev();
        return this;
      };
    }
  }
  /**
   * @description Get the sequential index of the iterator in the tree container.<br/>
   *              <strong>Note:</strong>
   *              This function only takes effect when the specified tree container `enableIndex = true`.
   * @returns The index subscript of the node in the tree.
   * @example
   * const st = new OrderedSet([1, 2, 3], true);
   * console.log(st.begin().next().index);  // 1
   */
  get index() {
    let node = this._node;
    if (node._subTreeSize === undefined) {
      throw new TypeError('Please set `enableIndex` to `true` in the constructor!');
    }
    const root = this._header._parent;
    if (node === this._header) {
      if (root) {
        return root._subTreeSize - 1;
      }
      return 0;
    }
    let index = 0;
    if (node._left) {
      index += node._left._subTreeSize;
    }
    while (node !== root) {
      const _parent = node._parent!;
      if (node === _parent._right) {
        index += 1;
        if (_parent._left) {
          index += _parent._left._subTreeSize;
        }
      }
      node = _parent;
    }
    return index;
  }
}

export default TreeIterator;
