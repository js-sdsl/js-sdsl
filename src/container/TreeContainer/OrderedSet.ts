import TreeContainer from './Base';
import TreeIterator from './Base/TreeIterator';
import { TreeNode } from './Base/TreeNode';
import { initContainer, IteratorType } from '@/container/ContainerBase';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import { throwIteratorAccessError } from '@/utils/throwError';

class OrderedSetIterator<K> extends TreeIterator<K, undefined> {
  container: OrderedSet<K>;
  constructor(
    node: TreeNode<K, undefined>,
    header: TreeNode<K, undefined>,
    container: OrderedSet<K>,
    iteratorType?: IteratorType
  ) {
    super(node, header, iteratorType);
    this.container = container;
  }
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    return this._node._key!;
  }
  copy() {
    return new OrderedSetIterator<K>(
      this._node,
      this._header,
      this.container,
      this.iteratorType
    );
  }
  // @ts-ignore
  equals(iter: OrderedSetIterator<K>): boolean;
}

export type { OrderedSetIterator };

class OrderedSet<K> extends TreeContainer<K, undefined> {
  /**
   * @param container - The initialization container.
   * @param cmp - The compare function.
   * @param enableIndex - Whether to enable iterator indexing function.
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
    const self = this;
    container.forEach(function (el) {
      self.insert(el);
    });
  }
  begin() {
    return new OrderedSetIterator<K>(
      this._header._left || this._header,
      this._header,
      this
    );
  }
  end() {
    return new OrderedSetIterator<K>(this._header, this._header, this);
  }
  rBegin() {
    return new OrderedSetIterator<K>(
      this._header._right || this._header,
      this._header,
      this,
      IteratorType.REVERSE
    );
  }
  rEnd() {
    return new OrderedSetIterator<K>(this._header, this._header, this, IteratorType.REVERSE);
  }
  front() {
    return this._header._left ? this._header._left._key : undefined;
  }
  back() {
    return this._header._right ? this._header._right._key : undefined;
  }
  lowerBound(key: K) {
    const resNode = this._lowerBound(this._root, key);
    return new OrderedSetIterator<K>(resNode, this._header, this);
  }
  upperBound(key: K) {
    const resNode = this._upperBound(this._root, key);
    return new OrderedSetIterator<K>(resNode, this._header, this);
  }
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this._root, key);
    return new OrderedSetIterator<K>(resNode, this._header, this);
  }
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this._root, key);
    return new OrderedSetIterator<K>(resNode, this._header, this);
  }
  forEach(callback: (element: K, index: number, set: OrderedSet<K>) => void) {
    this._inOrderTraversal(function (node, index, set) {
      callback(node._key as K, index, set);
    });
  }
  /**
   * @description Insert element to set.
   * @param key - The key want to insert.
   * @param hint - You can give an iterator hint to improve insertion efficiency.
   * @return The size of container after setting.
   * @example
   * const st = new OrderedSet([2, 4, 5]);
   * const iter = st.begin();
   * st.insert(1);
   * st.insert(3, iter);  // give a hint will be faster.
   */
  insert(key: K, hint?: OrderedSetIterator<K>) {
    return this._set(key, undefined, hint);
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    const node = this._inOrderTraversal(pos);
    return node._key as K;
  }
  find(element: K) {
    const resNode = this._getTreeNodeByKey(this._root, element);
    return new OrderedSetIterator<K>(resNode, this._header, this);
  }
  union(other: OrderedSet<K>) {
    const self = this;
    other.forEach(function (el) {
      self.insert(el);
    });
    return this._length;
  }
  * [Symbol.iterator]() {
    const length = this._length;
    const nodeList = this._inOrderTraversal();
    for (let i = 0; i < length; ++i) {
      yield nodeList[i]._key as K;
    }
  }
  // @ts-ignore
  eraseElementByIterator(iter: OrderedSetIterator<K>): OrderedSetIterator<K>;
}

export default OrderedSet;
