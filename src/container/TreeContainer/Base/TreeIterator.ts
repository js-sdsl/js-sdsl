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
        if (this._node === this._header.left) {
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
        if (this._node === this._header.right) {
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
    let _node = this._node;
    if (_node === this._header) {
      if (this._header.parent) {
        return (this._header.parent as TreeNodeEnableIndex<K, V>).subTreeSize - 1;
      }
      return 0;
    }
    let index = 0;
    if (_node.left) {
      index += (_node.left as TreeNodeEnableIndex<K, V>).subTreeSize;
    }
    while (_node !== this._header) {
      const parent = _node.parent as TreeNode<K, V>;
      if (_node === parent.right) {
        index += 1;
        if (parent.left) {
          index += (parent.left as TreeNodeEnableIndex<K, V>).subTreeSize;
        }
      }
      _node = parent;
    }
    return index;
  }
  equals(obj: TreeIterator<K, V>) {
    return this._node === obj._node;
  }
}

export default TreeIterator;
