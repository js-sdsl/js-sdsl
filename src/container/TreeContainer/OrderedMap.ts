import { initContainer } from '@/container/ContainerBase/index';
import { checkWithinAccessParams } from '@/utils/checkParams';
import TreeBaseContainer from './Base/TreeBaseContainer';
import TreeIterator from './Base/TreeIterator';
import TreeNode from './Base/TreeNode';

export class OrderedMapIterator<K, V> extends TreeIterator<K, V> {
  constructor(
    node: TreeNode<K, V>,
    header: TreeNode<K, V>,
    iteratorType: 'normal' | 'reverse' = 'normal'
  ) {
    super(node, header, iteratorType);
  }
  get pointer() {
    if (this.node === this.header) {
      throw new RangeError('OrderedMap iterator access denied');
    }
    return Object.defineProperties({}, {
      0: {
        get: () => {
          return this.node.key;
        }
      },
      1: {
        get: () => {
          return this.node.value;
        },
        set: (newValue: V) => {
          this.node.value = newValue;
        }
      }
    }) as [K, V];
  }
  copy() {
    return new OrderedMapIterator(this.node, this.header, this.iteratorType);
  }
}

class OrderedMap<K, V> extends TreeBaseContainer<K, V> {
  constructor(container: initContainer<[K, V]> = [], cmp?: (x: K, y: K) => number) {
    super(cmp);
    this.iterationFunc = this.iterationFunc.bind(this);
    container.forEach(([key, value]) => this.setElement(key, value));
  }
  private readonly iterationFunc:
  (curNode: TreeNode<K, V> | undefined) => Generator<[K, V], void, undefined> =
      function * (this: OrderedMap<K, V>, curNode: TreeNode<K, V> | undefined) {
        if (curNode === undefined) return;
        yield * this.iterationFunc(curNode.left);
        yield [curNode.key, curNode.value] as [K, V];
        yield * this.iterationFunc(curNode.right);
      };
  begin() {
    return new OrderedMapIterator(this.header.left || this.header, this.header);
  }
  end() {
    return new OrderedMapIterator(this.header, this.header);
  }
  rBegin() {
    return new OrderedMapIterator(this.header.right || this.header, this.header, 'reverse');
  }
  rEnd() {
    return new OrderedMapIterator(this.header, this.header, 'reverse');
  }
  front() {
    if (!this.length) return undefined;
    const minNode = this.header.left as TreeNode<K, V>;
    return [minNode.key, minNode.value] as [K, V];
  }
  back() {
    if (!this.length) return undefined;
    const maxNode = this.header.right as TreeNode<K, V>;
    return [maxNode.key, maxNode.value] as [K, V];
  }
  forEach(callback: (element: [K, V], index: number) => void) {
    let index = 0;
    for (const pair of this) callback(pair, index++);
  }
  /**
   * @return An iterator to the first element not less than the given key.
   */
  lowerBound(key: K) {
    const resNode = this._lowerBound(this.root, key);
    return new OrderedMapIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element greater than the given key.
   */
  upperBound(key: K) {
    const resNode = this._upperBound(this.root, key);
    return new OrderedMapIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element not greater than the given key.
   */
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this.root, key);
    return new OrderedMapIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element less than the given key.
   */
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this.root, key);
    return new OrderedMapIterator(resNode, this.header);
  }
  /**
   * @description Insert a key-value pair or set value by the given key.
   * @param key The key want to insert.
   * @param value The value want to set.
   * @param hint You can give an iterator hint to improve insertion efficiency.
   */
  setElement(key: K, value: V, hint?: OrderedMapIterator<K, V>) {
    this.set(key, value, hint);
  }
  find(key: K) {
    const curNode = this.findElementNode(this.root, key);
    if (curNode !== undefined) {
      return new OrderedMapIterator(curNode, this.header);
    }
    return this.end();
  }
  /**
   * @description Get the value of the element of the specified key.
   */
  getElementByKey(key: K) {
    const curNode = this.findElementNode(this.root, key);
    return curNode ? curNode.value : undefined;
  }
  getElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
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
  /**
   * @description Union the other Set to self.
   *              <br/>
   *              Waiting for optimization, this is O(mlog(n+m)) algorithm now,
   *              but we expect it to be O(mlog(n/m+1)).<br/>
   *              More information =>
   *              https://en.wikipedia.org/wiki/Red_black_tree
   *              <br/>
   * @param other The other set you want to merge.
   */
  union(other: OrderedMap<K, V>) {
    other.forEach(([key, value]) => this.setElement(key, value));
  }
  [Symbol.iterator]() {
    return this.iterationFunc(this.root);
  }
}

export default OrderedMap;
