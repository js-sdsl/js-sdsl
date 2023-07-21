import TreeContainer from './base';
import { Entries } from '@/base';
import { ITERATOR_TYPE } from '@/base/iterator';
import TreeIterator from '@/tree/tree-iterator';
import { TreeNodeEnableIndex } from '@/tree/tree-node';
import { CompareFn } from '@/utils/compareFn';
import { throwIteratorAccessError } from '@/utils/throwError';

class OrderedSetIterator<K> extends TreeIterator<K, undefined> {
  container: OrderedSet<K>;
  constructor(props: {
    node: TreeNodeEnableIndex<K, undefined>,
    header: TreeNodeEnableIndex<K, undefined>,
    container: OrderedSet<K>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    this.container = props.container;
  }
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    return this._node._key!;
  }
  copy() {
    return new OrderedSetIterator<K>({
      node: this._node,
      header: this._header,
      container: this.container,
      type: this.type
    });
  }
  // @ts-ignore
  equals(iter: OrderedSetIterator<K>): boolean;
}

export type { OrderedSetIterator };

class OrderedSet<K> extends TreeContainer<K, undefined> {
  /**
   * @param entries - The initialization container.
   * @param options - Options.
   * @param options.cmp - The compare function.
   * @param options.enableIndex - Whether to enable iterator indexing function.
   * @example
   * new OrderedSet();
   * new OrderedSet([0, 1, 2]);
   * new OrderedSet([0, 1, 2], (x, y) => x - y);
   * new OrderedSet([0, 1, 2], (x, y) => x - y, true);
   */
  constructor(entries: Entries<K> = [], options: {
    cmp?: CompareFn<K>,
    enableIndex?: boolean
  } = {}) {
    super(options);
    const self = this;
    entries.forEach(function (el) {
      self.add(el);
    });
  }
  begin() {
    return new OrderedSetIterator<K>({
      node: this._header._left!,
      header: this._header,
      container: this
    });
  }
  end() {
    return new OrderedSetIterator<K>({
      node: this._header,
      header: this._header,
      container: this
    });
  }
  rBegin() {
    return new OrderedSetIterator<K>({
      node: this._header._right!,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  rEnd() {
    return new OrderedSetIterator<K>({
      node: this._header,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  front() {
    return this._header._left!._key;
  }
  back() {
    return this._header._right!._key;
  }
  lowerBound(key: K) {
    const resNode = this._lowerBound(this._root, key);
    return new OrderedSetIterator<K>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  upperBound(key: K) {
    const resNode = this._upperBound(this._root, key);
    return new OrderedSetIterator<K>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this._root, key);
    return new OrderedSetIterator<K>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this._root, key);
    return new OrderedSetIterator<K>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  forEach(callback: (value: K, index: number, container: this) => void) {
    this._inOrderTraversal(function (node, index, set) {
      callback(node._key as K, index, set);
    });
  }
  /**
   * @description Insert item to set.
   * @param key - The key want to insert.
   * @param hint - You can give an iterator hint to improve insertion efficiency.
   * @return The size of container after setting.
   * @example
   * const st = new OrderedSet([2, 4, 5]);
   * const iter = st.begin();
   * st.insert(1);
   * st.insert(3, iter);  // give a hint will be faster.
   */
  add(key: K, hint?: OrderedSetIterator<K>) {
    this._set(key, undefined, hint);
    return this;
  }
  _at(index: number) {
    const node = this._inOrderTraversal(index);
    return node._key as K;
  }
  find(item: K) {
    const resNode = this._getTreeNodeByKey(this._root, item);
    return new OrderedSetIterator<K>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  union(other: OrderedSet<K>) {
    const self = this;
    other.forEach(function (el) {
      self.add(el);
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
  entries(): IterableIterator<[K, K]> {
    const self = this;
    let node = this._header._left;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            done,
            value: undefined as unknown as [K, K]
          };
        }
        const value = <[K, K]>[node!._key, node!._key];
        node = node!._next();
        return {
          done,
          value
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  }
  every(callback: (value: K, index: number, container: this) => unknown) {
    return !this._inOrderTraversal(function (node, index, map) {
      return !callback(node._key!, index, map);
    });
  }
  filter(callback: (value: K, index: number, container: this) => unknown) {
    const items: K[] = [];
    this._inOrderTraversal(function (node, index, map) {
      const item = node._key!;
      const flag = callback(item, index, map);
      if (flag) items.push(item);
      return false;
    });
    return new OrderedSet(items, {
      cmp: this._cmp,
      enableIndex: this.enableIndex
    });
  }
  some(callback: (value: K, index: number, container: this) => unknown) {
    return this._inOrderTraversal(function (node, index, map) {
      return callback(node._key!, index, map);
    });
  }
  values() {
    return this.keys();
  }
  erase(index: number): number;
  // @ts-ignore
  erase(iter: OrderedSetIterator<K>): OrderedSetIterator<K>;
}

export default OrderedSet;
