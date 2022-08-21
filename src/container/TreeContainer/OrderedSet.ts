import TreeBaseContainer from './Base/TreeBaseContainer';
import { initContainer } from '@/container/ContainerBase/index';
import { checkWithinAccessParams } from '@/utils/checkParams';
import TreeIterator from './Base/TreeIterator';
import TreeNode from './Base/TreeNode';

export class OrderedSetIterator<K> extends TreeIterator<K, undefined> {
  constructor(
    node: TreeNode<K, undefined>,
    header: TreeNode<K, undefined>,
    iteratorType: 'normal' | 'reverse' = 'normal'
  ) {
    super(node, header, iteratorType);
  }
  get pointer() {
    if (this.node === this.header) {
      throw new RangeError('OrderedSet iterator access denied!');
    }
    return this.node.key as K;
  }
}

class OrderedSet<K> extends TreeBaseContainer<K, undefined> {
  constructor(container: initContainer<K> = [], cmp?: (x: K, y: K) => number) {
    super(cmp);
    container.forEach((element) => this.insert(element));
    this.iterationFunc = this.iterationFunc.bind(this);
  }
  private readonly iterationFunc:
  (curNode: TreeNode<K, undefined> | undefined) => Generator<K, void, undefined> =
      function * (this: OrderedSet<K>, curNode: TreeNode<K, undefined> | undefined) {
        if (curNode === undefined) return;
        yield * this.iterationFunc(curNode.left);
        yield curNode.key as K;
        yield * this.iterationFunc(curNode.right);
      };
  begin() {
    return new OrderedSetIterator(
      this.header.left || this.header,
      this.header
    );
  }
  end() {
    return new OrderedSetIterator(this.header, this.header);
  }
  rBegin() {
    return new OrderedSetIterator(
      this.header.right || this.header,
      this.header,
      'reverse'
    );
  }
  rEnd() {
    return new OrderedSetIterator(this.header, this.header, 'reverse');
  }
  front() {
    return this.header.left ? this.header.left.key : undefined;
  }
  back() {
    return this.header.right ? this.header.right.key : undefined;
  }
  forEach(callback: (element: K, index: number) => void) {
    let index = 0;
    for (const element of this) callback(element, index++);
  }
  getElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    let res;
    let index = 0;
    for (const element of this) {
      if (index === pos) {
        res = element;
      }
      index += 1;
    }
    return res as K;
  }
  /**
   * Inserts element to Set.
   */
  insert(key: K) {
    this.set(key);
  }
  find(element: K) {
    const curNode = this.findElementNode(this.root, element);
    if (curNode !== undefined) {
      return new OrderedSetIterator(curNode, this.header);
    }
    return this.end();
  }
  /**
   * @return An iterator to the first element not less than the given key.
   */
  lowerBound(key: K) {
    const resNode = this._lowerBound(this.root, key);
    return new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element greater than the given key.
   */
  upperBound(key: K) {
    const resNode = this._upperBound(this.root, key);
    return new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element not greater than the given key.
   */
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this.root, key);
    return new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element less than the given key.
   */
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this.root, key);
    return new OrderedSetIterator(resNode, this.header);
  }
  /**
   * Union the other Set to self.
   * Waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
   * More information => https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations
   */
  union(other: OrderedSet<K>) {
    other.forEach((element) => this.insert(element));
  }
  [Symbol.iterator]() {
    return this.iterationFunc(this.root);
  }
}

export default OrderedSet;
