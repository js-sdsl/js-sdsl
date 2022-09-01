import { ContainerIterator } from '@/container/ContainerBase/index';
import TreeNode from './TreeNode';

abstract class TreeIterator<K, V> extends ContainerIterator<K | [K, V]> {
  protected node: TreeNode<K, V>;
  protected header: TreeNode<K, V>;
  pre: () => this;
  next: () => this;
  constructor(
    node: TreeNode<K, V>,
    header: TreeNode<K, V>,
    iteratorType?: boolean
  ) {
    super(iteratorType);
    this.node = node;
    this.header = header;

    if (this.iteratorType === ContainerIterator.NORMAL) {
      this.pre = function () {
        if (this.node === this.header.left) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this.node = this.node.pre();
        return this;
      };

      this.next = function () {
        if (this.node === this.header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this.node = this.node.next();
        return this;
      };
    } else {
      this.pre = function () {
        if (this.node === this.header.right) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this.node = this.node.next();
        return this;
      };

      this.next = function () {
        if (this.node === this.header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this.node = this.node.pre();
        return this;
      };
    }
  }
  get index() {
    if (this.node === this.header) {
      if (this.node.parent) {
        return this.node.parent.subTreeSize;
      }
      return 0;
    }
    return this.node.subTreeSize;
  }
  equals(obj: TreeIterator<K, V>) {
    return this.node === obj.node;
  }
}

export default TreeIterator;
