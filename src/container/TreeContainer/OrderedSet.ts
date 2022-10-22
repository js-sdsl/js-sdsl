import TreeContainer from './Base';
import { TreeNode } from './Base/TreeNode';
import TreeIterator from './Base/TreeIterator';
import { $checkWithinAccessParams } from '@/utils/checkParams.macro';
import { initContainer, IteratorType } from '@/container/ContainerBase';

class OrderedSetIterator<K> extends TreeIterator<K, undefined> {
  get pointer() {
    if (this._node === this._header) {
      throw new RangeError('OrderedSet iterator access denied!');
    }
    return this._node._key as K;
  }
  copy() {
    return new OrderedSetIterator(this._node, this._header, this.iteratorType);
  }
}

export type { OrderedSetIterator };

class OrderedSet<K> extends TreeContainer<K, undefined> {
  /**
   * @param container The initialization container.
   * @param cmp The compare function.
   * @param enableIndex Whether to enable iterator indexing function.
   * @example
   * new OrderedSet();
   * new OrderedSet([0, 1, 2]);
   * new OrderedSet([0, 1, 2], (x, y) => x - y);
   * new OrderedSet([0, 1, 2], (x, y) => x - y, true);
   */
  constructor(
    container: initContainer<K> = [],
    cmp?: (x: K, y: K) => number,
    enableIndex?: boolean
  ) {
    super(cmp, enableIndex);
    container.forEach((element) => this.insert(element));
  }
  /**
   * @internal
   */
  private readonly _iterationFunc:
  (curNode: TreeNode<K, undefined> | undefined) => Generator<K, void, undefined> =
      function * (this: OrderedSet<K>, curNode: TreeNode<K, undefined> | undefined) {
        if (curNode === undefined) return;
        yield * this._iterationFunc(curNode._left);
        yield curNode._key as K;
        yield * this._iterationFunc(curNode._right);
      };
  begin() {
    return new OrderedSetIterator(
      this._header._left || this._header,
      this._header
    );
  }
  end() {
    return new OrderedSetIterator(this._header, this._header);
  }
  rBegin() {
    return new OrderedSetIterator(
      this._header._right || this._header,
      this._header,
      IteratorType.REVERSE
    );
  }
  rEnd() {
    return new OrderedSetIterator(this._header, this._header, IteratorType.REVERSE);
  }
  front() {
    return this._header._left ? this._header._left._key : undefined;
  }
  back() {
    return this._header._right ? this._header._right._key : undefined;
  }
  forEach(callback: (element: K, index: number) => void) {
    let index = 0;
    for (const element of this) callback(element, index++);
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let res;
    let index = 0;
    for (const element of this) {
      if (index === pos) {
        res = element;
        break;
      }
      index += 1;
    }
    return res as K;
  }
  /**
   * @description Insert element to set.
   * @param key The key want to insert.
   * @param hint You can give an iterator hint to improve insertion efficiency.
   * @example
   * const st = new OrderedSet([2, 4, 5]);
   * const iter = st.begin();
   * st.insert(1);
   * st.insert(3, iter);  // give a hint will be faster.
   */
  insert(key: K, hint?: OrderedSetIterator<K>) {
    this._set(key, undefined, hint);
  }
  find(element: K) {
    const curNode = this._findElementNode(this._root, element);
    if (curNode !== undefined) {
      return new OrderedSetIterator(curNode, this._header);
    }
    return this.end();
  }
  lowerBound(key: K) {
    const resNode = this._lowerBound(this._root, key);
    return new OrderedSetIterator(resNode, this._header);
  }
  upperBound(key: K) {
    const resNode = this._upperBound(this._root, key);
    return new OrderedSetIterator(resNode, this._header);
  }
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this._root, key);
    return new OrderedSetIterator(resNode, this._header);
  }
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this._root, key);
    return new OrderedSetIterator(resNode, this._header);
  }
  union(other: OrderedSet<K>) {
    other.forEach((element) => this.insert(element));
  }
  [Symbol.iterator]() {
    return this._iterationFunc(this._root);
  }
}

export default OrderedSet;
