import TreeContainer from './base';
import { Entries } from '@/base';
import { ITERATOR_TYPE } from '@/base/iterator';
import TreeIterator from '@/tree/tree-iterator';
import { TreeNodeEnableIndex } from '@/tree/tree-node';
import { CompareFn } from '@/utils/compareFn';
import { throwIteratorAccessError } from '@/utils/throwError';

class OrderedMapIterator<K, V> extends TreeIterator<K, V> {
  container: OrderedMap<K, V>;
  constructor(props: {
    node: TreeNodeEnableIndex<K, V>,
    header: TreeNodeEnableIndex<K, V>,
    container: OrderedMap<K, V>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    this.container = props.container;
  }
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    const node = this._node;
    return new Proxy(<[K, V]><unknown>[], {
      get(target, prop: '0' | '1') {
        if (prop === '0') return node._key;
        else if (prop === '1') return node._value;
        target[0] = node._key!;
        target[1] = node._value!;
        return target[prop];
      },
      set(_, prop: '1', newValue: V) {
        if (prop !== '1') {
          throw new TypeError('props must be 1');
        }
        node._value = newValue;
        return true;
      }
    });
  }
  copy() {
    return new OrderedMapIterator<K, V>({
      node: this._node,
      header: this._header,
      container: this.container,
      type: this.type
    });
  }
  // @ts-ignore
  equals(iter: OrderedMapIterator<K, V>): boolean;
}

export type { OrderedMapIterator };

class OrderedMap<K, V> extends TreeContainer<K, V> {
  /**
   * @param entries - The initialization container.
   * @param options - Options.
   * @param options.cmp - The compare function.
   * @param options.enableIndex - Whether to enable iterator indexing function.
   * @example
   * new OrderedMap();
   * new OrderedMap([[0, 1], [2, 1]]);
   * new OrderedMap([[0, 1], [2, 1]], (x, y) => x - y);
   * new OrderedMap([[0, 1], [2, 1]], (x, y) => x - y, true);
   */
  constructor(entries: Entries<[K, V]> = [], options: {
    cmp?: CompareFn<K>,
    enableIndex?: boolean
  } = {}) {
    super(options);
    const self = this;
    entries.forEach(function (el) {
      self.set(el[0], el[1]);
    });
  }
  begin() {
    return new OrderedMapIterator<K, V>({
      node: this._header._left!,
      header: this._header,
      container: this
    });
  }
  end() {
    return new OrderedMapIterator<K, V>({
      node: this._header,
      header: this._header,
      container: this
    });
  }
  rBegin() {
    return new OrderedMapIterator<K, V>({
      node: this._header._right!,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  rEnd() {
    return new OrderedMapIterator<K, V>({
      node: this._header,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  front() {
    if (this._length === 0) return undefined;
    const minNode = this._header._left!;
    return <[K, V]>[minNode._key, minNode._value];
  }
  back() {
    if (this._length === 0) return undefined;
    const maxNode = this._header._right!;
    return <[K, V]>[maxNode._key, maxNode._value];
  }
  lowerBound(key: K) {
    const resNode = this._lowerBound(this._root, key);
    return new OrderedMapIterator<K, V>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  upperBound(key: K) {
    const resNode = this._upperBound(this._root, key);
    return new OrderedMapIterator<K, V>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this._root, key);
    return new OrderedMapIterator<K, V>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this._root, key);
    return new OrderedMapIterator<K, V>({
      node: resNode,
      header: this._header,
      container: this
    });
  }
  forEach(callback: (value: [K, V], index: number, container: this) => void) {
    this._inOrderTraversal(function (node, index, map) {
      callback(<[K, V]>[node._key, node._value], index, map);
    });
  }
  /**
   * @description Insert a key-value pair or set value by the given key.
   * @param key - The key want to insert.
   * @param value - The value want to set.
   * @param hint - You can give an iterator hint to improve insertion efficiency.
   * @return The size of container after setting.
   * @example
   * const mp = new OrderedMap([[2, 0], [4, 0], [5, 0]]);
   * const iter = mp.begin();
   * mp.setElement(1, 0);
   * mp.setElement(3, 0, iter);  // give a hint will be faster.
   */
  set(key: K, value: V, hint?: OrderedMapIterator<K, V>) {
    this._set(key, value, hint);
    return this;
  }
  /**
   * @internal
   */
  protected _at(index: number) {
    const node = this._getNodeByPos(index);
    return <[K, V]>[node._key, node._value];
  }
  find(key: K) {
    const curNode = this._getTreeNodeByKey(this._root, key);
    return new OrderedMapIterator<K, V>({
      node: curNode,
      header: this._header,
      container: this
    });
  }
  /**
   * @description Get the value of the item of the specified key.
   * @param key - The specified key you want to get.
   * @example
   * const val = container.getElementByKey(1);
   */
  get(key: K) {
    const curNode = this._getTreeNodeByKey(this._root, key);
    return curNode._value;
  }
  union(other: OrderedMap<K, V>) {
    const self = this;
    other.forEach(function (el) {
      self.set(el[0], el[1]);
    });
    return this._length;
  }
  * [Symbol.iterator]() {
    const length = this._length;
    const nodeList = this._inOrderTraversal();
    for (let i = 0; i < length; ++i) {
      const node = nodeList[i];
      yield <[K, V]>[node._key, node._value];
    }
  }
  entries(): IterableIterator<[K, V]> {
    const self = this;
    let node = this._header._left;
    return {
      next() {
        const done = !node || node === self._header;
        if (done) {
          return {
            done,
            value: undefined as unknown as [K, V]
          };
        }
        const value = <[K, V]>[node!._key, node!._value];
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
  every(callback: (value: [K, V], index: number, container: this) => unknown) {
    return !this._inOrderTraversal(function (node, index, map) {
      return !callback([node._key!, node._value!], index, map);
    });
  }
  filter(callback: (value: [K, V], index: number, container: this) => unknown) {
    const items: [K, V][] = [];
    this._inOrderTraversal(function (node, index, map) {
      const item = <[K, V]>[node._key, node._value];
      const flag = callback(item, index, map);
      if (flag) items.push(item);
      return false;
    });
    return new OrderedMap(items, {
      cmp: this._cmp,
      enableIndex: this.enableIndex
    });
  }
  some(callback: (value: [K, V], index: number, container: this) => unknown) {
    return this._inOrderTraversal(function (node, index, map) {
      return callback([node._key!, node._value!], index, map);
    });
  }
  values(): IterableIterator<V> {
    const self = this;
    let node = this._header._left;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            value: undefined as unknown as V,
            done
          };
        }
        const value = node!._value as V;
        node = node!._next();
        return {
          value,
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  }
  erase(index: number): number;
  // @ts-ignore
  erase(iter: OrderedMapIterator<K, V>): OrderedMapIterator<K, V>;
  // @ts-ignore
  at(index: number): [K, V] | undefined;
}

export default OrderedMap;
