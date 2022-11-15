import TreeContainer from './Base';
import TreeIterator from './Base/TreeIterator';
import { TreeNode } from './Base/TreeNode';
import { initContainer, IteratorType } from '@/container/ContainerBase';
import { throwIteratorAccessError } from '@/utils/throwError';

class OrderedMapIterator<K, V> extends TreeIterator<K, V> {
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
    return new OrderedMapIterator(this._node, this._header, this.iteratorType);
  }
  // @ts-ignore
  equals(iter: OrderedMapIterator<K, V>): boolean;
}

export type { OrderedMapIterator };

class OrderedMap<K, V> extends TreeContainer<K, V> {
  /**
   * @param container The initialization container.
   * @param cmp The compare function.
   * @param enableIndex Whether to enable iterator indexing function.
   * @example
   * new OrderedMap();
   * new OrderedMap([[0, 1], [2, 1]]);
   * new OrderedMap([[0, 1], [2, 1]], (x, y) => x - y);
   * new OrderedMap([[0, 1], [2, 1]], (x, y) => x - y, true);
   */
  constructor(
    container: initContainer<[K, V]> = [],
    cmp?: (x: K, y: K) => number,
    enableIndex?: boolean
  ) {
    super(cmp, enableIndex);
    const self = this;
    container.forEach(function (el) {
      self.setElement(el[0], el[1]);
    });
  }
  /**
   * @internal
   */
  private * _iterationFunc(
    curNode: TreeNode<K, V> | undefined
  ): Generator<[K, V], void, undefined> {
    if (curNode === undefined) return;
    yield * this._iterationFunc(curNode._left);
    yield <[K, V]>[curNode._key, curNode._value];
    yield * this._iterationFunc(curNode._right);
  }
  begin() {
    return new OrderedMapIterator(this._header._left || this._header, this._header);
  }
  end() {
    return new OrderedMapIterator(this._header, this._header);
  }
  rBegin() {
    return new OrderedMapIterator(
      this._header._right || this._header,
      this._header,
      IteratorType.REVERSE
    );
  }
  rEnd() {
    return new OrderedMapIterator(this._header, this._header, IteratorType.REVERSE);
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
    return new OrderedMapIterator(resNode, this._header);
  }
  upperBound(key: K) {
    const resNode = this._upperBound(this._root, key);
    return new OrderedMapIterator(resNode, this._header);
  }
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this._root, key);
    return new OrderedMapIterator(resNode, this._header);
  }
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this._root, key);
    return new OrderedMapIterator(resNode, this._header);
  }
  /**
   * @description Insert a key-value pair or set value by the given key.
   * @param key The key want to insert.
   * @param value The value want to set.
   * @param hint You can give an iterator hint to improve insertion efficiency.
   * @example
   * const mp = new OrderedMap([[2, 0], [4, 0], [5, 0]]);
   * const iter = mp.begin();
   * mp.setElement(1, 0);
   * mp.setElement(3, 0, iter);  // give a hint will be faster.
   */
  setElement(key: K, value: V, hint?: OrderedMapIterator<K, V>) {
    this._set(key, value, hint);
  }
  find(key: K) {
    const curNode = this._findElementNode(this._root, key);
    return new OrderedMapIterator(curNode, this._header);
  }
  /**
   * @description Get the value of the element of the specified key.
   * @example const val = container.getElementByKey(1);
   */
  getElementByKey(key: K) {
    const curNode = this._findElementNode(this._root, key);
    return curNode._value;
  }
  union(other: OrderedMap<K, V>) {
    const self = this;
    other.forEach(function (el) {
      self.setElement(el[0], el[1]);
    });
  }
  [Symbol.iterator]() {
    return this._iterationFunc(this._root);
  }
  // @ts-ignore
  eraseElementByIterator(iter: OrderedMapIterator<K, V>): OrderedMapIterator<K, V>;
  // @ts-ignore
  forEach(callback: (element: [K, V], index: number, map: OrderedMap<K, V>) => void): void;
  // @ts-ignore
  getElementByPos(pos: number): [K, V];
}

export default OrderedMap;
