import TreeNode from './TreeNode';
import { ContainerIterator, IteratorType } from '@/container/ContainerBase/index';

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
  equals(obj: TreeIterator<K, V>) {
    return this.node === obj.node;
  }
}

export default TreeIterator;
