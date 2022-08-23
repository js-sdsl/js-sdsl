import { ContainerIterator } from '@/container/ContainerBase/index';
import TreeNode from './TreeNode';

abstract class TreeIterator<K, V> extends ContainerIterator<K | [K, V]> {
  protected node: TreeNode<K, V>;
  protected header: TreeNode<K, V>;
  protected constructor(
    node: TreeNode<K, V>,
    header: TreeNode<K, V>,
    iteratorType: 'normal' | 'reverse'
  ) {
    super(iteratorType);
    this.node = node;
    this.header = header;
  }
  pre() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.header.right) {
        throw new RangeError('Tree iterator access denied!');
      }
      this.node = this.node.next();
    } else {
      if (this.node === this.header.left) {
        throw new RangeError('Tree iterator access denied!');
      }
      this.node = this.node.pre();
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.header) {
        throw new RangeError('Tree iterator access denied!');
      }
      this.node = this.node.pre();
    } else {
      if (this.node === this.header) {
        throw new RangeError('Tree iterator access denied!');
      }
      this.node = this.node.next();
    }
    return this;
  }
  equals(obj: TreeIterator<K, V>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new TypeError(`Obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new TypeError('Iterator type error!');
    }
    return this.node === obj.node;
  }
}

export default TreeIterator;
