import { Container } from '@/container/ContainerBase';
import { checkWithinAccessParams } from '@/utils/checkParams';
import TreeIterator from './TreeIterator';
import TreeNode from './TreeNode';

abstract class TreeBaseContainer<K, V> extends Container<K | [K, V]> {
  protected root: TreeNode<K, V> | undefined = undefined;
  protected header: TreeNode<K, V> = new TreeNode<K, V>();
  protected cmp: (x: K, y: K) => number;
  protected constructor(cmp: (x: K, y: K) => number = (x: K, y: K) => {
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
        if (cmpResult < 0) return this._lowerBound(curNode.rightChild, key);
        const resNode = this._lowerBound(curNode.leftChild, key);
        if (resNode === this.header) return curNode;
        return resNode;
      };
  protected _upperBound:
  (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> =
      (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (curNode === undefined) return this.header;
        const cmpResult = this.cmp(curNode.key as K, key);
        if (cmpResult <= 0) return this._upperBound(curNode.rightChild, key);
        const resNode = this._upperBound(curNode.leftChild, key);
        if (resNode === this.header) return curNode;
        return resNode;
      };
  protected _reverseLowerBound:
  (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> =
      (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (curNode === undefined) return this.header;
        const cmpResult = this.cmp(curNode.key as K, key);
        if (cmpResult === 0) return curNode;
        if (cmpResult > 0) return this._reverseLowerBound(curNode.leftChild, key);
        const resNode = this._reverseLowerBound(curNode.rightChild, key);
        if (resNode === this.header) return curNode;
        return resNode;
      };
  protected _reverseUpperBound:
  (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> =
      (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (curNode === undefined) return this.header;
        const cmpResult = this.cmp(curNode.key as K, key);
        if (cmpResult >= 0) return this._reverseUpperBound(curNode.leftChild, key);
        const resNode = this._reverseUpperBound(curNode.rightChild, key);
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

      if (curNode === parentNode.leftChild) {
        if (brotherNode.color === TreeNode.red) {
          brotherNode.color = TreeNode.black;
          parentNode.color = TreeNode.red;
          parentNode.rotateLeft();
        } else if (brotherNode.color === TreeNode.black) {
          if (brotherNode.rightChild?.color === TreeNode.red) {
            brotherNode.color = parentNode.color;
            parentNode.color = TreeNode.black;
            brotherNode.rightChild.color = TreeNode.black;
            if (parentNode === this.root) {
              parentNode.parent = undefined;
              this.root = parentNode.rotateLeft();
              this.header.parent = this.root;
              this.root.parent = this.header;
            } else parentNode.rotateLeft();
            curNode.color = TreeNode.black;
            return;
          } else if (brotherNode.leftChild?.color === TreeNode.red) {
            brotherNode.color = TreeNode.red;
            brotherNode.leftChild.color = TreeNode.black;
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
          if (brotherNode.leftChild?.color === TreeNode.red) {
            brotherNode.color = parentNode.color;
            parentNode.color = TreeNode.black;
            brotherNode.leftChild.color = TreeNode.black;
            if (parentNode === this.root) {
              parentNode.parent = undefined;
              this.root = parentNode.rotateRight();
              this.header.parent = this.root;
              this.root.parent = this.header;
            } else parentNode.rotateRight();
            curNode.color = TreeNode.black;
            return;
          } else if (brotherNode.rightChild?.color === TreeNode.red) {
            brotherNode.color = TreeNode.red;
            brotherNode.rightChild.color = TreeNode.black;
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
    while (swapNode.leftChild || swapNode.rightChild) {
      if (swapNode.rightChild) {
        swapNode = swapNode.rightChild;
        while (swapNode.leftChild) swapNode = swapNode.leftChild;
      }
      if (swapNode.leftChild) {
        swapNode = swapNode.leftChild;
        while (swapNode.rightChild) swapNode = swapNode.rightChild;
      }
      [curNode.key, swapNode.key] = [swapNode.key, curNode.key];
      [curNode.value, swapNode.value] = [swapNode.value, curNode.value];
      curNode = swapNode;
    }

    if (this.header.leftChild === swapNode) {
      this.header.leftChild = this.header.leftChild.parent;
    }
    if (this.header.rightChild === swapNode) {
      this.header.rightChild = this.header.rightChild.parent;
    }
    this.eraseNodeSelfBalance(swapNode);
    swapNode.remove();
    this.length -= 1;
  }
  protected inOrderTraversal:
  (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => boolean =
      (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => {
        if (curNode === undefined) return false;
        const ifReturn = this.inOrderTraversal(curNode.leftChild, callback);
        if (ifReturn) return true;
        if (callback(curNode)) return true;
        return this.inOrderTraversal(curNode.rightChild, callback);
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
        if (parentNode === grandParent.leftChild) {
          if (curNode === parentNode.leftChild) {
            parentNode.color = TreeNode.black;
            grandParent.color = TreeNode.red;
            if (grandParent === this.root) {
              grandParent.parent = undefined;
              this.root = grandParent.rotateRight();
              this.header.parent = this.root;
              this.root.parent = this.header;
            } else grandParent.rotateRight();
            return;
          } else {
            parentNode.rotateLeft();
            curNode = parentNode;
          }
        } else {
          if (curNode === parentNode.leftChild) {
            parentNode.rotateRight();
            curNode = parentNode;
          } else {
            parentNode.color = TreeNode.black;
            grandParent.color = TreeNode.red;
            if (grandParent === this.root) {
              grandParent.parent = undefined;
              this.root = grandParent.rotateLeft();
              this.header.parent = this.root;
              this.root.parent = this.header;
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
        curNode = curNode.rightChild;
      } else if (cmpResult > 0) {
        curNode = curNode.leftChild;
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
      this.header.leftChild = this.root;
      this.header.rightChild = this.root;
      return;
    }
    let curNode;
    const minNode = this.header.leftChild as TreeNode<K, V>;
    const compareToMin = this.cmp(minNode.key as K, key);
    if (compareToMin === 0) {
      minNode.value = value;
      return;
    } else if (compareToMin > 0) {
      minNode.leftChild = new TreeNode(key, value);
      minNode.leftChild.parent = minNode;
      minNode.leftChild.brother = minNode.rightChild;
      if (minNode.rightChild) minNode.rightChild.brother = minNode.leftChild;
      curNode = minNode.leftChild;
      this.header.leftChild = curNode;
    } else {
      const maxNode = this.header.rightChild as TreeNode<K, V>;
      const compareToMax = this.cmp(maxNode.key as K, key);
      if (compareToMax === 0) {
        maxNode.value = value;
        return;
      } else if (compareToMax < 0) {
        maxNode.rightChild = new TreeNode<K, V>(key, value);
        maxNode.rightChild.parent = maxNode;
        maxNode.rightChild.brother = maxNode.leftChild;
        if (maxNode.leftChild) maxNode.leftChild.brother = maxNode.rightChild;
        curNode = maxNode.rightChild;
        this.header.rightChild = curNode;
      } else {
        curNode = this.root;
        while (true) {
          const cmpResult = this.cmp(curNode.key as K, key);
          if (cmpResult > 0) {
            if (!curNode.leftChild) {
              curNode.leftChild = new TreeNode<K, V>(key, value);
              curNode.leftChild.parent = curNode;
              curNode.leftChild.brother = curNode.rightChild;
              if (curNode.rightChild) curNode.rightChild.brother = curNode.leftChild;
              curNode = curNode.leftChild;
              break;
            }
            curNode = curNode.leftChild;
          } else if (cmpResult < 0) {
            if (!curNode.rightChild) {
              curNode.rightChild = new TreeNode<K, V>(key, value);
              curNode.rightChild.parent = curNode;
              curNode.rightChild.brother = curNode.leftChild;
              if (curNode.leftChild) curNode.leftChild.brother = curNode.rightChild;
              curNode = curNode.rightChild;
              break;
            }
            curNode = curNode.rightChild;
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
    this.header.leftChild = this.header.rightChild = undefined;
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
    if (
      curNode === undefined ||
      this.cmp(curNode.key as K, key) !== 0
    ) return;
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
      return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
    };
    return traversal(this.root);
  }
}

export default TreeBaseContainer;
