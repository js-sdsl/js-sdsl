import TreeContainer from './Base';
import { TreeNode } from './Base/TreeNode';
import TreeIterator from './Base/TreeIterator';
import { $checkWithinAccessParams } from '@/utils/checkParams.macro';
import { initContainer, IteratorType } from '@/container/ContainerBase';

export class OrderedSetIterator<K> extends TreeIterator<K, undefined> {
  get pointer() {
    if (this.node === this.header) {
      throw new RangeError('OrderedSet iterator access denied!');
    }
    return this.node.key as K;
  }
  copy() {
    return new OrderedSetIterator(this.node, this.header, this.iteratorType);
  }
}

class OrderedSet<K> extends TreeContainer<K, undefined> {
  constructor(
    container: initContainer<K> = [],
    cmp?: (x: K, y: K) => number,
    enableIndex?: boolean
  ) {
    super(cmp, enableIndex);
    container.forEach((element) => this.insert(element));
    this.iterationFunc = this.iterationFunc.bind(this);
  }
  private readonly iterationFunc:
  (curNode: TreeNode<K, undefined> | undefined) => Generator<K, void, undefined> =
      function * (this: OrderedSet<K>, curNode: TreeNode<K, undefined> | undefined) {
        if (curNode === undefined) return;
        yield * this.iterationFunc(curNode.left);
        yield curNode.key as K;
        yield * this.iterationFunc(curNode.right);
      };
  begin() {
    return new OrderedSetIterator(
      this.header.left || this.header,
      this.header
    );
  }
  end() {
    return new OrderedSetIterator(this.header, this.header);
  }
  rBegin() {
    return new OrderedSetIterator(
      this.header.right || this.header,
      this.header,
      IteratorType.REVERSE
    );
  }
  rEnd() {
    return new OrderedSetIterator(this.header, this.header, IteratorType.REVERSE);
  }
  front() {
    return this.header.left ? this.header.left.key : undefined;
  }
  back() {
    return this.header.right ? this.header.right.key : undefined;
  }
  forEach(callback: (element: K, index: number) => void) {
    let index = 0;
    for (const element of this) callback(element, index++);
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this.length - 1);
    let res;
    let index = 0;
    for (const element of this) {
      if (index === pos) {
        res = element;
      }
      index += 1;
    }
    return res as K;
  }
  /**
   * @description Insert element to set.
   * @param key The key want to insert.
   * @param hint You can give an iterator hint to improve insertion efficiency.
   */
  insert(key: K, hint?: OrderedSetIterator<K>) {
    this.set(key, undefined, hint);
  }
  find(element: K) {
    const curNode = this.findElementNode(this.root, element);
    if (curNode !== undefined) {
      return new OrderedSetIterator(curNode, this.header);
    }
    return this.end();
  }
  lowerBound(key: K) {
    const resNode = this._lowerBound(this.root, key);
    return new OrderedSetIterator(resNode, this.header);
  }
  upperBound(key: K) {
    const resNode = this._upperBound(this.root, key);
    return new OrderedSetIterator(resNode, this.header);
  }
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this.root, key);
    return new OrderedSetIterator(resNode, this.header);
  }
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this.root, key);
    return new OrderedSetIterator(resNode, this.header);
  }
  union(other: OrderedSet<K>) {
    other.forEach((element) => this.insert(element));
  }
  [Symbol.iterator]() {
    return this.iterationFunc(this.root);
  }
}

export default OrderedSet;
