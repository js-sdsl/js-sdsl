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
  /**
   * @return Iterator pointing to the beginning element.
   */
  begin() {
    return new OrderedMapIterator(this.header.left || this.header, this.header);
  }
  /**
   * @return Iterator pointing to the super end like c++.
   */
  end() {
    return new OrderedMapIterator(this.header, this.header);
  }
  /**
   * @return Iterator pointing to the end element.
   */
  rBegin() {
    return new OrderedMapIterator(this.header.right || this.header, this.header, 'reverse');
  }
  /**
   * @return Iterator pointing to the super begin like c++.
   */
  rEnd() {
    return new OrderedMapIterator(this.header, this.header, 'reverse');
  }
  /**
   * @return The first element.
   */
  front() {
    if (!this.length) return undefined;
    const minNode = this.header.left as TreeNode<K, V>;
    return [minNode.key, minNode.value] as [K, V];
  }
  /**
   * @return The last element.
   */
  back() {
    if (!this.length) return undefined;
    const maxNode = this.header.right as TreeNode<K, V>;
    return [maxNode.key, maxNode.value] as [K, V];
  }
  /**
   * @param callback callback function, it's first param is an array which type is [key, value].
   */
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
   * Insert a new key-value pair or set value by key.
   */
  setElement(key: K, value: V) {
    this.set(key, value);
  }
  /**
   * @param key The key you want to find.
   * @return Iterator pointing to the element if found, or super end if not found.
   */
  find(key: K) {
    const curNode = this.findElementNode(this.root, key);
    if (curNode !== undefined) {
      return new OrderedMapIterator(curNode, this.header);
    }
    return this.end();
  }
  /**
   * Gets the value of the element of the specified key.
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
   * Union the other Set to self.
   * waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
   * More information => https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations
   */
  union(other: OrderedMap<K, V>) {
    other.forEach(([key, value]) => this.setElement(key, value));
  }
  /**
   * Using for 'for...of' syntax like Array.
   */
  [Symbol.iterator]() {
    return this.iterationFunc(this.root);
  }
}

export default OrderedMap;
