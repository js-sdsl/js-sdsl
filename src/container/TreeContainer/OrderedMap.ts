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
        if (props === '0') return this._node.key;
        else if (props === '1') return this._node.value;
      },
      set: (_, props: '1', newValue: V) => {
        if (props !== '1') {
          throw new TypeError('props must be 1');
        }
        this._node.value = newValue;
        return true;
      }
    });
  }
  copy() {
    return new OrderedMapIterator(this._node, this._header, this.iteratorType);
  }
}

class OrderedMap<K, V> extends TreeContainer<K, V> {
  constructor(
    container: initContainer<[K, V]> = [],
    cmp?: (x: K, y: K) => number,
    enableIndex?: boolean
  ) {
    super(cmp, enableIndex);
    container.forEach(([key, value]) => this.setElement(key, value));
  }
  /**
   * @internal
   */
  private readonly _iterationFunc:
  (curNode: TreeNode<K, V> | undefined) => Generator<[K, V], void, undefined> =
      function * (this: OrderedMap<K, V>, curNode: TreeNode<K, V> | undefined) {
        if (curNode === undefined) return;
        yield * this._iterationFunc(curNode.left);
        yield [curNode.key, curNode.value] as [K, V];
        yield * this._iterationFunc(curNode.right);
      };
  begin() {
    return new OrderedMapIterator(this._header.left || this._header, this._header);
  }
  end() {
    return new OrderedMapIterator(this._header, this._header);
  }
  rBegin() {
    return new OrderedMapIterator(
      this._header.right || this._header,
      this._header,
      IteratorType.REVERSE
    );
  }
  rEnd() {
    return new OrderedMapIterator(this._header, this._header, IteratorType.REVERSE);
  }
  front() {
    if (!this._length) return undefined;
    const minNode = this._header.left as TreeNode<K, V>;
    return [minNode.key, minNode.value] as [K, V];
  }
  back() {
    if (!this._length) return undefined;
    const maxNode = this._header.right as TreeNode<K, V>;
    return [maxNode.key, maxNode.value] as [K, V];
  }
  forEach(callback: (element: [K, V], index: number) => void) {
    let index = 0;
    for (const pair of this) callback(pair, index++);
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
   */
  setElement(key: K, value: V, hint?: OrderedMapIterator<K, V>) {
    this._set(key, value, hint);
  }
  find(key: K) {
    const curNode = this._findElementNode(this._root, key);
    if (curNode !== undefined) {
      return new OrderedMapIterator(curNode, this._header);
    }
    return this.end();
  }
  /**
   * @description Get the value of the element of the specified key.
   */
  getElementByKey(key: K) {
    const curNode = this._findElementNode(this._root, key);
    return curNode ? curNode.value : undefined;
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
    other.forEach(([key, value]) => this.setElement(key, value));
  }
  [Symbol.iterator]() {
    return this._iterationFunc(this._root);
  }
}

export default OrderedMap;
