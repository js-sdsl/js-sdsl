import { InternalError } from '@/utils/error';
import { Base } from '@/container/ContainerBase/index';
import { checkWithinAccessParams } from '@/utils/checkParams';
import TreeNode from './TreeNode';

abstract class TreeBaseContainer<K, V> extends Base {
  protected root: TreeNode<K, V> = new TreeNode<K, V>();
  protected header: TreeNode<K, V> = new TreeNode<K, V>();
  protected cmp: (x: K, y: K) => number;
  constructor(cmp: (x: K, y: K) => number = (x: K, y: K) => {
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  }) {
    super();
    this.root.color = TreeNode.TreeNodeColorType.black;
    this.header.parent = this.root;
    this.root.parent = this.header;
    this.cmp = cmp;
  }
  protected findSubTreeMinNode: (curNode: TreeNode<K, V>) => TreeNode<K, V> = (curNode: TreeNode<K, V>) => {
    return curNode.leftChild ? this.findSubTreeMinNode(curNode.leftChild) : curNode;
  };
  protected findSubTreeMaxNode: (curNode: TreeNode<K, V>) => TreeNode<K, V> = (curNode: TreeNode<K, V>) => {
    return curNode.rightChild ? this.findSubTreeMaxNode(curNode.rightChild) : curNode;
  };
  protected _lowerBound: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
    if (!curNode || curNode.key === undefined) return undefined;
    const cmpResult = this.cmp(curNode.key, key);
    if (cmpResult === 0) return curNode;
    if (cmpResult < 0) return this._lowerBound(curNode.rightChild, key);
    const resNode = this._lowerBound(curNode.leftChild, key);
    if (resNode === undefined) return curNode;
    return resNode;
  };
  protected _upperBound: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
    if (!curNode || curNode.key === undefined) return undefined;
    const cmpResult = this.cmp(curNode.key, key);
    if (cmpResult <= 0) return this._upperBound(curNode.rightChild, key);
    const resNode = this._upperBound(curNode.leftChild, key);
    if (resNode === undefined) return curNode;
    return resNode;
  };
  protected _reverseLowerBound: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
    if (!curNode || curNode.key === undefined) return undefined;
    const cmpResult = this.cmp(curNode.key, key);
    if (cmpResult === 0) return curNode;
    if (cmpResult > 0) return this._reverseLowerBound(curNode.leftChild, key);
    const resNode = this._reverseLowerBound(curNode.rightChild, key);
    if (resNode === undefined) return curNode;
    return resNode;
  };
  protected _reverseUpperBound: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
    if (!curNode || curNode.key === undefined) return undefined;
    const cmpResult = this.cmp(curNode.key, key);
    if (cmpResult >= 0) return this._reverseUpperBound(curNode.leftChild, key);
    const resNode = this._reverseUpperBound(curNode.rightChild, key);
    if (resNode === undefined) return curNode;
    return resNode;
  };
  protected eraseNodeSelfBalance(curNode: TreeNode<K, V>) {
    const parentNode = curNode.parent;
    if (!parentNode || parentNode === this.header) {
      if (curNode === this.root) return;
      throw new InternalError();
    }

    if (curNode.color === TreeNode.TreeNodeColorType.red) {
      curNode.color = TreeNode.TreeNodeColorType.black;
      return;
    }

    const brotherNode = curNode.brother;
    if (!brotherNode) throw new InternalError();

    if (curNode === parentNode.leftChild) {
      if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
        brotherNode.color = TreeNode.TreeNodeColorType.black;
        parentNode.color = TreeNode.TreeNodeColorType.red;
        const newRoot = parentNode.rotateLeft();
        if (this.root === parentNode) {
          this.root = newRoot;
          this.header.parent = this.root;
          this.root.parent = this.header;
        }
        this.eraseNodeSelfBalance(curNode);
      } else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
        if (brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
          brotherNode.color = parentNode.color;
          parentNode.color = TreeNode.TreeNodeColorType.black;
          if (brotherNode.rightChild) brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
          const newRoot = parentNode.rotateLeft();
          if (this.root === parentNode) {
            this.root = newRoot;
            this.header.parent = this.root;
            this.root.parent = this.header;
          }
          curNode.color = TreeNode.TreeNodeColorType.black;
        } else if ((!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
          brotherNode.color = TreeNode.TreeNodeColorType.red;
          if (brotherNode.leftChild) brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
          const newRoot = brotherNode.rotateRight();
          if (this.root === brotherNode) {
            this.root = newRoot;
            this.header.parent = this.root;
            this.root.parent = this.header;
          }
          this.eraseNodeSelfBalance(curNode);
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
          brotherNode.color = TreeNode.TreeNodeColorType.red;
          this.eraseNodeSelfBalance(parentNode);
        }
      }
    } else if (curNode === parentNode.rightChild) {
      if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
        brotherNode.color = TreeNode.TreeNodeColorType.black;
        parentNode.color = TreeNode.TreeNodeColorType.red;
        const newRoot = parentNode.rotateRight();
        if (this.root === parentNode) {
          this.root = newRoot;
          this.header.parent = this.root;
          this.root.parent = this.header;
        }
        this.eraseNodeSelfBalance(curNode);
      } else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
        if (brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
          brotherNode.color = parentNode.color;
          parentNode.color = TreeNode.TreeNodeColorType.black;
          if (brotherNode.leftChild) brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
          const newRoot = parentNode.rotateRight();
          if (this.root === parentNode) {
            this.root = newRoot;
            this.header.parent = this.root;
            this.root.parent = this.header;
          }
          curNode.color = TreeNode.TreeNodeColorType.black;
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
          brotherNode.color = TreeNode.TreeNodeColorType.red;
          if (brotherNode.rightChild) brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
          const newRoot = brotherNode.rotateLeft();
          if (this.root === brotherNode) {
            this.root = newRoot;
            this.header.parent = this.root;
            this.root.parent = this.header;
          }
          this.eraseNodeSelfBalance(curNode);
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
          brotherNode.color = TreeNode.TreeNodeColorType.red;
          this.eraseNodeSelfBalance(parentNode);
        }
      }
    }
  }
  protected eraseNode(curNode: TreeNode<K, V>) {
    let swapNode: TreeNode<K, V> = curNode;
    while (swapNode.leftChild || swapNode.rightChild) {
      if (swapNode.rightChild) {
        swapNode = this.findSubTreeMinNode(swapNode.rightChild);
        const tmpKey = curNode.key;
        curNode.key = swapNode.key;
        swapNode.key = tmpKey;
        const tmpValue = curNode.value;
        curNode.value = swapNode.value;
        swapNode.value = tmpValue;
        curNode = swapNode;
      }
      if (swapNode.leftChild) {
        swapNode = this.findSubTreeMaxNode(swapNode.leftChild);
        const tmpKey = curNode.key;
        curNode.key = swapNode.key;
        swapNode.key = tmpKey;
        const tmpValue = curNode.value;
        curNode.value = swapNode.value;
        swapNode.value = tmpValue;
        curNode = swapNode;
      }
    }

    if (swapNode.key === undefined) throw new InternalError();
    if (this.header.leftChild && this.header.leftChild.key !== undefined && this.cmp(this.header.leftChild.key, swapNode.key) === 0) {
      if (this.header.leftChild !== this.root) this.header.leftChild = this.header.leftChild?.parent;
      else if (this.header.leftChild?.rightChild) this.header.leftChild = this.header.leftChild?.rightChild;
      else this.header.leftChild = undefined;
    }
    if (this.header.rightChild && this.header.rightChild.key !== undefined && this.cmp(this.header.rightChild.key, swapNode.key) === 0) {
      if (this.header.rightChild !== this.root) this.header.rightChild = this.header.rightChild?.parent;
      else if (this.header.rightChild?.leftChild) this.header.rightChild = this.header.rightChild?.leftChild;
      else this.header.rightChild = undefined;
    }

    this.eraseNodeSelfBalance(swapNode);
    if (swapNode) swapNode.remove();
    --this.length;
    this.root.color = TreeNode.TreeNodeColorType.black;
  }
  protected inOrderTraversal: (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => boolean = (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => {
    if (!curNode || curNode.key === undefined) return false;
    const ifReturn = this.inOrderTraversal(curNode.leftChild, callback);
    if (ifReturn) return true;
    if (callback(curNode)) return true;
    return this.inOrderTraversal(curNode.rightChild, callback);
  };
  protected findInsertPos: (curNode: TreeNode<K, V>, key: K) => TreeNode<K, V> = (curNode: TreeNode<K, V>, key: K) => {
    if (!curNode || curNode.key === undefined) throw new InternalError();
    const cmpResult = this.cmp(key, curNode.key);
    if (cmpResult < 0) {
      if (!curNode.leftChild) {
        curNode.leftChild = new TreeNode<K, V>();
        curNode.leftChild.parent = curNode;
        curNode.leftChild.brother = curNode.rightChild;
        if (curNode.rightChild) curNode.rightChild.brother = curNode.leftChild;
        return curNode.leftChild;
      }
      return this.findInsertPos(curNode.leftChild, key);
    } else if (cmpResult > 0) {
      if (!curNode.rightChild) {
        curNode.rightChild = new TreeNode<K, V>();
        curNode.rightChild.parent = curNode;
        curNode.rightChild.brother = curNode.leftChild;
        if (curNode.leftChild) curNode.leftChild.brother = curNode.rightChild;
        return curNode.rightChild;
      }
      return this.findInsertPos(curNode.rightChild, key);
    }
    return curNode;
  };
  protected insertNodeSelfBalance(curNode: TreeNode<K, V>) {
    const parentNode = curNode.parent;
    if (!parentNode || parentNode === this.header) {
      if (curNode === this.root) return;
      throw new InternalError();
    }

    if (parentNode.color === TreeNode.TreeNodeColorType.black) return;

    if (parentNode.color === TreeNode.TreeNodeColorType.red) {
      const uncleNode = parentNode.brother;
      const grandParent = parentNode.parent;
      if (!grandParent) throw new InternalError();

      if (uncleNode && uncleNode.color === TreeNode.TreeNodeColorType.red) {
        uncleNode.color = parentNode.color = TreeNode.TreeNodeColorType.black;
        grandParent.color = TreeNode.TreeNodeColorType.red;
        this.insertNodeSelfBalance(grandParent);
      } else if (!uncleNode || uncleNode.color === TreeNode.TreeNodeColorType.black) {
        if (parentNode === grandParent.leftChild) {
          if (curNode === parentNode.leftChild) {
            parentNode.color = TreeNode.TreeNodeColorType.black;
            grandParent.color = TreeNode.TreeNodeColorType.red;
            const newRoot = grandParent.rotateRight();
            if (grandParent === this.root) {
              this.root = newRoot;
              this.header.parent = this.root;
              this.root.parent = this.header;
            }
          } else if (curNode === parentNode.rightChild) {
            const newRoot = parentNode.rotateLeft();
            if (parentNode === this.root) {
              this.root = newRoot;
              this.header.parent = this.root;
              this.root.parent = this.header;
            }
            this.insertNodeSelfBalance(parentNode);
          }
        } else if (parentNode === grandParent.rightChild) {
          if (curNode === parentNode.leftChild) {
            const newRoot = parentNode.rotateRight();
            if (parentNode === this.root) {
              this.root = newRoot;
              this.header.parent = this.root;
              this.root.parent = this.header;
            }
            this.insertNodeSelfBalance(parentNode);
          } else if (curNode === parentNode.rightChild) {
            parentNode.color = TreeNode.TreeNodeColorType.black;
            grandParent.color = TreeNode.TreeNodeColorType.red;
            const newRoot = grandParent.rotateLeft();
            if (grandParent === this.root) {
              this.root = newRoot;
              this.header.parent = this.root;
              this.root.parent = this.header;
            }
          }
        }
      }
    }
  }
  protected findElementNode: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
    if (!curNode || curNode.key === undefined) return undefined;
    const cmpResult = this.cmp(key, curNode.key);
    if (cmpResult < 0) return this.findElementNode(curNode.leftChild, key);
    else if (cmpResult > 0) return this.findElementNode(curNode.rightChild, key);
    return curNode;
  };
  clear() {
    this.length = 0;
    this.root.key = this.root.value = undefined;
    this.root.leftChild = this.root.rightChild = this.root.brother = undefined;
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
      ++index;
      return false;
    });
  }
  /**
   * Removes the elements of the specified key.
   */
  eraseElementByKey(key: K) {
    if (this.empty()) return;

    const curNode = this.findElementNode(this.root, key);
    if (curNode === undefined || curNode.key === undefined || this.cmp(curNode.key, key) !== 0) return;

    this.eraseNode(curNode);
  }
  /**
   * @return The height of the RB-tree.
   */
  getHeight() {
    if (this.empty()) return 0;
    const traversal: (curNode: TreeNode<K, V> | undefined) => number = (curNode: TreeNode<K, V> | undefined) => {
      if (!curNode) return 1;
      return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
    };
    return traversal(this.root);
  }
}

export default TreeBaseContainer;
