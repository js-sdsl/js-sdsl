import { TreeNode } from './TreeNode';
import type { TreeNodeEnableIndex } from './TreeNode';
import { ContainerIterator, IteratorType } from '@/container/ContainerBase';

abstract class TreeIterator<K, V> extends ContainerIterator<K | [K, V]> {
  protected node: TreeNode<K, V>;
  protected header: TreeNode<K, V>;
  pre: () => this;
  next: () => this;
  constructor(
    node: TreeNode<K, V>,
    header: TreeNode<K, V>,
    iteratorType?: IteratorType
  ) {
    super(iteratorType);
    this.node = node;
    this.header = header;

    if (this.iteratorType === IteratorType.NORMAL) {
      this.pre = function () {
        if (this.node === this.header.left) {
          throw new RangeError('Tree iterator access denied!');
        }
        this.node = this.node.pre();
        return this;
      };

      this.next = function () {
        if (this.node === this.header) {
          throw new RangeError('Tree iterator access denied!');
        }
        this.node = this.node.next();
        return this;
      };
    } else {
      this.pre = function () {
        if (this.node === this.header.right) {
          throw new RangeError('Tree iterator access denied!');
        }
        this.node = this.node.next();
        return this;
      };

      this.next = function () {
        if (this.node === this.header) {
          throw new RangeError('Tree iterator access denied!');
        }
        this.node = this.node.pre();
        return this;
      };
    }
  }
  get index() {
    let node = this.node;
    if (node === this.header) {
      if (this.header.parent) {
        return (this.header.parent as TreeNodeEnableIndex<K, V>).subTreeSize - 1;
      }
      return 0;
    }
    let index = 0;
    if (node.left) {
      index += (node.left as TreeNodeEnableIndex<K, V>).subTreeSize;
    }
    while (node !== this.header) {
      const parent = node.parent as TreeNode<K, V>;
      if (node === parent.right) {
        index += 1;
        if (parent.left) {
          index += (parent.left as TreeNodeEnableIndex<K, V>).subTreeSize;
        }
      }
      node = parent;
    }
    return index;
  }
  equals(obj: TreeIterator<K, V>) {
    return this.node === obj.node;
  }
}

export default TreeIterator;
