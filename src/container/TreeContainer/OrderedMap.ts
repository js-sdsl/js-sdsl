import { RunTimeError } from '@/utils/error';
import { ContainerIterator, initContainer } from '@/container/ContainerBase/index';
import { checkUndefinedParams, checkWithinAccessParams } from '@/utils/checkParams';
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
    if (this.node.key === undefined) {
      throw new RunTimeError('OrderedMap iterator access denied');
    }
    return new Proxy([this.node.key, this.node.value] as [K, V], {
      get: (_, prop) => {
        const index = Number(prop);
        if (Number.isNaN(index)) {
          throw new TypeError('prop must be number');
        }
        checkWithinAccessParams(index, 0, 1);
        return index === 0 ? this.node.key : this.node.value;
      },
      set: (_, prop, newValue: V) => {
        const index = Number(prop);
        if (Number.isNaN(index)) {
          throw new TypeError('prop must be number');
        }
        checkWithinAccessParams(index, 1, 1);
        this.node.value = newValue;
        return true;
      }
    });
  }
}

class OrderedMap<K, V> extends TreeBaseContainer<K, V> {
  constructor(container: initContainer<[K, V]> = [], cmp?: (x: K, y: K) => number) {
    super(cmp);
    this.iterationFunc = this.iterationFunc.bind(this);
    container.forEach(([key, value]) => this.setElement(key, value));
  }
  private iterationFunc:
  (curNode: TreeNode<K, V> | undefined) => Generator<[K, V], void, undefined> =
      function * (this: OrderedMap<K, V>, curNode: TreeNode<K, V> | undefined) {
        if (!curNode || curNode.key === undefined || curNode.value === undefined) return;
        yield * this.iterationFunc(curNode.leftChild);
        yield [curNode.key, curNode.value];
        yield * this.iterationFunc(curNode.rightChild);
      };
  /**
   * @return Iterator pointing to the begin element.
   */
  begin() {
    return new OrderedMapIterator(this.header.leftChild || this.header, this.header);
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
    return new OrderedMapIterator(this.header.rightChild || this.header, this.header, 'reverse');
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
    if (this.empty()) return undefined;
    const minNode = this.header.leftChild as TreeNode<K, V>;
    return [minNode.key, minNode.value];
  }
  /**
   * @return The last element.
   */
  back() {
    if (this.empty()) return undefined;
    const maxNode = this.header.rightChild as TreeNode<K, V>;
    return [maxNode.key, maxNode.value];
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
    return resNode === undefined ? this.end() : new OrderedMapIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element greater than the given key.
   */
  upperBound(key: K) {
    const resNode = this._upperBound(this.root, key);
    return resNode === undefined ? this.end() : new OrderedMapIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element not greater than the given key.
   */
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this.root, key);
    return resNode === undefined ? this.end() : new OrderedMapIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element less than the given key.
   */
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this.root, key);
    return resNode === undefined ? this.end() : new OrderedMapIterator(resNode, this.header);
  }
  /**
   * Insert a new key-value pair or set value by key.
   */
  setElement(key: K, value: V) {
    checkUndefinedParams(key);

    if (value === null || value === undefined) {
      this.eraseElementByKey(key);
      return;
    }

    if (this.empty()) {
      ++this.length;
      this.root.key = key;
      this.root.value = value;
      this.root.color = TreeNode.TreeNodeColorType.black;
      this.header.leftChild = this.root;
      this.header.rightChild = this.root;
      return;
    }

    const curNode = this.findInsertPos(this.root, key);
    if (curNode.key !== undefined && this.cmp(curNode.key, key) === 0) {
      curNode.value = value;
      return;
    }

    ++this.length;
    curNode.key = key;
    curNode.value = value;

    if (this.header.leftChild === undefined || this.header.leftChild.key === undefined || this.cmp(this.header.leftChild.key, key) > 0) {
      this.header.leftChild = curNode;
    }
    if (this.header.rightChild === undefined || this.header.rightChild.key === undefined || this.cmp(this.header.rightChild.key, key) < 0) {
      this.header.rightChild = curNode;
    }

    this.insertNodeSelfBalance(curNode);
    this.root.color = TreeNode.TreeNodeColorType.black;
  }
  /**
   * @param key The key you want to find.
   * @return Iterator pointing to the element if found, or super end if not found.
   */
  find(key: K) {
    const curNode = this.findElementNode(this.root, key);
    if (curNode !== undefined && curNode.key !== undefined) {
      return new OrderedMapIterator(curNode, this.header);
    }
    return this.end();
  }
  /**
   * Gets the value of the element of the specified key.
   */
  getElementByKey(key: K) {
    const curNode = this.findElementNode(this.root, key);
    if (curNode?.value === undefined) return undefined;
    return curNode.value;
  }
  getElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    let index = 0;
    for (const pair of this) {
      if (index === pos) return pair;
      ++index;
    }
  }
  /**
   * @return An iterator point to the next iterator.
   * Removes element by iterator.
   */
  eraseElementByIterator(iter: ContainerIterator<[K, V], TreeNode<K, V>>) {
    // @ts-ignore
    const node = iter.node;
    iter = iter.next();
    this.eraseNode(node);
    return iter;
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
