import TreeContainer from './Base';
import { TreeNode } from './Base/TreeNode';
import TreeIterator from './Base/TreeIterator';
import { $checkWithinAccessParams } from '@/utils/checkParams.macro';
import { initContainer, IteratorType } from '@/container/ContainerBase';

export class OrderedMapIterator<K, V> extends TreeIterator<K, V> {
  get pointer() {
    if (this._node === this._header) {
      throw new RangeError('OrderedMap iterator access denied');
    }
    return new Proxy([] as unknown as [K, V], {
      get: (_, props: '0' | '1') => {
        if (props === '0') return this._node._key;
        else if (props === '1') return this._node._value;
      },
      set: (_, props: '1', newValue: V) => {
        if (props !== '1') {
          throw new TypeError('props must be 1');
        }
        this._node._value = newValue;
        return true;
      }
    });
  }
  copy() {
    return new OrderedMapIterator(this._node, this._header, this.iteratorType);
  }
}

class OrderedMap<K, V> extends TreeContainer<K, V> {
  /**
   * @param container The initialization container.
   * @param cmp The compare function.
   * @param enableIndex Whether to enable iterator indexing function.
   */
  constructor(
    container: initContainer<[K, V]> = [],
    cmp?: (x: K, y: K) => number,
    enableIndex?: boolean
  ) {
    super(cmp, enableIndex);
    container.forEach(([_key, _value]) => this.setElement(_key, _value));
  }
  /**
   * @internal
   */
  private readonly _iterationFunc:
  (curNode: TreeNode<K, V> | undefined) => Generator<[K, V], void, undefined> =
      function * (this: OrderedMap<K, V>, curNode: TreeNode<K, V> | undefined) {
        if (curNode === undefined) return;
        yield * this._iterationFunc(curNode._left);
        yield [curNode._key, curNode._value] as [K, V];
        yield * this._iterationFunc(curNode._right);
      };
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
    if (!this._length) return undefined;
    const minNode = this._header._left as TreeNode<K, V>;
    return [minNode._key, minNode._value] as [K, V];
  }
  back() {
    if (!this._length) return undefined;
    const maxNode = this._header._right as TreeNode<K, V>;
    return [maxNode._key, maxNode._value] as [K, V];
  }
  forEach(callback: (element: [K, V], index: number) => void) {
    let index = 0;
    for (const pair of this) callback(pair, index++);
  }
  lowerBound(_key: K) {
    const resNode = this._lowerBound(this._root, _key);
    return new OrderedMapIterator(resNode, this._header);
  }
  upperBound(_key: K) {
    const resNode = this._upperBound(this._root, _key);
    return new OrderedMapIterator(resNode, this._header);
  }
  reverseLowerBound(_key: K) {
    const resNode = this._reverseLowerBound(this._root, _key);
    return new OrderedMapIterator(resNode, this._header);
  }
  reverseUpperBound(_key: K) {
    const resNode = this._reverseUpperBound(this._root, _key);
    return new OrderedMapIterator(resNode, this._header);
  }
  /**
   * @description Insert a _key-_value pair or set _value by the given _key.
   * @param _key The _key want to insert.
   * @param _value The _value want to set.
   * @param hint You can give an iterator hint to improve insertion efficiency.
   */
  setElement(_key: K, _value: V, hint?: OrderedMapIterator<K, V>) {
    this._set(_key, _value, hint);
  }
  find(_key: K) {
    const curNode = this._findElementNode(this._root, _key);
    if (curNode !== undefined) {
      return new OrderedMapIterator(curNode, this._header);
    }
    return this.end();
  }
  /**
   * @description Get the _value of the element of the specified _key.
   */
  getElementByKey(_key: K) {
    const curNode = this._findElementNode(this._root, _key);
    return curNode ? curNode._value : undefined;
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let res;
    let index = 0;
    for (const pair of this) {
      if (index === pos) {
        res = pair;
        break;
      }
      index += 1;
    }
    return res as [K, V];
  }
  union(other: OrderedMap<K, V>) {
    other.forEach(([_key, _value]) => this.setElement(_key, _value));
  }
  [Symbol.iterator]() {
    return this._iterationFunc(this._root);
  }
}

export default OrderedMap;
