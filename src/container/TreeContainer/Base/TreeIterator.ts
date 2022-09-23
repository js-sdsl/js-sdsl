import { TreeNode } from './TreeNode';
import type { TreeNodeEnableIndex } from './TreeNode';
import { ContainerIterator, IteratorType } from '@/container/ContainerBase';

abstract class TreeIterator<K, V> extends ContainerIterator<K | [K, V]> {
  /**
   * @internal
   */
  _node: TreeNode<K, V>;
  /**
   * @internal
   */
  protected _header: TreeNode<K, V>;
  pre: () => this;
  next: () => this;
  constructor(
    _node: TreeNode<K, V>,
    _header: TreeNode<K, V>,
    iteratorType?: IteratorType
  ) {
    super(iteratorType);
    this._node = _node;
    this._header = _header;

    if (this.iteratorType === IteratorType.NORMAL) {
      this.pre = function () {
        if (this._node === this._header._left) {
          throw new RangeError('Tree iterator access denied!');
        }
        this._node = this._node.pre();
        return this;
      };

      this.next = function () {
        if (this._node === this._header) {
          throw new RangeError('Tree iterator access denied!');
        }
        this._node = this._node.next();
        return this;
      };
    } else {
      this.pre = function () {
        if (this._node === this._header._right) {
          throw new RangeError('Tree iterator access denied!');
        }
        this._node = this._node.next();
        return this;
      };

      this.next = function () {
        if (this._node === this._header) {
          throw new RangeError('Tree iterator access denied!');
        }
        this._node = this._node.pre();
        return this;
      };
    }
  }
  get index() {
    let _node = this._node as TreeNodeEnableIndex<K, V>;
    const root = this._header._parent as TreeNodeEnableIndex<K, V>;
    if (_node === this._header) {
      if (root) {
        return root.subTreeSize - 1;
      }
      return 0;
    }
    let index = 0;
    if (_node._left) {
      index += _node._left.subTreeSize;
    }
    while (_node !== root) {
      const _parent = _node._parent as TreeNodeEnableIndex<K, V>;
      if (_node === _parent._right) {
        index += 1;
        if (_parent._left) {
          index += _parent._left.subTreeSize;
        }
      }
      _node = _parent;
    }
    return index;
  }
  equals(obj: TreeIterator<K, V>) {
    return this._node === obj._node;
  }
}

export default TreeIterator;
