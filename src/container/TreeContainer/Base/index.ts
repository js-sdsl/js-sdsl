import type TreeIterator from './TreeIterator';
import { Container } from '@/container/ContainerBase';
import { $checkWithinAccessParams } from '@/utils/checkParams.macro';
import { TreeNode, TreeNodeColor, TreeNodeEnableIndex } from './TreeNode';

abstract class TreeContainer<K, V> extends Container<K | [K, V]> {
  protected root: TreeNode<K, V> | undefined = undefined;
  protected header: TreeNode<K, V>;
  protected cmp: (x: K, y: K) => number;
  TreeNodeClass: typeof TreeNode | typeof TreeNodeEnableIndex;
  /**
   * @description Remove a node.
   * @param curNode The node you want to remove.
   * @protected
   */
  protected eraseNode: (curNode: TreeNode<K, V>) => void;
  /**
   * @description Insert a key-value pair or set value by the given key.
   * @param key The key want to insert.
   * @param value The value want to set.
   * @param hint You can give an iterator hint to improve insertion efficiency.
   * @protected
   */
  protected set: (key: K, value: V, hint?: TreeIterator<K, V>) => void;
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
    this.cmp = cmp;
    if (enableIndex) {
      this.TreeNodeClass = TreeNodeEnableIndex;
      this.set = function (key, value, hint) {
        const curNode = this._preSet(key, value, hint);
        if (curNode) {
          let p = curNode.parent as TreeNodeEnableIndex<K, V>;
          while (p !== this.header) {
            p.subTreeSize += 1;
            p = p.parent as TreeNodeEnableIndex<K, V>;
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
      this.eraseNode = function (curNode) {
        let p = this._eraseNode(curNode) as TreeNodeEnableIndex<K, V>;
        while (p !== this.header) {
          p.subTreeSize -= 1;
          p = p.parent as TreeNodeEnableIndex<K, V>;
        }
      };
    } else {
      this.TreeNodeClass = TreeNode;
      this.set = function (key, value, hint) {
        const curNode = this._preSet(key, value, hint);
        if (curNode && curNode !== this.root) this._insertNodeSelfBalance(curNode);
      };
      this.eraseNode = this._eraseNode;
    }
    this.header = new this.TreeNodeClass<K, V>();
  }
  /**
   * @param curNode The starting node of the search.
   * @param key The key you want to search.
   * @return TreeNode which key is greater than or equals to the given key.
   * @protected
   */
  protected _lowerBound(curNode: TreeNode<K, V> | undefined, key: K) {
    let resNode;
    while (curNode) {
      const cmpResult = this.cmp(curNode.key as K, key);
      if (cmpResult < 0) {
        curNode = curNode.right;
      } else if (cmpResult > 0) {
        resNode = curNode;
        curNode = curNode.left;
      } else return curNode;
    }
    return resNode === undefined ? this.header : resNode;
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
   * @protected
   */
  protected _upperBound(curNode: TreeNode<K, V> | undefined, key: K) {
    let resNode;
    while (curNode) {
      const cmpResult = this.cmp(curNode.key as K, key);
      if (cmpResult <= 0) {
        curNode = curNode.right;
      } else if (cmpResult > 0) {
        resNode = curNode;
        curNode = curNode.left;
      }
    }
    return resNode === undefined ? this.header : resNode;
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
   * @protected
   */
  protected _reverseLowerBound(curNode: TreeNode<K, V> | undefined, key: K) {
    let resNode;
    while (curNode) {
      const cmpResult = this.cmp(curNode.key as K, key);
      if (cmpResult < 0) {
        resNode = curNode;
        curNode = curNode.right;
      } else if (cmpResult > 0) {
        curNode = curNode.left;
      } else return curNode;
    }
    return resNode === undefined ? this.header : resNode;
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
   * @protected
   */
  protected _reverseUpperBound(curNode: TreeNode<K, V> | undefined, key: K) {
    let resNode;
    while (curNode) {
      const cmpResult = this.cmp(curNode.key as K, key);
      if (cmpResult < 0) {
        resNode = curNode;
        curNode = curNode.right;
      } else if (cmpResult >= 0) {
        curNode = curNode.left;
      }
    }
    return resNode === undefined ? this.header : resNode;
  }
  /**
   * @param key The given key you want to compare.
   * @return An iterator to the first element less than the given key.
   */
  abstract reverseUpperBound(key: K): TreeIterator<K, V>;
  /**
   * @description Union the other tree to self.
   *              <br/>
   *              Waiting for optimization, this is O(mlog(n+m)) algorithm now,
   *              but we expect it to be O(mlog(n/m+1)).<br/>
   *              More information =>
   *              https://en.wikipedia.org/wiki/Red_black_tree
   *              <br/>
   * @param other The other tree container you want to merge.
   */
  abstract union(other: TreeContainer<K, V>): void;
  /**
   * @description Make self balance after erase a node.
   * @param curNode The node want to remove.
   * @private
   */
  private _eraseNodeSelfBalance(curNode: TreeNode<K, V>) {
    while (true) {
      const parentNode = curNode.parent as TreeNode<K, V>;
      if (parentNode === this.header) return;
      if (curNode.color === TreeNodeColor.RED) {
        curNode.color = TreeNodeColor.BLACK;
        return;
      }
      if (curNode === parentNode.left) {
        const brother = parentNode.right as TreeNode<K, V>;
        if (brother.color === TreeNodeColor.RED) {
          brother.color = TreeNodeColor.BLACK;
          parentNode.color = TreeNodeColor.RED;
          if (parentNode === this.root) {
            this.root = parentNode.rotateLeft();
          } else parentNode.rotateLeft();
        } else if (brother.color === TreeNodeColor.BLACK) {
          if (brother.right && brother.right.color === TreeNodeColor.RED) {
            brother.color = parentNode.color;
            parentNode.color = TreeNodeColor.BLACK;
            brother.right.color = TreeNodeColor.BLACK;
            if (parentNode === this.root) {
              this.root = parentNode.rotateLeft();
            } else parentNode.rotateLeft();
            return;
          } else if (brother.left && brother.left.color === TreeNodeColor.RED) {
            brother.color = TreeNodeColor.RED;
            brother.left.color = TreeNodeColor.BLACK;
            brother.rotateRight();
          } else {
            brother.color = TreeNodeColor.RED;
            curNode = parentNode;
          }
        }
      } else {
        const brother = parentNode.left as TreeNode<K, V>;
        if (brother.color === TreeNodeColor.RED) {
          brother.color = TreeNodeColor.BLACK;
          parentNode.color = TreeNodeColor.RED;
          if (parentNode === this.root) {
            this.root = parentNode.rotateRight();
          } else parentNode.rotateRight();
        } else {
          if (brother.left && brother.left.color === TreeNodeColor.RED) {
            brother.color = parentNode.color;
            parentNode.color = TreeNodeColor.BLACK;
            brother.left.color = TreeNodeColor.BLACK;
            if (parentNode === this.root) {
              this.root = parentNode.rotateRight();
            } else parentNode.rotateRight();
            return;
          } else if (brother.right && brother.right.color === TreeNodeColor.RED) {
            brother.color = TreeNodeColor.RED;
            brother.right.color = TreeNodeColor.BLACK;
            brother.rotateLeft();
          } else {
            brother.color = TreeNodeColor.RED;
            curNode = parentNode;
          }
        }
      }
    }
  }
  private _eraseNode(curNode: TreeNode<K, V>) {
    if (this.length === 1) {
      this.clear();
      return this.header;
    }
    let swapNode = curNode;
    while (swapNode.left || swapNode.right) {
      if (swapNode.right) {
        swapNode = swapNode.right;
        while (swapNode.left) swapNode = swapNode.left;
      } else if (swapNode.left) {
        swapNode = swapNode.left;
      }
      [curNode.key, swapNode.key] = [swapNode.key, curNode.key];
      [curNode.value, swapNode.value] = [swapNode.value, curNode.value];
      curNode = swapNode;
    }
    if (this.header.left === swapNode) {
      this.header.left = swapNode.parent;
    } else if (this.header.right === swapNode) {
      this.header.right = swapNode.parent;
    }
    this._eraseNodeSelfBalance(swapNode);
    const parent = swapNode.parent as TreeNode<K, V>;
    if (swapNode === parent.left) {
      parent.left = undefined;
    } else parent.right = undefined;
    this.length -= 1;
    (this.root as TreeNode<K, V>).color = TreeNodeColor.BLACK;
    return parent;
  }
  /**
   * @description InOrder traversal the tree.
   * @protected
   */
  protected inOrderTraversal:
  (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => boolean =
      (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => {
        if (curNode === undefined) return false;
        const ifReturn = this.inOrderTraversal(curNode.left, callback);
        if (ifReturn) return true;
        if (callback(curNode)) return true;
        return this.inOrderTraversal(curNode.right, callback);
      };
  private _insertNodeSelfBalance(curNode: TreeNode<K, V>) {
    while (true) {
      const parentNode = curNode.parent as TreeNode<K, V>;
      if (parentNode.color === TreeNodeColor.BLACK) return;
      const grandParent = parentNode.parent as TreeNode<K, V>;
      if (parentNode === grandParent.left) {
        const uncle = grandParent.right;
        if (uncle && uncle.color === TreeNodeColor.RED) {
          uncle.color = parentNode.color = TreeNodeColor.BLACK;
          if (grandParent === this.root) return;
          grandParent.color = TreeNodeColor.RED;
          curNode = grandParent;
          continue;
        } else if (curNode === parentNode.right) {
          curNode.color = TreeNodeColor.BLACK;
          if (curNode.left) curNode.left.parent = parentNode;
          if (curNode.right) curNode.right.parent = grandParent;
          parentNode.right = curNode.left;
          grandParent.left = curNode.right;
          curNode.left = parentNode;
          curNode.right = grandParent;
          if (grandParent === this.root) {
            this.root = curNode;
            this.header.parent = curNode;
          } else {
            const GP = grandParent.parent as TreeNode<K, V>;
            if (GP.left === grandParent) {
              GP.left = curNode;
            } else GP.right = curNode;
          }
          curNode.parent = grandParent.parent;
          parentNode.parent = curNode;
          grandParent.parent = curNode;
          grandParent.color = TreeNodeColor.RED;
          return { parentNode, grandParent, curNode };
        } else {
          parentNode.color = TreeNodeColor.BLACK;
          if (grandParent === this.root) {
            this.root = grandParent.rotateRight();
          } else grandParent.rotateRight();
          grandParent.color = TreeNodeColor.RED;
        }
      } else {
        const uncle = grandParent.left;
        if (uncle && uncle.color === TreeNodeColor.RED) {
          uncle.color = parentNode.color = TreeNodeColor.BLACK;
          if (grandParent === this.root) return;
          grandParent.color = TreeNodeColor.RED;
          curNode = grandParent;
          continue;
        } else if (curNode === parentNode.left) {
          curNode.color = TreeNodeColor.BLACK;
          if (curNode.left) curNode.left.parent = grandParent;
          if (curNode.right) curNode.right.parent = parentNode;
          grandParent.right = curNode.left;
          parentNode.left = curNode.right;
          curNode.left = grandParent;
          curNode.right = parentNode;
          if (grandParent === this.root) {
            this.root = curNode;
            this.header.parent = curNode;
          } else {
            const GP = grandParent.parent as TreeNode<K, V>;
            if (GP.left === grandParent) {
              GP.left = curNode;
            } else GP.right = curNode;
          }
          curNode.parent = grandParent.parent;
          parentNode.parent = curNode;
          grandParent.parent = curNode;
          grandParent.color = TreeNodeColor.RED;
          return { parentNode, grandParent, curNode };
        } else {
          parentNode.color = TreeNodeColor.BLACK;
          if (grandParent === this.root) {
            this.root = grandParent.rotateLeft();
          } else grandParent.rotateLeft();
          grandParent.color = TreeNodeColor.RED;
        }
      }
      return;
    }
  }
  private _preSet(key: K, value?: V, hint?: TreeIterator<K, V>) {
    if (this.root === undefined) {
      this.length += 1;
      this.root = new this.TreeNodeClass<K, V>(key, value);
      this.root.color = TreeNodeColor.BLACK;
      this.root.parent = this.header;
      this.header.parent = this.root;
      this.header.left = this.root;
      this.header.right = this.root;
      return;
    }
    let curNode;
    const minNode = this.header.left as TreeNode<K, V>;
    const compareToMin = this.cmp(minNode.key as K, key);
    if (compareToMin === 0) {
      minNode.value = value;
      return;
    } else if (compareToMin > 0) {
      minNode.left = new this.TreeNodeClass(key, value);
      minNode.left.parent = minNode;
      curNode = minNode.left;
      this.header.left = curNode;
    } else {
      const maxNode = this.header.right as TreeNode<K, V>;
      const compareToMax = this.cmp(maxNode.key as K, key);
      if (compareToMax === 0) {
        maxNode.value = value;
        return;
      } else if (compareToMax < 0) {
        maxNode.right = new this.TreeNodeClass<K, V>(key, value);
        maxNode.right.parent = maxNode;
        curNode = maxNode.right;
        this.header.right = curNode;
      } else {
        if (hint !== undefined) {
          // @ts-ignore
          const iterNode = hint.node;
          if (iterNode !== this.header) {
            const iterCmpRes = this.cmp(iterNode.key as K, key);
            if (iterCmpRes === 0) {
              iterNode.value = value;
              return;
            } else if (iterCmpRes > 0) {
              const preNode = iterNode.pre();
              const preCmpRes = this.cmp(preNode.key as K, key);
              if (preCmpRes === 0) {
                preNode.value = value;
                return;
              } else if (preCmpRes < 0) {
                curNode = new this.TreeNodeClass(key, value);
                if (preNode.right === undefined) {
                  preNode.right = curNode;
                  curNode.parent = preNode;
                } else {
                  iterNode.left = curNode;
                  curNode.parent = iterNode;
                }
              }
            }
          }
        }
        if (curNode === undefined) {
          curNode = this.root;
          while (true) {
            const cmpResult = this.cmp(curNode.key as K, key);
            if (cmpResult > 0) {
              if (curNode.left === undefined) {
                curNode.left = new this.TreeNodeClass<K, V>(key, value);
                curNode.left.parent = curNode;
                curNode = curNode.left;
                break;
              }
              curNode = curNode.left;
            } else if (cmpResult < 0) {
              if (curNode.right === undefined) {
                curNode.right = new this.TreeNodeClass<K, V>(key, value);
                curNode.right.parent = curNode;
                curNode = curNode.right;
                break;
              }
              curNode = curNode.right;
            } else {
              curNode.value = value;
              return;
            }
          }
        }
      }
    }
    this.length += 1;
    return curNode;
  }
  clear() {
    this.length = 0;
    this.root = undefined;
    this.header.parent = undefined;
    this.header.left = this.header.right = undefined;
  }
  /**
   * @description Update node's key by iterator.
   * @param iter The iterator you want to change.
   * @param key The key you want to update.
   * @return Boolean about if the modification is successful.
   */
  updateKeyByIterator(iter: TreeIterator<K, V>, key: K): boolean {
    // @ts-ignore
    const node = iter.node;
    if (node === this.header) {
      throw new TypeError('Invalid iterator!');
    }
    if (this.length === 1) {
      node.key = key;
      return true;
    }
    if (node === this.header.left) {
      if (this.cmp(node.next().key as K, key) > 0) {
        node.key = key;
        return true;
      }
      return false;
    }
    if (node === this.header.right) {
      if (this.cmp(node.pre().key as K, key) < 0) {
        node.key = key;
        return true;
      }
      return false;
    }
    const preKey = node.pre().key as K;
    if (this.cmp(preKey, key) >= 0) return false;
    const nextKey = node.next().key as K;
    if (this.cmp(nextKey, key) <= 0) return false;
    node.key = key;
    return true;
  }
  eraseElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this.length - 1);
    let index = 0;
    this.inOrderTraversal(this.root, curNode => {
      if (pos === index) {
        this.eraseNode(curNode);
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
   * @protected
   */
  protected findElementNode(curNode: TreeNode<K, V> | undefined, key: K) {
    while (curNode) {
      const cmpResult = this.cmp(curNode.key as K, key);
      if (cmpResult < 0) {
        curNode = curNode.right;
      } else if (cmpResult > 0) {
        curNode = curNode.left;
      } else return curNode;
    }
    return curNode;
  }
  /**
   * @description Remove the element of the specified key.
   * @param key The key you want to remove.
   */
  eraseElementByKey(key: K) {
    if (!this.length) return;
    const curNode = this.findElementNode(this.root, key);
    if (curNode === undefined) return;
    this.eraseNode(curNode);
  }
  eraseElementByIterator(iter: TreeIterator<K, V>) {
    // @ts-ignore
    const node = iter.node;
    if (node === this.header) {
      throw new RangeError('Invalid iterator');
    }
    if (node.right === undefined) {
      iter = iter.next();
    }
    this.eraseNode(node);
    return iter;
  }
  /**
   * @description Get the height of the tree.
   * @return Number about the height of the RB-tree.
   */
  getHeight() {
    if (!this.length) return 0;
    const traversal:
      (curNode: TreeNode<K, V> | undefined) => number =
      (curNode: TreeNode<K, V> | undefined) => {
        if (!curNode) return 0;
        return Math.max(traversal(curNode.left), traversal(curNode.right)) + 1;
      };
    return traversal(this.root);
  }
}

export default TreeContainer;
