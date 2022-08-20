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
  protected _pre() {
    let preNode: TreeNode<K, V> = this.node;
    if (
      preNode.color === TreeNode.red &&
      (preNode.parent as TreeNode<K, V>).parent === preNode
    ) {
      preNode = preNode.right as TreeNode<K, V>;
    } else if (preNode.left) {
      preNode = preNode.left;
      while (preNode.right) {
        preNode = preNode.right;
      }
    } else {
      let pre = preNode.parent as TreeNode<K, V>;
      while (pre.left === preNode) {
        preNode = pre;
        pre = preNode.parent as TreeNode<K, V>;
      }
      preNode = pre;
    }
    return preNode as TreeNode<K, V>;
  }
  protected _next() {
    let nextNode: TreeNode<K, V> = this.node;
    if (nextNode.right) {
      nextNode = nextNode.right;
      while (nextNode.left) {
        nextNode = nextNode.left;
      }
    } else {
      let pre = nextNode.parent as TreeNode<K, V>;
      while (pre.right === nextNode) {
        nextNode = pre;
        pre = nextNode.parent as TreeNode<K, V>;
      }
      if (nextNode.right !== pre) {
        nextNode = pre;
      }
    }
    return nextNode as TreeNode<K, V>;
  }
  pre() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.header.right) {
        throw new RangeError('Tree iterator access denied!');
      }
      this.node = this._next();
    } else {
      if (this.node === this.header.left) {
        throw new RangeError('Tree iterator access denied!');
      }
      this.node = this._pre();
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.header) {
        throw new RangeError('Tree iterator access denied!');
      }
      this.node = this._pre();
    } else {
      if (this.node === this.header) {
        throw new RangeError('Tree iterator access denied!');
      }
      this.node = this._next();
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
