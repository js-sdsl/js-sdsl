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
  protected _lowerBound:
  (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> =
      (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (curNode === undefined) return this.header;
        const cmpResult = this.cmp(curNode.key as K, key);
        if (cmpResult === 0) return curNode;
        if (cmpResult < 0) return this._lowerBound(curNode.right, key);
        const resNode = this._lowerBound(curNode.left, key);
        if (resNode === this.header) return curNode;
        return resNode;
      };
  protected _upperBound:
  (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> =
      (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (curNode === undefined) return this.header;
        const cmpResult = this.cmp(curNode.key as K, key);
        if (cmpResult <= 0) return this._upperBound(curNode.right, key);
        const resNode = this._upperBound(curNode.left, key);
        if (resNode === this.header) return curNode;
        return resNode;
      };
  protected _reverseLowerBound:
  (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> =
      (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (curNode === undefined) return this.header;
        const cmpResult = this.cmp(curNode.key as K, key);
        if (cmpResult === 0) return curNode;
        if (cmpResult > 0) return this._reverseLowerBound(curNode.left, key);
        const resNode = this._reverseLowerBound(curNode.right, key);
        if (resNode === this.header) return curNode;
        return resNode;
      };
  protected _reverseUpperBound:
  (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> =
      (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (curNode === undefined) return this.header;
        const cmpResult = this.cmp(curNode.key as K, key);
        if (cmpResult >= 0) return this._reverseUpperBound(curNode.left, key);
        const resNode = this._reverseUpperBound(curNode.right, key);
        if (resNode === this.header) return curNode;
        return resNode;
      };
  protected eraseNodeSelfBalance(curNode: TreeNode<K, V>) {
    while (true) {
      const parentNode = curNode.parent as TreeNode<K, V>;
      if (parentNode === this.header) return;

      if (curNode.color === TreeNode.red) {
        curNode.color = TreeNode.black;
        return;
      }

      const brotherNode = curNode.brother as TreeNode<K, V>;

      if (curNode === parentNode.left) {
        if (brotherNode.color === TreeNode.red) {
          brotherNode.color = TreeNode.black;
          parentNode.color = TreeNode.red;
          parentNode.rotateLeft();
        } else if (brotherNode.color === TreeNode.black) {
          if (brotherNode.right?.color === TreeNode.red) {
            brotherNode.color = parentNode.color;
            parentNode.color = TreeNode.black;
            brotherNode.right.color = TreeNode.black;
            if (parentNode === this.root) {
              this.root = parentNode.rotateLeft();
            } else parentNode.rotateLeft();
            curNode.color = TreeNode.black;
            return;
          } else if (brotherNode.left?.color === TreeNode.red) {
            brotherNode.color = TreeNode.red;
            brotherNode.left.color = TreeNode.black;
            brotherNode.rotateRight();
          } else {
            brotherNode.color = TreeNode.red;
            curNode = parentNode;
          }
        }
      } else {
        if (brotherNode.color === TreeNode.red) {
          brotherNode.color = TreeNode.black;
          parentNode.color = TreeNode.red;
          parentNode.rotateRight();
        } else {
          if (brotherNode.left?.color === TreeNode.red) {
            brotherNode.color = parentNode.color;
            parentNode.color = TreeNode.black;
            brotherNode.left.color = TreeNode.black;
            if (parentNode === this.root) {
              this.root = parentNode.rotateRight();
            } else parentNode.rotateRight();
            curNode.color = TreeNode.black;
            return;
          } else if (brotherNode.right?.color === TreeNode.red) {
            brotherNode.color = TreeNode.red;
            brotherNode.right.color = TreeNode.black;
            brotherNode.rotateLeft();
          } else {
            brotherNode.color = TreeNode.red;
            curNode = parentNode;
          }
        }
      }
    }
  }
  protected eraseNode(curNode: TreeNode<K, V>) {
    if (this.length === 1) {
      this.clear();
      return;
    }
    let swapNode = curNode;
    while (swapNode.left || swapNode.right) {
      if (swapNode.right) {
        swapNode = swapNode.right;
        while (swapNode.left) swapNode = swapNode.left;
      }
      if (swapNode.left) {
        swapNode = swapNode.left;
        while (swapNode.right) swapNode = swapNode.right;
      }
      [curNode.key, swapNode.key] = [swapNode.key, curNode.key];
      [curNode.value, swapNode.value] = [swapNode.value, curNode.value];
      curNode = swapNode;
    }

    if (this.header.left === swapNode) {
      this.header.left = this.header.left.parent;
    }
    if (this.header.right === swapNode) {
      this.header.right = this.header.right.parent;
    }
    this.eraseNodeSelfBalance(swapNode);
    swapNode.remove();
    this.length -= 1;
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
      if (parentNode.color === TreeNode.black) return;
      const uncleNode = parentNode.brother;
      const grandParent = parentNode.parent as TreeNode<K, V>;
      if (uncleNode?.color === TreeNode.red) {
        uncleNode.color = parentNode.color = TreeNode.black;
        if (grandParent === this.root) return;
        grandParent.color = TreeNode.red;
        curNode = grandParent;
      } else {
        if (parentNode === grandParent.left) {
          if (curNode === parentNode.left) {
            parentNode.color = TreeNode.black;
            grandParent.color = TreeNode.red;
            if (grandParent === this.root) {
              this.root = grandParent.rotateRight();
            } else grandParent.rotateRight();
            return;
          } else {
            parentNode.rotateLeft();
            curNode = parentNode;
          }
        } else {
          if (curNode === parentNode.left) {
            parentNode.rotateRight();
            curNode = parentNode;
          } else {
            parentNode.color = TreeNode.black;
            grandParent.color = TreeNode.red;
            if (grandParent === this.root) {
              this.root = grandParent.rotateLeft();
            } else grandParent.rotateLeft();
            return;
          }
        }
      }
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
      this.root.color = TreeNode.black;
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
      minNode.left.brother = minNode.right;
      if (minNode.right) minNode.right.brother = minNode.left;
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
        maxNode.right.brother = maxNode.left;
        if (maxNode.left) maxNode.left.brother = maxNode.right;
        curNode = maxNode.right;
        this.header.right = curNode;
      } else {
        curNode = this.root;
        while (true) {
          const cmpResult = this.cmp(curNode.key as K, key);
          if (cmpResult > 0) {
            if (!curNode.left) {
              curNode.left = new TreeNode<K, V>(key, value);
              curNode.left.parent = curNode;
              curNode.left.brother = curNode.right;
              if (curNode.right) curNode.right.brother = curNode.left;
              curNode = curNode.left;
              break;
            }
            curNode = curNode.left;
          } else if (cmpResult < 0) {
            if (!curNode.right) {
              curNode.right = new TreeNode<K, V>(key, value);
              curNode.right.parent = curNode;
              curNode.right.brother = curNode.left;
              if (curNode.left) curNode.left.brother = curNode.right;
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
    iter = iter.next();
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
