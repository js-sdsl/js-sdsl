import type TreeIterator from './tree-iterator';
import {
  TREE_NODE_COLOR,
  TreeNodeEnableIndex,
  createTreeNode,
  createTreeNodeEnableIndex
} from './tree-node';
import { Container } from '@/base';
import { ITERATOR_TYPE } from '@/base/iterator';
import { CompareFn, compareFromS2L } from '@/utils/compareFn';
import { throwIteratorAccessError } from '@/utils/throwError';

abstract class TreeContainer<K, V> extends Container<K | [K, V]> {
  readonly enableIndex: boolean;
  /**
   * @internal
   */
  protected readonly _cmp: CompareFn<K>;
  /**
   * @internal
   */
  protected _header: TreeNodeEnableIndex<K, V>;
  /**
   * @internal
   */
  protected _root?: TreeNodeEnableIndex<K, V>;
  /**
   * @internal
   */
  protected readonly _createNode: typeof createTreeNodeEnableIndex;
  /**
   * @internal
   */
  protected constructor(options: {
    cmp?: CompareFn<K>,
    enableIndex?: boolean,
  }) {
    super();
    const { cmp = compareFromS2L, enableIndex = false } = options;
    this._cmp = cmp;
    this.enableIndex = enableIndex;
    this._createNode = enableIndex
      ? createTreeNodeEnableIndex
      : (createTreeNode as typeof createTreeNodeEnableIndex);
    this._header = this._createNode();
    this._header._left = this._header._right = this._header;
  }
  /**
   * @internal
   */
  protected _lowerBound(curNode: TreeNodeEnableIndex<K, V> | undefined, key: K) {
    let resNode = this._header;
    while (curNode) {
      const cmpResult = this._cmp(curNode._key!, key);
      if (cmpResult < 0) {
        curNode = curNode._right;
      } else if (cmpResult > 0) {
        resNode = curNode;
        curNode = curNode._left;
      } else return curNode;
    }
    return resNode;
  }
  /**
   * @internal
   */
  protected _upperBound(curNode: TreeNodeEnableIndex<K, V> | undefined, key: K) {
    let resNode = this._header;
    while (curNode) {
      const cmpResult = this._cmp(curNode._key!, key);
      if (cmpResult <= 0) {
        curNode = curNode._right;
      } else {
        resNode = curNode;
        curNode = curNode._left;
      }
    }
    return resNode;
  }
  /**
   * @internal
   */
  protected _reverseLowerBound(curNode: TreeNodeEnableIndex<K, V> | undefined, key: K) {
    let resNode = this._header;
    while (curNode) {
      const cmpResult = this._cmp(curNode._key!, key);
      if (cmpResult < 0) {
        resNode = curNode;
        curNode = curNode._right;
      } else if (cmpResult > 0) {
        curNode = curNode._left;
      } else return curNode;
    }
    return resNode;
  }
  /**
   * @internal
   */
  protected _reverseUpperBound(curNode: TreeNodeEnableIndex<K, V> | undefined, key: K) {
    let resNode = this._header;
    while (curNode) {
      const cmpResult = this._cmp(curNode._key!, key);
      if (cmpResult < 0) {
        resNode = curNode;
        curNode = curNode._right;
      } else {
        curNode = curNode._left;
      }
    }
    return resNode;
  }
  /**
   * @internal
   */
  protected _eraseNodeSelfBalance(curNode: TreeNodeEnableIndex<K, V>) {
    while (true) {
      const parentNode = curNode._parent!;
      if (parentNode === this._header) return;
      if (curNode._color === TREE_NODE_COLOR.RED) {
        curNode._color = TREE_NODE_COLOR.BLACK;
        return;
      }
      if (curNode === parentNode._left) {
        const brother = parentNode._right!;
        if (brother._color === TREE_NODE_COLOR.RED) {
          brother._color = TREE_NODE_COLOR.BLACK;
          parentNode._color = TREE_NODE_COLOR.RED;
          if (parentNode === this._root) {
            this._root = parentNode._rotateLeft();
          } else parentNode._rotateLeft();
        } else {
          if (brother._right && brother._right._color === TREE_NODE_COLOR.RED) {
            brother._color = parentNode._color;
            parentNode._color = TREE_NODE_COLOR.BLACK;
            brother._right._color = TREE_NODE_COLOR.BLACK;
            if (parentNode === this._root) {
              this._root = parentNode._rotateLeft();
            } else parentNode._rotateLeft();
            return;
          } else if (brother._left && brother._left._color === TREE_NODE_COLOR.RED) {
            brother._color = TREE_NODE_COLOR.RED;
            brother._left._color = TREE_NODE_COLOR.BLACK;
            brother._rotateRight();
          } else {
            brother._color = TREE_NODE_COLOR.RED;
            curNode = parentNode;
          }
        }
      } else {
        const brother = parentNode._left!;
        if (brother._color === TREE_NODE_COLOR.RED) {
          brother._color = TREE_NODE_COLOR.BLACK;
          parentNode._color = TREE_NODE_COLOR.RED;
          if (parentNode === this._root) {
            this._root = parentNode._rotateRight();
          } else parentNode._rotateRight();
        } else {
          if (brother._left && brother._left._color === TREE_NODE_COLOR.RED) {
            brother._color = parentNode._color;
            parentNode._color = TREE_NODE_COLOR.BLACK;
            brother._left._color = TREE_NODE_COLOR.BLACK;
            if (parentNode === this._root) {
              this._root = parentNode._rotateRight();
            } else parentNode._rotateRight();
            return;
          } else if (brother._right && brother._right._color === TREE_NODE_COLOR.RED) {
            brother._color = TREE_NODE_COLOR.RED;
            brother._right._color = TREE_NODE_COLOR.BLACK;
            brother._rotateLeft();
          } else {
            brother._color = TREE_NODE_COLOR.RED;
            curNode = parentNode;
          }
        }
      }
    }
  }
  /**
   * @internal
   */
  protected _eraseNode(curNode: TreeNodeEnableIndex<K, V>) {
    if (this._length === 1) {
      this.clear();
      return;
    }
    let swapNode = curNode;
    while (swapNode._left || swapNode._right) {
      if (swapNode._right) {
        swapNode = swapNode._right;
        while (swapNode._left) swapNode = swapNode._left;
      } else {
        swapNode = swapNode._left!;
      }
      const key = curNode._key;
      curNode._key = swapNode._key;
      swapNode._key = key;
      const value = curNode._value;
      curNode._value = swapNode._value;
      swapNode._value = value;
      curNode = swapNode;
    }
    if (this._header._left === swapNode) {
      this._header._left = swapNode._parent;
    } else if (this._header._right === swapNode) {
      this._header._right = swapNode._parent;
    }
    this._eraseNodeSelfBalance(swapNode);
    let _parent = swapNode._parent!;
    if (swapNode === _parent._left) {
      _parent._left = undefined;
    } else _parent._right = undefined;
    this._length -= 1;
    this._root!._color = TREE_NODE_COLOR.BLACK;
    if (this.enableIndex) {
      while (_parent !== this._header) {
        _parent._subTreeSize -= 1;
        _parent = _parent._parent!;
      }
    }
  }
  protected _inOrderTraversal(): TreeNodeEnableIndex<K, V>[];
  protected _inOrderTraversal(index: number): TreeNodeEnableIndex<K, V>;
  protected _inOrderTraversal(
    callback: (value: TreeNodeEnableIndex<K, V>, index: number, container: this) => unknown
  ): boolean;
  /**
   * @internal
   */
  protected _inOrderTraversal(
    param?: number | ((value: TreeNodeEnableIndex<K, V>, index: number, container: this) => unknown)
  ) {
    const pos = typeof param === 'number' ? param : undefined;
    const callback = typeof param === 'function' ? param : undefined;
    const nodeList = typeof param === 'undefined' ? <TreeNodeEnableIndex<K, V>[]>[] : undefined;
    let index = 0;
    let curNode = this._root;
    const stack: TreeNodeEnableIndex<K, V>[] = [];
    while (stack.length || curNode) {
      if (curNode) {
        stack.push(curNode);
        curNode = curNode._left;
      } else {
        curNode = stack.pop()!;
        if (index === pos) return curNode;
        nodeList && nodeList.push(curNode);
        if (callback && callback(curNode, index, this)) return true;
        index += 1;
        curNode = curNode._right;
      }
    }
    return callback ? false : nodeList;
  }
  /**
   * @internal
   */
  protected _insertNodeSelfBalance(curNode: TreeNodeEnableIndex<K, V>) {
    while (true) {
      const parentNode = curNode._parent!;
      if (parentNode._color === TREE_NODE_COLOR.BLACK) return;
      const grandParent = parentNode._parent!;
      if (parentNode === grandParent._left) {
        const uncle = grandParent._right;
        if (uncle && uncle._color === TREE_NODE_COLOR.RED) {
          uncle._color = parentNode._color = TREE_NODE_COLOR.BLACK;
          if (grandParent === this._root) return;
          grandParent._color = TREE_NODE_COLOR.RED;
          curNode = grandParent;
          continue;
        } else if (curNode === parentNode._right) {
          curNode._color = TREE_NODE_COLOR.BLACK;
          if (curNode._left) {
            curNode._left._parent = parentNode;
          }
          if (curNode._right) {
            curNode._right._parent = grandParent;
          }
          parentNode._right = curNode._left;
          grandParent._left = curNode._right;
          curNode._left = parentNode;
          curNode._right = grandParent;
          if (grandParent === this._root) {
            this._root = curNode;
            this._header._parent = curNode;
          } else {
            const GP = grandParent._parent!;
            if (GP._left === grandParent) {
              GP._left = curNode;
            } else GP._right = curNode;
          }
          curNode._parent = grandParent._parent;
          parentNode._parent = curNode;
          grandParent._parent = curNode;
          grandParent._color = TREE_NODE_COLOR.RED;
        } else {
          parentNode._color = TREE_NODE_COLOR.BLACK;
          if (grandParent === this._root) {
            this._root = grandParent._rotateRight();
          } else grandParent._rotateRight();
          grandParent._color = TREE_NODE_COLOR.RED;
          return;
        }
      } else {
        const uncle = grandParent._left;
        if (uncle && uncle._color === TREE_NODE_COLOR.RED) {
          uncle._color = parentNode._color = TREE_NODE_COLOR.BLACK;
          if (grandParent === this._root) return;
          grandParent._color = TREE_NODE_COLOR.RED;
          curNode = grandParent;
          continue;
        } else if (curNode === parentNode._left) {
          curNode._color = TREE_NODE_COLOR.BLACK;
          if (curNode._left) {
            curNode._left._parent = grandParent;
          }
          if (curNode._right) {
            curNode._right._parent = parentNode;
          }
          grandParent._right = curNode._left;
          parentNode._left = curNode._right;
          curNode._left = grandParent;
          curNode._right = parentNode;
          if (grandParent === this._root) {
            this._root = curNode;
            this._header._parent = curNode;
          } else {
            const GP = grandParent._parent!;
            if (GP._left === grandParent) {
              GP._left = curNode;
            } else GP._right = curNode;
          }
          curNode._parent = grandParent._parent;
          parentNode._parent = curNode;
          grandParent._parent = curNode;
          grandParent._color = TREE_NODE_COLOR.RED;
        } else {
          parentNode._color = TREE_NODE_COLOR.BLACK;
          if (grandParent === this._root) {
            this._root = grandParent._rotateLeft();
          } else grandParent._rotateLeft();
          grandParent._color = TREE_NODE_COLOR.RED;
          return;
        }
      }
      // According to the characteristics of the red-black tree
      // when a node is added, it will rotate up at most three times
      // so `recount` will be run at most nine times
      // that's acceptable
      if (this.enableIndex) {
        parentNode._recount();
        grandParent._recount();
        curNode._recount();
      }
      return;
    }
  }
  /**
   * @internal
   */
  protected _set(key: K, value: V, hint?: TreeIterator<K, V>) {
    if (this._root === undefined) {
      this._length += 1;
      this._root = this._createNode({
        key,
        value,
        color: TREE_NODE_COLOR.BLACK
      });
      this._root._parent = this._header;
      this._header._parent = this._header._left = this._header._right = this._root;
      return this._length;
    }
    let curNode;
    const minNode = this._header._left!;
    const compareToMin = this._cmp(minNode._key!, key);
    if (compareToMin === 0) {
      minNode._value = value;
      return this._length;
    } else if (compareToMin > 0) {
      minNode._left = this._createNode({
        key,
        value
      });
      minNode._left._parent = minNode;
      curNode = minNode._left;
      this._header._left = curNode;
    } else {
      const maxNode = this._header._right!;
      const compareToMax = this._cmp(maxNode._key!, key);
      if (compareToMax === 0) {
        maxNode._value = value;
        return this._length;
      } else if (compareToMax < 0) {
        maxNode._right = this._createNode({
          key,
          value
        });
        maxNode._right._parent = maxNode;
        curNode = maxNode._right;
        this._header._right = curNode;
      } else {
        if (hint !== undefined) {
          const iterNode = hint._node;
          if (iterNode !== this._header) {
            const iterCmpRes = this._cmp(iterNode._key!, key);
            if (iterCmpRes === 0) {
              iterNode._value = value;
              return this._length;
            } else /* istanbul ignore else */ if (iterCmpRes > 0) {
              const prevNode = iterNode._prev();
              const preCmpRes = this._cmp(prevNode._key!, key);
              if (preCmpRes === 0) {
                prevNode._value = value;
                return this._length;
              } else if (preCmpRes < 0) {
                curNode = this._createNode({
                  key,
                  value
                });
                if (prevNode._right === undefined) {
                  prevNode._right = curNode;
                  curNode._parent = prevNode;
                } else {
                  iterNode._left = curNode;
                  curNode._parent = iterNode;
                }
              }
            }
          }
        }
        if (curNode === undefined) {
          curNode = this._root;
          while (true) {
            const cmpResult = this._cmp(curNode._key!, key);
            if (cmpResult > 0) {
              if (curNode._left === undefined) {
                curNode._left = this._createNode({
                  key,
                  value
                });
                curNode._left._parent = curNode;
                curNode = curNode._left;
                break;
              }
              curNode = curNode._left;
            } else if (cmpResult < 0) {
              if (curNode._right === undefined) {
                curNode._right = this._createNode({
                  key,
                  value
                });
                curNode._right._parent = curNode;
                curNode = curNode._right;
                break;
              }
              curNode = curNode._right;
            } else {
              curNode._value = value;
              return this._length;
            }
          }
        }
      }
    }
    if (this.enableIndex) {
      let parent = curNode._parent!;
      while (parent !== this._header) {
        parent._subTreeSize += 1;
        parent = parent._parent!;
      }
    }
    this._insertNodeSelfBalance(curNode);
    this._length += 1;
  }
  /**
   * @internal
   */
  protected _getTreeNodeByKey(curNode: TreeNodeEnableIndex<K, V> | undefined, key: K) {
    while (curNode) {
      const cmpResult = this._cmp(curNode._key!, key);
      if (cmpResult < 0) {
        curNode = curNode._right;
      } else if (cmpResult > 0) {
        curNode = curNode._left;
      } else return curNode;
    }
    return curNode || this._header;
  }
  clear() {
    this._length = 0;
    this._root = undefined;
    this._header._parent = undefined;
    this._header._left = this._header._right = this._header;
  }
  /**
   * @description Update node's key by iterator.
   * @param iter - The iterator you want to change.
   * @param key - The key you want to update.
   * @returns Whether the modification is successful.
   * @example
   * const st = new orderedSet([1, 2, 5]);
   * const iter = st.find(2);
   * st.update(iter, 3); // then st will become [1, 3, 5]
   */
  update(iter: TreeIterator<K, V>, key: K): boolean {
    const node = iter._node;
    if (node === this._header) {
      throwIteratorAccessError();
    }
    if (this._length === 1) {
      node._key = key;
      return true;
    }
    const nextKey = node._next()._key!;
    if (node === this._header._left) {
      if (this._cmp(nextKey, key) > 0) {
        node._key = key;
        return true;
      }
      return false;
    }
    const preKey = node._prev()._key!;
    if (node === this._header._right) {
      if (this._cmp(preKey, key) < 0) {
        node._key = key;
        return true;
      }
      return false;
    }
    if (
      this._cmp(preKey, key) >= 0 ||
      this._cmp(nextKey, key) <= 0
    ) return false;
    node._key = key;
    return true;
  }
  /**
   * @description Remove the item of the specified key.
   * @param key - The key you want to remove.
   * @returns Whether erase successfully.
   */
  delete(key: K) {
    if (this._length === 0) return false;
    const curNode = this._getTreeNodeByKey(this._root, key);
    if (curNode === this._header) return false;
    this._eraseNode(curNode);
    return true;
  }
  erase(param: number): number;
  erase(param: TreeIterator<K, V>): TreeIterator<K, V>;
  erase(param: TreeIterator<K, V> | number) {
    if (typeof param === 'number') {
      // istanbul ignore else
      if (param >= 0 && param < this._length) {
        const node = this._inOrderTraversal(param);
        this._eraseNode(node);
      }
      return this._length;
    }
    const node = param._node;
    if (node === this._header) {
      throwIteratorAccessError();
    }
    const hasNoRight = node._right === undefined;
    const isNormal = param.type === ITERATOR_TYPE.NORMAL;
    // For the normal iterator, the `next` node will be swapped to `this` node when has right.
    if (isNormal) {
      // So we should move it to next when it's right is null.
      if (hasNoRight) param.next();
    } else {
      // For the reverse iterator, only when it doesn't have right and has left the `next` node will be swapped.
      // So when it has right, or it is a leaf node we should move it to `next`.
      if (!hasNoRight || node._left === undefined) param.next();
    }
    this._eraseNode(node);
    return param;
  }
  /**
   * @description Get the height of the tree.
   * @returns Number about the height of the RB-tree.
   */
  getHeight() {
    if (this._length === 0) return 0;
    function traversal(curNode?: TreeNodeEnableIndex<K, V>): number {
      if (!curNode) return 0;
      return Math.max(traversal(curNode._left), traversal(curNode._right)) + 1;
    }
    return traversal(this._root);
  }
  keys(): IterableIterator<K> {
    const self = this;
    let node = this._header._left;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            done,
            value: undefined as unknown as K
          };
        }
        const value = node!._key!;
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
  has(key: K) {
    const curNode = this._getTreeNodeByKey(this._root, key);
    return curNode !== this._header;
  }
  /**
   * @param key - The given key you want to compare.
   * @returns An iterator to the first item less than the given key.
   */
  abstract reverseUpperBound(key: K): TreeIterator<K, V>;
  /**
   * @description Union the other tree to self.
   * @param other - The other tree container you want to merge.
   * @returns The size of the tree after union.
   */
  abstract union(other: TreeContainer<K, V>): number;
  /**
   * @param key - The given key you want to compare.
   * @returns An iterator to the first item not greater than the given key.
   */
  abstract reverseLowerBound(key: K): TreeIterator<K, V>;
  /**
   * @param key - The given key you want to compare.
   * @returns An iterator to the first item not less than the given key.
   */
  abstract lowerBound(key: K): TreeIterator<K, V>;
  /**
   * @param key - The given key you want to compare.
   * @returns An iterator to the first item greater than the given key.
   */
  abstract upperBound(key: K): TreeIterator<K, V>;
  abstract filter(
    callback: (value: [K, V] | K, index: number, container: this) => unknown
  ): TreeContainer<K, V>;
}

export default TreeContainer;
