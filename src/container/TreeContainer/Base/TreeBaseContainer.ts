import { Container } from '@/container/ContainerBase/index';
import { checkWithinAccessParams } from '@/utils/checkParams';
import TreeIterator from './TreeIterator';
import TreeNode from './TreeNode';

abstract class TreeBaseContainer<K, V> extends Container<K | [K, V]> {
  protected root: TreeNode<K, V> | undefined = undefined;
  protected header: TreeNode<K, V> = new TreeNode<K, V>();
  protected cmp: (x: K, y: K) => number;
  protected constructor(cmp: (x: K, y: K) => number =
  (x: K, y: K) => {
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  }) {
    super();
    this.cmp = cmp;
  }
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
  protected eraseNodeSelfBalance(curNode: TreeNode<K, V>) {
    while (true) {
      const parentNode = curNode.parent as TreeNode<K, V>;
      if (parentNode === this.header) return;
      if (curNode.color === TreeNode.RED) {
        curNode.color = TreeNode.BLACK;
        return;
      }
      if (curNode === parentNode.left) {
        const brother = parentNode.right as TreeNode<K, V>;
        if (brother.color === TreeNode.RED) {
          brother.color = TreeNode.BLACK;
          parentNode.color = TreeNode.RED;
          if (parentNode === this.root) {
            this.root = parentNode.rotateLeft();
          } else parentNode.rotateLeft();
        } else if (brother.color === TreeNode.BLACK) {
          if (brother.right && brother.right.color === TreeNode.RED) {
            brother.color = parentNode.color;
            parentNode.color = TreeNode.BLACK;
            brother.right.color = TreeNode.BLACK;
            if (parentNode === this.root) {
              this.root = parentNode.rotateLeft();
            } else parentNode.rotateLeft();
            return;
          } else if (brother.left && brother.left.color === TreeNode.RED) {
            brother.color = TreeNode.RED;
            brother.left.color = TreeNode.BLACK;
            brother.rotateRight();
          } else {
            brother.color = TreeNode.RED;
            curNode = parentNode;
          }
        }
      } else {
        const brother = parentNode.left as TreeNode<K, V>;
        if (brother.color === TreeNode.RED) {
          brother.color = TreeNode.BLACK;
          parentNode.color = TreeNode.RED;
          if (parentNode === this.root) {
            this.root = parentNode.rotateRight();
          } else parentNode.rotateRight();
        } else {
          if (brother.left && brother.left.color === TreeNode.RED) {
            brother.color = parentNode.color;
            parentNode.color = TreeNode.BLACK;
            brother.left.color = TreeNode.BLACK;
            if (parentNode === this.root) {
              this.root = parentNode.rotateRight();
            } else parentNode.rotateRight();
            return;
          } else if (brother.right && brother.right.color === TreeNode.RED) {
            brother.color = TreeNode.RED;
            brother.right.color = TreeNode.BLACK;
            brother.rotateLeft();
          } else {
            brother.color = TreeNode.RED;
            curNode = parentNode;
          }
        }
      }
    }
  }
  protected eraseNode(curNode: TreeNode<K, V>) {
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
    this.eraseNodeSelfBalance(swapNode);
    swapNode.remove();
    this.length -= 1;
    (this.root as TreeNode<K, V>).color = TreeNode.BLACK;
  }
  protected inOrderTraversal:
  (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => boolean =
      (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => {
        if (curNode === undefined) return false;
        const ifReturn = this.inOrderTraversal(curNode.left, callback);
        if (ifReturn) return true;
        if (callback(curNode)) return true;
        return this.inOrderTraversal(curNode.right, callback);
      };
  protected insertNodeSelfBalance(curNode: TreeNode<K, V>) {
    while (true) {
      const parentNode = curNode.parent as TreeNode<K, V>;
      if (parentNode.color === TreeNode.BLACK) return;
      const grandParent = parentNode.parent as TreeNode<K, V>;
      if (parentNode === grandParent.left) {
        const uncle = grandParent.right;
        if (uncle && uncle.color === TreeNode.RED) {
          uncle.color = parentNode.color = TreeNode.BLACK;
          if (grandParent === this.root) return;
          grandParent.color = TreeNode.RED;
          curNode = grandParent;
          continue;
        } else if (curNode === parentNode.right) {
          curNode.color = TreeNode.BLACK;
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
        } else {
          parentNode.color = TreeNode.BLACK;
          if (grandParent === this.root) {
            this.root = grandParent.rotateRight();
          } else grandParent.rotateRight();
        }
        grandParent.color = TreeNode.RED;
      } else {
        const uncle = grandParent.left;
        if (uncle && uncle.color === TreeNode.RED) {
          uncle.color = parentNode.color = TreeNode.BLACK;
          if (grandParent === this.root) return;
          grandParent.color = TreeNode.RED;
          curNode = grandParent;
          continue;
        } else if (curNode === parentNode.left) {
          curNode.color = TreeNode.BLACK;
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
        } else {
          parentNode.color = TreeNode.BLACK;
          if (grandParent === this.root) {
            this.root = grandParent.rotateLeft();
          } else grandParent.rotateLeft();
        }
        grandParent.color = TreeNode.RED;
      }
      return;
    }
  }
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
  protected set(key: K, value?: V) {
    if (this.root === undefined) {
      this.length += 1;
      this.root = new TreeNode<K, V>(key, value);
      this.root.color = TreeNode.BLACK;
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
      minNode.left = new TreeNode(key, value);
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
        maxNode.right = new TreeNode<K, V>(key, value);
        maxNode.right.parent = maxNode;
        curNode = maxNode.right;
        this.header.right = curNode;
      } else {
        curNode = this.root;
        while (true) {
          const cmpResult = this.cmp(curNode.key as K, key);
          if (cmpResult > 0) {
            if (curNode.left === undefined) {
              curNode.left = new TreeNode<K, V>(key, value);
              curNode.left.parent = curNode;
              curNode = curNode.left;
              break;
            }
            curNode = curNode.left;
          } else if (cmpResult < 0) {
            if (curNode.right === undefined) {
              curNode.right = new TreeNode<K, V>(key, value);
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
    this.length += 1;
    this.insertNodeSelfBalance(curNode);
  }
  clear() {
    this.length = 0;
    this.root = undefined;
    this.header.parent = undefined;
    this.header.left = this.header.right = undefined;
  }
  eraseElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
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
   * Removes the elements of the specified key.
   */
  eraseElementByKey(key: K) {
    if (!this.length) return;
    const curNode = this.findElementNode(this.root, key);
    if (curNode === undefined) return;
    this.eraseNode(curNode);
  }
  /**
   * @return An iterator point to the next iterator.
   * Removes element by iterator.
   */
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
   * @return The height of the RB-tree.
   */
  getHeight() {
    if (!this.length) return 0;
    const traversal:
      (curNode: TreeNode<K, V> | undefined) => number =
      (curNode: TreeNode<K, V> | undefined) => {
        if (!curNode) return 1;
        return Math.max(traversal(curNode.left), traversal(curNode.right)) + 1;
      };
    return traversal(this.root);
  }
}

export default TreeBaseContainer;
