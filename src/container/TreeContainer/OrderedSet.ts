import TreeBaseContainer from './Base/TreeBaseContainer';
import { ContainerIterator, initContainer } from '@/container/ContainerBase/index';
import { checkUndefinedParams, checkWithinAccessParams } from '@/utils/checkParams';
import { RunTimeError } from '@/utils/error';
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
    if (this.node.key === undefined) {
      throw new RunTimeError('Tree iterator access denied!');
    }
    return this.node.key;
  }
}

class OrderedSet<K> extends TreeBaseContainer<K, undefined> {
  constructor(container: initContainer<K> = [], cmp?: (x: K, y: K) => number) {
    super(cmp);
    container.forEach((element) => this.insert(element));
    this.iterationFunc = this.iterationFunc.bind(this);
  }
  private iterationFunc:
  (curNode: TreeNode<K, undefined> | undefined) => Generator<K, void, undefined> =
      function * (this: OrderedSet<K>, curNode: TreeNode<K, undefined> | undefined) {
        if (!curNode || curNode.key === undefined) return;
        yield * this.iterationFunc(curNode.leftChild);
        yield curNode.key;
        yield * this.iterationFunc(curNode.rightChild);
      };
  begin() {
    return new OrderedSetIterator(
      this.header.leftChild || this.header,
      this.header
    );
  }
  end() {
    return new OrderedSetIterator(this.header, this.header);
  }
  rBegin() {
    return new OrderedSetIterator(
      this.header.rightChild || this.header,
      this.header,
      'reverse'
    );
  }
  rEnd() {
    return new OrderedSetIterator(this.header, this.header, 'reverse');
  }
  front() {
    return this.header.leftChild?.key;
  }
  back() {
    return this.header.rightChild?.key;
  }
  forEach(callback: (element: K, index: number) => void) {
    let index = 0;
    for (const element of this) callback(element, index++);
  }
  getElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    let index = 0;
    for (const element of this) {
      if (index === pos) return element;
      ++index;
    }
  }
  eraseElementByIterator(iter: ContainerIterator<K, TreeNode<K, undefined>>) {
    // @ts-ignore
    const node = iter.node;
    iter = iter.next();
    this.eraseNode(node);
    return iter;
  }
  /**
   * Inserts element to Set.
   */
  insert(element: K) {
    checkUndefinedParams(element);

    if (this.empty()) {
      ++this.length;
      this.root.key = element;
      this.root.color = TreeNode.TreeNodeColorType.black;
      this.header.leftChild = this.root;
      this.header.rightChild = this.root;
      return;
    }

    const curNode = this.findInsertPos(this.root, element);
    if (curNode.key !== undefined && this.cmp(curNode.key, element) === 0) {
      return;
    }

    ++this.length;
    curNode.key = element;

    if (
      this.header.leftChild === undefined ||
      this.header.leftChild.key === undefined ||
      this.cmp(this.header.leftChild.key, element) > 0
    ) {
      this.header.leftChild = curNode;
    }
    if (
      this.header.rightChild === undefined ||
      this.header.rightChild.key === undefined ||
      this.cmp(this.header.rightChild.key, element) < 0
    ) {
      this.header.rightChild = curNode;
    }

    this.insertNodeSelfBalance(curNode);
    this.root.color = TreeNode.TreeNodeColorType.black;
  }
  find(element: K) {
    const curNode = this.findElementNode(this.root, element);
    if (curNode !== undefined && curNode.key !== undefined) {
      return new OrderedSetIterator(curNode, this.header);
    }
    return this.end();
  }
  /**
   * @return An iterator to the first element not less than the given key.
   */
  lowerBound(key: K) {
    const resNode = this._lowerBound(this.root, key);
    return resNode === undefined
      ? this.end()
      : new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element greater than the given key.
   */
  upperBound(key: K) {
    const resNode = this._upperBound(this.root, key);
    return resNode === undefined
      ? this.end()
      : new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element not greater than the given key.
   */
  reverseLowerBound(key: K) {
    const resNode = this._reverseLowerBound(this.root, key);
    return resNode === undefined
      ? this.end()
      : new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element less than the given key.
   */
  reverseUpperBound(key: K) {
    const resNode = this._reverseUpperBound(this.root, key);
    return resNode === undefined
      ? this.end()
      : new OrderedSetIterator(resNode, this.header);
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
