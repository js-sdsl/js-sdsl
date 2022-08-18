import { RunTimeError } from '@/utils/error';
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
    if (preNode.color === TreeNode.red &&
      (preNode.parent as TreeNode<K, V>).parent === preNode) {
      preNode = preNode.rightChild as TreeNode<K, V>;
    } else if (preNode.leftChild) {
      preNode = preNode.leftChild;
      while (preNode.rightChild) {
        preNode = preNode.rightChild;
      }
    } else {
      let pre = preNode.parent as TreeNode<K, V>;
      while (pre.leftChild === preNode) {
        preNode = pre;
        pre = preNode.parent as TreeNode<K, V>;
      }
      preNode = pre;
    }
    return preNode as TreeNode<K, V>;
  }
  protected _next() {
    let nextNode: TreeNode<K, V> = this.node;
    if (nextNode.rightChild) {
      nextNode = nextNode.rightChild;
      while (nextNode.leftChild) {
        nextNode = nextNode.leftChild;
      }
    } else {
      let pre = nextNode.parent as TreeNode<K, V>;
      while (pre.rightChild === nextNode) {
        nextNode = pre;
        pre = nextNode.parent as TreeNode<K, V>;
      }
      if (nextNode.rightChild !== pre) {
        nextNode = pre;
      }
    }
    return nextNode as TreeNode<K, V>;
  }
  pre() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.header.rightChild) {
        throw new RunTimeError('Tree iterator access denied!');
      }
      this.node = this._next();
    } else {
      if (this.node === this.header.leftChild) {
        throw new RunTimeError('Tree iterator access denied!');
      }
      this.node = this._pre();
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.header) {
        throw new RunTimeError('Tree iterator access denied!');
      }
      this.node = this._pre();
    } else {
      if (this.node === this.header) {
        throw new RunTimeError('Tree iterator access denied!');
      }
      this.node = this._next();
    }
    return this;
  }
  equals(obj: TreeIterator<K, V>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new TypeError(`obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new TypeError('iterator type error!');
    }
    return this.node === obj.node;
  }
}

export default TreeIterator;
