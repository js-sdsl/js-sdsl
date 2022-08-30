import { ContainerIterator } from '@/container/ContainerBase/index';
import TreeNode from './TreeNode';

abstract class TreeIterator<K, V> extends ContainerIterator<K | [K, V]> {
  protected node: TreeNode<K, V>;
  protected header: TreeNode<K, V>;
  constructor(
    node: TreeNode<K, V>,
    header: TreeNode<K, V>
  ) {
    super();
    this.node = node;
    this.header = header;
  }
  pre() {
    if (this.node === this.header.left) {
      throw new RangeError('Tree iterator access denied!');
    }
    this.node = this.node.pre();
    return this;
  }
  next() {
    if (this.node === this.header) {
      throw new RangeError('Tree iterator access denied!');
    }
    this.node = this.node.next();
    return this;
  }
  equals(obj: TreeIterator<K, V>) {
    return this.node === obj.node;
  }
}

export default TreeIterator;
