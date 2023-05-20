import TreeContainer from './Base';
import TreeIterator from './Base/TreeIterator';
import { TreeNode } from './Base/TreeNode';
import { CallbackFn, initContainer, IteratorType } from '@/container/ContainerBase';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import { CompareFn } from '@/utils/compareFn';
import { throwIteratorAccessError } from '@/utils/throwError';

class OrderedMapIterator<K, V> extends TreeIterator<K, V> {
  container: OrderedMap<K, V>;
  constructor(
    node: TreeNode<K, V>,
    header: TreeNode<K, V>,
    container: OrderedMap<K, V>,
    iteratorType?: IteratorType
  ) {
    super(node, header, iteratorType);
    this.container = container;
  }
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    const self = this;
    return new Proxy(<[K, V]><unknown>[], {
      get(_, props: '0' | '1') {
        if (props === '0') return self._node._key;
        else if (props === '1') return self._node._value;
      },
      set(_, props: '1', newValue: V) {
        if (props !== '1') {
          throw new TypeError('props must be 1');
        }
        self._node._value = newValue;
        return true;
      }
    });
  }
  copy() {
    return new OrderedMapIterator<K, V>(
      this._node,
      this._header,
      this.container,
      this.iteratorType
    );
  }
  // @ts-ignore
  equals(iter: OrderedMapIterator<K, V>): boolean;
}

export type { OrderedMapIterator };

class OrderedMap<K, V> extends TreeContainer<K, V> {
  /**
   * @param container - The initialization container.
   * @param cmp - The compare function.
   * @param enableIndex - Whether to enable iterator indexing function.
   * @example
   * new OrderedMap();
   * new OrderedMap([[0, 1], [2, 1]]);
   * new OrderedMap([[0, 1], [2, 1]], (x, y) => x - y);
   * new OrderedMap([[0, 1], [2, 1]], (x, y) => x - y, true);
   */
  constructor(
    container: initContainer<[K, V]> = [],
    cmp?: CompareFn<K>,
    enableIndex?: boolean
  ) {
    super(cmp, enableIndex);
    const self = this;
    container.forEach(function (el) {
      self.set(el[0], el[1]);
    });
  }
  begin() {
    return new OrderedMapIterator<K, V>(this._header._left || this._header, this._header, this);
  }
  end() {
    return new OrderedMapIterator<K, V>(this._header, this._header, this);
  }
  rBegin() {
    return new OrderedMapIterator<K, V>(
      this._header._right || this._header,
      this._header,
      this,
      IteratorType.REVERSE
    );
  }
  rEnd() {
    return new OrderedMapIterator<K, V>(this._header, this._header, this, IteratorType.REVERSE);
  }
  front() {
    if (this._length === 0) return;
    const minNode = this._header._left!;
    return <[K, V]>[minNode._key, minNode._value];
  }
  back() {
    if (this._length === 0) return;
    const maxNode = this._header._right!;
    return <[K, V]>[maxNode._key, maxNode._value];
  }
  lowerBound(key: K) {
    const resNode = this._lowerBound(this._root, key);
    return new OrderedMapIterator<K, V>(resNode, this._header, this);
  }
  upperBound(key: K) {
    const resNode = this._upperBound(this._root, key);
    return new OrderedMapIterator<K, V>(resNode, this._header, this);
  }
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this._root, key);
    return new OrderedMapIterator<K, V>(resNode, this._header, this);
  }
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this._root, key);
    return new OrderedMapIterator<K, V>(resNode, this._header, this);
  }
  forEach(callback: CallbackFn<[K, V], this, void>) {
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
    return this._set(key, value, hint);
  }
  at(index: number) {
    $checkWithinAccessParams!(index, 0, this._length - 1);
    const node = this._inOrderTraversal(index);
    return <[K, V]>[node._key, node._value];
  }
  find(key: K) {
    const curNode = this._getTreeNodeByKey(this._root, key);
    return new OrderedMapIterator<K, V>(curNode, this._header, this);
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
  every(callback: CallbackFn<[K, V], this, unknown>) {
    return !this._inOrderTraversal(function (node, index, map) {
      return !callback([node._key!, node._value!], index, map);
    });
  }
  filter(callback: CallbackFn<[K, V], this, unknown>) {
    const items: [K, V][] = [];
    this._inOrderTraversal(function (node, index, map) {
      const item = <[K, V]>[node._key, node._value];
      const flag = callback(item, index, map);
      if (flag) items.push(item);
      return false;
    });
    return new OrderedMap(items, this._cmp);
  }
  some(callback: CallbackFn<[K, V], this, unknown>) {
    return this._inOrderTraversal(function (node, index, map) {
      return callback([node._key!, node._value!], index, map);
    });
  }
  values(): IterableIterator<V> {
    const self = this;
    let node = this._header._left;
    return {
      next() {
        const done = !node || node === self._header;
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
  // @ts-ignore
  eraseElementByIterator(iter: OrderedMapIterator<K, V>): OrderedMapIterator<K, V>;
}

export default OrderedMap;
