import type TreeIterator from './TreeIterator';
import { Container } from '@/container/ContainerBase';
import { $checkWithinAccessParams } from '@/utils/checkParams.macro';
import { TreeNode, TreeNodeColor, TreeNodeEnableIndex } from './TreeNode';

abstract class TreeContainer<K, V> extends Container<K | [K, V]> {
  /**
   * @internal
   */
  protected _root: TreeNode<K, V> | undefined = undefined;
  /**
   * @internal
   */
  protected _header: TreeNode<K, V>;
  /**
   * @internal
   */
  private readonly _cmp: (x: K, y: K) => number;
  /**
   * @internal
   */
  private readonly _TreeNodeClass: typeof TreeNode | typeof TreeNodeEnableIndex;
  /**
   * @description Remove a node.
   * @param curNode The node you want to remove.
   * @internal
   */
  private readonly _eraseNode: (curNode: TreeNode<K, V>) => void;
  /**
   * @description Insert a key-value pair or set value by the given key.
   * @param key The key want to insert.
   * @param value The value want to set.
   * @param hint You can give an iterator hint to improve insertion efficiency.
   * @internal
   */
  protected _set: (key: K, value: V, hint?: TreeIterator<K, V>) => void;
  /**
   * @param cmp The compare function.
   * @param enableIndex Whether to enable iterator indexing function.
   */
  protected constructor(
    cmp: (x: K, y: K) => number =
    (x: K, y: K) => {
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    },
    enableIndex = false
  ) {
    super();
    this._cmp = cmp;
    if (enableIndex) {
      this._TreeNodeClass = TreeNodeEnableIndex;
      this._set = function (key, value, hint) {
        const curNode = this._preSet(key, value, hint);
        if (curNode) {
          let p = curNode._parent as TreeNodeEnableIndex<K, V>;
          while (p !== this._header) {
            p._subTreeSize += 1;
            p = p._parent as TreeNodeEnableIndex<K, V>;
          }
          const nodeList = this._insertNodeSelfBalance(curNode);
          if (nodeList) {
            const {
              parentNode,
              grandParent,
              curNode
            } = nodeList as unknown as Record<string, TreeNodeEnableIndex<K, V>>;
            parentNode.recount();
            grandParent.recount();
            curNode.recount();
          }
        }
      };
      this._eraseNode = function (curNode) {
        let p = this._preEraseNode(curNode) as TreeNodeEnableIndex<K, V>;
        while (p !== this._header) {
          p._subTreeSize -= 1;
          p = p._parent as TreeNodeEnableIndex<K, V>;
        }
      };
    } else {
      this._TreeNodeClass = TreeNode;
      this._set = function (key, value, hint) {
        const curNode = this._preSet(key, value, hint);
        if (curNode) this._insertNodeSelfBalance(curNode);
      };
      this._eraseNode = this._preEraseNode;
    }
    this._header = new this._TreeNodeClass<K, V>();
  }
  /**
   * @param curNode The starting node of the search.
   * @param key The key you want to search.
   * @return TreeNode which key is greater than or equals to the given key.
   * @internal
   */
  protected _lowerBound(curNode: TreeNode<K, V> | undefined, key: K) {
    let resNode;
    while (curNode) {
      const cmpResult = this._cmp(curNode._key as K, key);
      if (cmpResult < 0) {
        curNode = curNode._right;
      } else if (cmpResult > 0) {
        resNode = curNode;
        curNode = curNode._left;
      } else return curNode;
    }
    return resNode === undefined ? this._header : resNode;
  }
  /**
   * @param key The given key you want to compare.
   * @return An iterator to the first element not less than the given key.
   */
  abstract lowerBound(key: K): TreeIterator<K, V>;
  /**
   * @param curNode The starting node of the search.
   * @param key The key you want to search.
   * @return TreeNode which key is greater than the given key.
   * @internal
   */
  protected _upperBound(curNode: TreeNode<K, V> | undefined, key: K) {
    let resNode;
    while (curNode) {
      const cmpResult = this._cmp(curNode._key as K, key);
      if (cmpResult <= 0) {
        curNode = curNode._right;
      } else {
        resNode = curNode;
        curNode = curNode._left;
      }
    }
    return resNode === undefined ? this._header : resNode;
  }
  /**
   * @param key The given key you want to compare.
   * @return An iterator to the first element greater than the given key.
   */
  abstract upperBound(key: K): TreeIterator<K, V>;
  /**
   * @param curNode The starting node of the search.
   * @param key The key you want to search.
   * @return TreeNode which key is less than or equals to the given key.
   * @internal
   */
  protected _reverseLowerBound(curNode: TreeNode<K, V> | undefined, key: K) {
    let resNode;
    while (curNode) {
      const cmpResult = this._cmp(curNode._key as K, key);
      if (cmpResult < 0) {
        resNode = curNode;
        curNode = curNode._right;
      } else if (cmpResult > 0) {
        curNode = curNode._left;
      } else return curNode;
    }
    return resNode === undefined ? this._header : resNode;
  }
  /**
   * @param key The given key you want to compare.
   * @return An iterator to the first element not greater than the given key.
   */
  abstract reverseLowerBound(key: K): TreeIterator<K, V>;
  /**
   * @param curNode The starting node of the search.
   * @param key The key you want to search.
   * @return TreeNode which key is less than the given key.
   * @internal
   */
  protected _reverseUpperBound(curNode: TreeNode<K, V> | undefined, key: K) {
    let resNode;
    while (curNode) {
      const cmpResult = this._cmp(curNode._key as K, key);
      if (cmpResult < 0) {
        resNode = curNode;
        curNode = curNode._right;
      } else {
        curNode = curNode._left;
      }
    }
    return resNode === undefined ? this._header : resNode;
  }
  /**
   * @param key The given key you want to compare.
   * @return An iterator to the first element less than the given key.
   */
  abstract reverseUpperBound(key: K): TreeIterator<K, V>;
  /**
   * @description Union the other tree to self.
   * @param other The other tree container you want to merge.
   */
  abstract union(other: TreeContainer<K, V>): void;
  /**
   * @description Make self balance after erase a node.
   * @param curNode The node want to remove.
   * @internal
   */
  private _eraseNodeSelfBalance(curNode: TreeNode<K, V>) {
    while (true) {
      const parentNode = curNode._parent as TreeNode<K, V>;
      if (parentNode === this._header) return;
      if (curNode._color === TreeNodeColor.RED) {
        curNode._color = TreeNodeColor.BLACK;
        return;
      }
      if (curNode === parentNode._left) {
        const brother = parentNode._right as TreeNode<K, V>;
        if (brother._color === TreeNodeColor.RED) {
          brother._color = TreeNodeColor.BLACK;
          parentNode._color = TreeNodeColor.RED;
          if (parentNode === this._root) {
            this._root = parentNode.rotateLeft();
          } else parentNode.rotateLeft();
        } else {
          if (brother._right && brother._right._color === TreeNodeColor.RED) {
            brother._color = parentNode._color;
            parentNode._color = TreeNodeColor.BLACK;
            brother._right._color = TreeNodeColor.BLACK;
            if (parentNode === this._root) {
              this._root = parentNode.rotateLeft();
            } else parentNode.rotateLeft();
            return;
          } else if (brother._left && brother._left._color === TreeNodeColor.RED) {
            brother._color = TreeNodeColor.RED;
            brother._left._color = TreeNodeColor.BLACK;
            brother.rotateRight();
          } else {
            brother._color = TreeNodeColor.RED;
            curNode = parentNode;
          }
        }
      } else {
        const brother = parentNode._left as TreeNode<K, V>;
        if (brother._color === TreeNodeColor.RED) {
          brother._color = TreeNodeColor.BLACK;
          parentNode._color = TreeNodeColor.RED;
          if (parentNode === this._root) {
            this._root = parentNode.rotateRight();
          } else parentNode.rotateRight();
        } else {
          if (brother._left && brother._left._color === TreeNodeColor.RED) {
            brother._color = parentNode._color;
            parentNode._color = TreeNodeColor.BLACK;
            brother._left._color = TreeNodeColor.BLACK;
            if (parentNode === this._root) {
              this._root = parentNode.rotateRight();
            } else parentNode.rotateRight();
            return;
          } else if (brother._right && brother._right._color === TreeNodeColor.RED) {
            brother._color = TreeNodeColor.RED;
            brother._right._color = TreeNodeColor.BLACK;
            brother.rotateLeft();
          } else {
            brother._color = TreeNodeColor.RED;
            curNode = parentNode;
          }
        }
      }
    }
  }
  /**
   * @internal
   */
  private _preEraseNode(curNode: TreeNode<K, V>) {
    if (this._length === 1) {
      this.clear();
      return this._header;
    }
    let swapNode = curNode;
    while (swapNode._left || swapNode._right) {
      if (swapNode._right) {
        swapNode = swapNode._right;
        while (swapNode._left) swapNode = swapNode._left;
      } else {
        swapNode = swapNode._left as TreeNode<K, V>;
      }
      [curNode._key, swapNode._key] = [swapNode._key, curNode._key];
      [curNode._value, swapNode._value] = [swapNode._value, curNode._value];
      curNode = swapNode;
    }
    if (this._header._left === swapNode) {
      this._header._left = swapNode._parent;
    } else if (this._header._right === swapNode) {
      this._header._right = swapNode._parent;
    }
    this._eraseNodeSelfBalance(swapNode);
    const _parent = swapNode._parent as TreeNode<K, V>;
    if (swapNode === _parent._left) {
      _parent._left = undefined;
    } else _parent._right = undefined;
    this._length -= 1;
    (this._root as TreeNode<K, V>)._color = TreeNodeColor.BLACK;
    return _parent;
  }
  /**
   * @description InOrder traversal the tree.
   * @internal
   */
  protected _inOrderTraversal:
  (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => boolean =
      (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => {
        if (curNode === undefined) return false;
        const ifReturn = this._inOrderTraversal(curNode._left, callback);
        if (ifReturn) return true;
        if (callback(curNode)) return true;
        return this._inOrderTraversal(curNode._right, callback);
      };
  /**
   * @internal
   */
  private _insertNodeSelfBalance(curNode: TreeNode<K, V>) {
    while (true) {
      const parentNode = curNode._parent as TreeNode<K, V>;
      if (parentNode._color === TreeNodeColor.BLACK) return;
      const grandParent = parentNode._parent as TreeNode<K, V>;
      if (parentNode === grandParent._left) {
        const uncle = grandParent._right;
        if (uncle && uncle._color === TreeNodeColor.RED) {
          uncle._color = parentNode._color = TreeNodeColor.BLACK;
          if (grandParent === this._root) return;
          grandParent._color = TreeNodeColor.RED;
          curNode = grandParent;
          continue;
        } else if (curNode === parentNode._right) {
          curNode._color = TreeNodeColor.BLACK;
          if (curNode._left) curNode._left._parent = parentNode;
          if (curNode._right) curNode._right._parent = grandParent;
          parentNode._right = curNode._left;
          grandParent._left = curNode._right;
          curNode._left = parentNode;
          curNode._right = grandParent;
          if (grandParent === this._root) {
            this._root = curNode;
            this._header._parent = curNode;
          } else {
            const GP = grandParent._parent as TreeNode<K, V>;
            if (GP._left === grandParent) {
              GP._left = curNode;
            } else GP._right = curNode;
          }
          curNode._parent = grandParent._parent;
          parentNode._parent = curNode;
          grandParent._parent = curNode;
          grandParent._color = TreeNodeColor.RED;
          return { parentNode, grandParent, curNode };
        } else {
          parentNode._color = TreeNodeColor.BLACK;
          if (grandParent === this._root) {
            this._root = grandParent.rotateRight();
          } else grandParent.rotateRight();
          grandParent._color = TreeNodeColor.RED;
        }
      } else {
        const uncle = grandParent._left;
        if (uncle && uncle._color === TreeNodeColor.RED) {
          uncle._color = parentNode._color = TreeNodeColor.BLACK;
          if (grandParent === this._root) return;
          grandParent._color = TreeNodeColor.RED;
          curNode = grandParent;
          continue;
        } else if (curNode === parentNode._left) {
          curNode._color = TreeNodeColor.BLACK;
          if (curNode._left) curNode._left._parent = grandParent;
          if (curNode._right) curNode._right._parent = parentNode;
          grandParent._right = curNode._left;
          parentNode._left = curNode._right;
          curNode._left = grandParent;
          curNode._right = parentNode;
          if (grandParent === this._root) {
            this._root = curNode;
            this._header._parent = curNode;
          } else {
            const GP = grandParent._parent as TreeNode<K, V>;
            if (GP._left === grandParent) {
              GP._left = curNode;
            } else GP._right = curNode;
          }
          curNode._parent = grandParent._parent;
          parentNode._parent = curNode;
          grandParent._parent = curNode;
          grandParent._color = TreeNodeColor.RED;
          return { parentNode, grandParent, curNode };
        } else {
          parentNode._color = TreeNodeColor.BLACK;
          if (grandParent === this._root) {
            this._root = grandParent.rotateLeft();
          } else grandParent.rotateLeft();
          grandParent._color = TreeNodeColor.RED;
        }
      }
      return;
    }
  }
  /**
   * @internal
   */
  private _preSet(key: K, value?: V, hint?: TreeIterator<K, V>) {
    if (this._root === undefined) {
      this._length += 1;
      this._root = new this._TreeNodeClass<K, V>(key, value);
      this._root._color = TreeNodeColor.BLACK;
      this._root._parent = this._header;
      this._header._parent = this._root;
      this._header._left = this._root;
      this._header._right = this._root;
      return;
    }
    let curNode;
    const minNode = this._header._left as TreeNode<K, V>;
    const compareToMin = this._cmp(minNode._key as K, key);
    if (compareToMin === 0) {
      minNode._value = value;
      return;
    } else if (compareToMin > 0) {
      minNode._left = new this._TreeNodeClass(key, value);
      minNode._left._parent = minNode;
      curNode = minNode._left;
      this._header._left = curNode;
    } else {
      const maxNode = this._header._right as TreeNode<K, V>;
      const compareToMax = this._cmp(maxNode._key as K, key);
      if (compareToMax === 0) {
        maxNode._value = value;
        return;
      } else if (compareToMax < 0) {
        maxNode._right = new this._TreeNodeClass<K, V>(key, value);
        maxNode._right._parent = maxNode;
        curNode = maxNode._right;
        this._header._right = curNode;
      } else {
        if (hint !== undefined) {
          const iterNode = hint._node;
          if (iterNode !== this._header) {
            const iterCmpRes = this._cmp(iterNode._key as K, key);
            if (iterCmpRes === 0) {
              iterNode._value = value;
              return;
            } else /* istanbul ignore else */ if (iterCmpRes > 0) {
              const preNode = iterNode.pre();
              const preCmpRes = this._cmp(preNode._key as K, key);
              if (preCmpRes === 0) {
                preNode._value = value;
                return;
              } else if (preCmpRes < 0) {
                curNode = new this._TreeNodeClass(key, value);
                if (preNode._right === undefined) {
                  preNode._right = curNode;
                  curNode._parent = preNode;
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
            const cmpResult = this._cmp(curNode._key as K, key);
            if (cmpResult > 0) {
              if (curNode._left === undefined) {
                curNode._left = new this._TreeNodeClass<K, V>(key, value);
                curNode._left._parent = curNode;
                curNode = curNode._left;
                break;
              }
              curNode = curNode._left;
            } else if (cmpResult < 0) {
              if (curNode._right === undefined) {
                curNode._right = new this._TreeNodeClass<K, V>(key, value);
                curNode._right._parent = curNode;
                curNode = curNode._right;
                break;
              }
              curNode = curNode._right;
            } else {
              curNode._value = value;
              return;
            }
          }
        }
      }
    }
    this._length += 1;
    return curNode;
  }
  clear() {
    this._length = 0;
    this._root = undefined;
    this._header._parent = undefined;
    this._header._left = this._header._right = undefined;
  }
  /**
   * @description Update node's key by iterator.
   * @param iter The iterator you want to change.
   * @param key The key you want to update.
   * @return Boolean about if the modification is successful.
   * @example
   * const st = new orderedSet([1, 2, 5]);
   * const iter = st.find(2);
   * st.updateKeyByIterator(iter, 3); // then st will become [1, 3, 5]
   */
  updateKeyByIterator(iter: TreeIterator<K, V>, key: K): boolean {
    const node = iter._node;
    if (node === this._header) {
      throw new TypeError('Invalid iterator!');
    }
    if (this._length === 1) {
      node._key = key;
      return true;
    }
    if (node === this._header._left) {
      if (this._cmp(node.next()._key as K, key) > 0) {
        node._key = key;
        return true;
      }
      return false;
    }
    if (node === this._header._right) {
      if (this._cmp(node.pre()._key as K, key) < 0) {
        node._key = key;
        return true;
      }
      return false;
    }
    const preKey = node.pre()._key as K;
    if (this._cmp(preKey, key) >= 0) return false;
    const nextKey = node.next()._key as K;
    if (this._cmp(nextKey, key) <= 0) return false;
    node._key = key;
    return true;
  }
  eraseElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let index = 0;
    this._inOrderTraversal(
      this._root,
      curNode => {
        if (pos === index) {
          this._eraseNode(curNode);
          return true;
        }
        index += 1;
        return false;
      });
  }
  /**
   * @description Find node which key is equals to the given key.
   * @param curNode The starting node of the search.
   * @param key The key you want to search.
   * @internal
   */
  protected _findElementNode(curNode: TreeNode<K, V> | undefined, key: K) {
    while (curNode) {
      const cmpResult = this._cmp(curNode._key as K, key);
      if (cmpResult < 0) {
        curNode = curNode._right;
      } else if (cmpResult > 0) {
        curNode = curNode._left;
      } else return curNode;
    }
    return curNode;
  }
  /**
   * @description Remove the element of the specified key.
   * @param key The key you want to remove.
   */
  eraseElementByKey(key: K) {
    if (!this._length) return;
    const curNode = this._findElementNode(this._root, key);
    if (curNode === undefined) return;
    this._eraseNode(curNode);
  }
  eraseElementByIterator(iter: TreeIterator<K, V>) {
    const node = iter._node;
    if (node === this._header) {
      throw new RangeError('Invalid iterator');
    }
    if (node._right === undefined) {
      iter = iter.next();
    }
    this._eraseNode(node);
    return iter;
  }
  /**
   * @description Get the height of the tree.
   * @return Number about the height of the RB-tree.
   */
  getHeight() {
    if (!this._length) return 0;
    const traversal:
      (curNode: TreeNode<K, V> | undefined) => number =
      (curNode: TreeNode<K, V> | undefined) => {
        if (!curNode) return 0;
        return Math.max(traversal(curNode._left), traversal(curNode._right)) + 1;
      };
    return traversal(this._root);
  }
}

export default TreeContainer;
