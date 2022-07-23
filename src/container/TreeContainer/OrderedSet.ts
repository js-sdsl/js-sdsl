import { TreeNode, TreeIterator } from './TreeBase';
import { Base, ContainerIterator, initContainer } from '@/types/interface';
import { checkUndefinedParams, checkWithinAccessParams } from '@/utils/checkParams';
import { InternalError, RunTimeError } from '@/types/error';

export class OrderedSetIterator<T> extends TreeIterator<T, undefined> {
  constructor(
    node: TreeNode<T, undefined>,
    header: TreeNode<T, undefined>,
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

class OrderedSet<T> extends Base {
  private root: TreeNode<T, undefined> = new TreeNode<T, undefined>();
  private header: TreeNode<T, undefined> = new TreeNode<T, undefined>();
  private cmp: (x: T, y: T) => number;
  constructor(container: initContainer<T> = [], cmp?: (x: T, y: T) => number) {
    super();
    this.root.color = TreeNode.TreeNodeColorType.black;
    this.header.parent = this.root;
    this.root.parent = this.header;
    this.cmp =
      cmp ??
      ((x: T, y: T) => {
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
      });
    container.forEach((element) => this.insert(element));
    this.iterationFunc = this.iterationFunc.bind(this);
  }
  private findSubTreeMinNode: (
    curNode: TreeNode<T, undefined>
  ) => TreeNode<T, undefined> = (curNode: TreeNode<T, undefined>) => {
      if (!curNode || curNode.key === undefined) {
        throw new InternalError();
      }
      return curNode.leftChild
        ? this.findSubTreeMinNode(curNode.leftChild)
        : curNode;
    };
  private findSubTreeMaxNode: (
    curNode: TreeNode<T, undefined>
  ) => TreeNode<T, undefined> = (curNode: TreeNode<T, undefined>) => {
      if (!curNode || curNode.key === undefined) {
        throw new InternalError();
      }
      return curNode.rightChild
        ? this.findSubTreeMaxNode(curNode.rightChild)
        : curNode;
    };
  private inOrderTraversal: (
    curNode: TreeNode<T, undefined> | undefined,
    callback: (curNode: TreeNode<T, undefined>) => boolean
  ) => boolean = (
      curNode: TreeNode<T, undefined> | undefined,
      callback: (curNode: TreeNode<T, undefined>) => boolean
    ) => {
      if (!curNode || curNode.key === undefined) return false;
      const ifReturn = this.inOrderTraversal(curNode.leftChild, callback);
      if (ifReturn) return true;
      if (callback(curNode)) return true;
      return this.inOrderTraversal(curNode.rightChild, callback);
    };
  private eraseNodeSelfBalance(curNode: TreeNode<T, undefined>) {
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
        if (
          brotherNode.rightChild &&
          brotherNode.rightChild.color ===
          TreeNode.TreeNodeColorType.red
        ) {
          brotherNode.color = parentNode.color;
          parentNode.color = TreeNode.TreeNodeColorType.black;
          if (brotherNode.rightChild) {
            brotherNode.rightChild.color =
              TreeNode.TreeNodeColorType.black;
          }
          const newRoot = parentNode.rotateLeft();
          if (this.root === parentNode) {
            this.root = newRoot;
            this.header.parent = this.root;
            this.root.parent = this.header;
          }
          curNode.color = TreeNode.TreeNodeColorType.black;
        } else if (
          (!brotherNode.rightChild ||
            brotherNode.rightChild.color ===
            TreeNode.TreeNodeColorType.black) &&
          brotherNode.leftChild &&
          brotherNode.leftChild.color ===
          TreeNode.TreeNodeColorType.red
        ) {
          brotherNode.color = TreeNode.TreeNodeColorType.red;
          if (brotherNode.leftChild) {
            brotherNode.leftChild.color =
              TreeNode.TreeNodeColorType.black;
          }
          const newRoot = brotherNode.rotateRight();
          if (this.root === brotherNode) {
            this.root = newRoot;
            this.header.parent = this.root;
            this.root.parent = this.header;
          }
          this.eraseNodeSelfBalance(curNode);
        } else if (
          (!brotherNode.leftChild ||
            brotherNode.leftChild.color ===
            TreeNode.TreeNodeColorType.black) &&
          (!brotherNode.rightChild ||
            brotherNode.rightChild.color ===
            TreeNode.TreeNodeColorType.black)
        ) {
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
        if (
          brotherNode.leftChild &&
          brotherNode.leftChild.color ===
          TreeNode.TreeNodeColorType.red
        ) {
          brotherNode.color = parentNode.color;
          parentNode.color = TreeNode.TreeNodeColorType.black;
          if (brotherNode.leftChild) {
            brotherNode.leftChild.color =
              TreeNode.TreeNodeColorType.black;
          }
          const newRoot = parentNode.rotateRight();
          if (this.root === parentNode) {
            this.root = newRoot;
            this.header.parent = this.root;
            this.root.parent = this.header;
          }
          curNode.color = TreeNode.TreeNodeColorType.black;
        } else if (
          (!brotherNode.leftChild ||
            brotherNode.leftChild.color ===
            TreeNode.TreeNodeColorType.black) &&
          brotherNode.rightChild &&
          brotherNode.rightChild.color ===
          TreeNode.TreeNodeColorType.red
        ) {
          brotherNode.color = TreeNode.TreeNodeColorType.red;
          if (brotherNode.rightChild) {
            brotherNode.rightChild.color =
              TreeNode.TreeNodeColorType.black;
          }
          const newRoot = brotherNode.rotateLeft();
          if (this.root === brotherNode) {
            this.root = newRoot;
            this.header.parent = this.root;
            this.root.parent = this.header;
          }
          this.eraseNodeSelfBalance(curNode);
        } else if (
          (!brotherNode.leftChild ||
            brotherNode.leftChild.color ===
            TreeNode.TreeNodeColorType.black) &&
          (!brotherNode.rightChild ||
            brotherNode.rightChild.color ===
            TreeNode.TreeNodeColorType.black)
        ) {
          brotherNode.color = TreeNode.TreeNodeColorType.red;
          this.eraseNodeSelfBalance(parentNode);
        }
      }
    }
  }
  private eraseNode(curNode: TreeNode<T, undefined>) {
    let swapNode: TreeNode<T, undefined> = curNode;
    while (swapNode.leftChild || swapNode.rightChild) {
      if (swapNode.rightChild) {
        swapNode = this.findSubTreeMinNode(swapNode.rightChild);
        const tmpKey = curNode.key;
        curNode.key = swapNode.key;
        swapNode.key = tmpKey;
        curNode = swapNode;
      }
      if (swapNode.leftChild) {
        swapNode = this.findSubTreeMaxNode(swapNode.leftChild);
        const tmpKey = curNode.key;
        curNode.key = swapNode.key;
        swapNode.key = tmpKey;
        curNode = swapNode;
      }
    }

    if (swapNode.key === undefined) throw new InternalError();
    if (
      this.header.leftChild &&
      this.header.leftChild.key !== undefined &&
      this.cmp(this.header.leftChild.key, swapNode.key) === 0
    ) {
      if (this.header.leftChild !== this.root) {
        this.header.leftChild = this.header.leftChild?.parent;
      } else if (this.header.leftChild?.rightChild) {
        this.header.leftChild = this.header.leftChild?.rightChild;
      } else this.header.leftChild = undefined;
    }
    if (
      this.header.rightChild &&
      this.header.rightChild.key !== undefined &&
      this.cmp(this.header.rightChild.key, swapNode.key) === 0
    ) {
      if (this.header.rightChild !== this.root) {
        this.header.rightChild = this.header.rightChild?.parent;
      } else if (this.header.rightChild?.leftChild) {
        this.header.rightChild = this.header.rightChild?.leftChild;
      } else this.header.rightChild = undefined;
    }

    this.eraseNodeSelfBalance(swapNode);
    if (swapNode) swapNode.remove();
    --this.length;
    this.root.color = TreeNode.TreeNodeColorType.black;
  }
  private findInsertPos: (
    curNode: TreeNode<T, undefined>,
    element: T
  ) => TreeNode<T, undefined> = (
      curNode: TreeNode<T, undefined>,
      element: T
    ) => {
      if (!curNode || curNode.key === undefined) {
        throw new InternalError();
      }
      const cmpResult = this.cmp(element, curNode.key);
      if (cmpResult < 0) {
        if (!curNode.leftChild) {
          curNode.leftChild = new TreeNode<T, undefined>();
          curNode.leftChild.parent = curNode;
          curNode.leftChild.brother = curNode.rightChild;
          if (curNode.rightChild) {
            curNode.rightChild.brother = curNode.leftChild;
          }
          return curNode.leftChild;
        }
        return this.findInsertPos(curNode.leftChild, element);
      } else if (cmpResult > 0) {
        if (!curNode.rightChild) {
          curNode.rightChild = new TreeNode<T, undefined>();
          curNode.rightChild.parent = curNode;
          curNode.rightChild.brother = curNode.leftChild;
          if (curNode.leftChild) {
            curNode.leftChild.brother = curNode.rightChild;
          }
          return curNode.rightChild;
        }
        return this.findInsertPos(curNode.rightChild, element);
      }
      return curNode;
    };
  private insertNodeSelfBalance(curNode: TreeNode<T, undefined>) {
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

      if (
        uncleNode &&
        uncleNode.color === TreeNode.TreeNodeColorType.red
      ) {
        uncleNode.color = parentNode.color =
          TreeNode.TreeNodeColorType.black;
        grandParent.color = TreeNode.TreeNodeColorType.red;
        this.insertNodeSelfBalance(grandParent);
      } else if (
        !uncleNode ||
        uncleNode.color === TreeNode.TreeNodeColorType.black
      ) {
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
  private findElementPos: (
    curNode: TreeNode<T, undefined> | undefined,
    element: T
  ) => TreeNode<T, undefined> | undefined = (
      curNode: TreeNode<T, undefined> | undefined,
      element: T
    ) => {
      if (!curNode || curNode.key === undefined) return undefined;
      const cmpResult = this.cmp(element, curNode.key);
      if (cmpResult < 0) {
        return this.findElementPos(curNode.leftChild, element);
      } else if (cmpResult > 0) {
        return this.findElementPos(curNode.rightChild, element);
      }
      return curNode;
    };
  private _lowerBound: (
    curNode: TreeNode<T, undefined> | undefined,
    key: T
  ) => TreeNode<T, undefined> | undefined = (
      curNode: TreeNode<T, undefined> | undefined,
      key: T
    ) => {
      if (!curNode || curNode.key === undefined) return undefined;
      const cmpResult = this.cmp(curNode.key, key);
      if (cmpResult === 0) return curNode;
      if (cmpResult < 0) return this._lowerBound(curNode.rightChild, key);
      const resNode = this._lowerBound(curNode.leftChild, key);
      if (resNode === undefined) return curNode;
      return resNode;
    };
  private _upperBound: (
    curNode: TreeNode<T, undefined> | undefined,
    key: T
  ) => TreeNode<T, undefined> | undefined = (
      curNode: TreeNode<T, undefined> | undefined,
      key: T
    ) => {
      if (!curNode || curNode.key === undefined) return undefined;
      const cmpResult = this.cmp(curNode.key, key);
      if (cmpResult <= 0) return this._upperBound(curNode.rightChild, key);
      const resNode = this._upperBound(curNode.leftChild, key);
      if (resNode === undefined) return curNode;
      return resNode;
    };
  private _reverseLowerBound: (
    curNode: TreeNode<T, undefined> | undefined,
    key: T
  ) => TreeNode<T, undefined> | undefined = (
      curNode: TreeNode<T, undefined> | undefined,
      key: T
    ) => {
      if (!curNode || curNode.key === undefined) return undefined;
      const cmpResult = this.cmp(curNode.key, key);
      if (cmpResult === 0) return curNode;
      if (cmpResult > 0) {
        return this._reverseLowerBound(curNode.leftChild, key);
      }
      const resNode = this._reverseLowerBound(curNode.rightChild, key);
      if (resNode === undefined) return curNode;
      return resNode;
    };
  private _reverseUpperBound: (
    curNode: TreeNode<T, undefined> | undefined,
    key: T
  ) => TreeNode<T, undefined> | undefined = (
      curNode: TreeNode<T, undefined> | undefined,
      key: T
    ) => {
      if (!curNode || curNode.key === undefined) return undefined;
      const cmpResult = this.cmp(curNode.key, key);
      if (cmpResult >= 0) {
        return this._reverseUpperBound(curNode.leftChild, key);
      }
      const resNode = this._reverseUpperBound(curNode.rightChild, key);
      if (resNode === undefined) return curNode;
      return resNode;
    };
  private iterationFunc: (
    curNode: TreeNode<T, undefined> | undefined
  ) => Generator<T, void, undefined> = function * (
      this: OrderedSet<T>,
      curNode: TreeNode<T, undefined> | undefined
    ) {
      if (!curNode || curNode.key === undefined) return;
      yield * this.iterationFunc(curNode.leftChild);
      yield curNode.key;
      yield * this.iterationFunc(curNode.rightChild);
    };
  clear() {
    this.length = 0;
    this.root.key = undefined;
    this.root.leftChild =
      this.root.rightChild =
      this.root.brother =
      undefined;
    this.header.leftChild = this.header.rightChild = undefined;
  }
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
  forEach(callback: (element: T, index: number) => void) {
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
  eraseElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    let index = 0;
    this.inOrderTraversal(this.root, (curNode) => {
      if (pos === index) {
        this.eraseNode(curNode);
        return true;
      }
      ++index;
      return false;
    });
  }
  eraseElementByValue(value: T) {
    if (this.empty()) return;

    const curNode = this.findElementPos(this.root, value);
    if (
      curNode === undefined ||
      curNode.key === undefined ||
      this.cmp(curNode.key, value) !== 0
    ) {
      return;
    }

    this.eraseNode(curNode);
  }
  eraseElementByIterator(iter: ContainerIterator<T, TreeNode<T, undefined>>) {
    // @ts-ignore
    const node = iter.node;
    iter = iter.next();
    this.eraseNode(node);
    return iter;
  }
  /**
   * Inserts element to Set.
   */
  insert(element: T) {
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
  find(element: T) {
    const curNode = this.findElementPos(this.root, element);
    if (curNode !== undefined && curNode.key !== undefined) {
      return new OrderedSetIterator(curNode, this.header);
    }
    return this.end();
  }
  /**
   * @return An iterator to the first element not less than the given key.
   */
  lowerBound(key: T) {
    const resNode = this._lowerBound(this.root, key);
    return resNode === undefined
      ? this.end()
      : new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element greater than the given key.
   */
  upperBound(key: T) {
    const resNode = this._upperBound(this.root, key);
    return resNode === undefined
      ? this.end()
      : new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element not greater than the given key.
   */
  reverseLowerBound(key: T) {
    const resNode = this._reverseLowerBound(this.root, key);
    return resNode === undefined
      ? this.end()
      : new OrderedSetIterator(resNode, this.header);
  }
  /**
   * @return An iterator to the first element less than the given key.
   */
  reverseUpperBound(key: T) {
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
  union(other: OrderedSet<T>) {
    other.forEach((element) => this.insert(element));
  }
  /**
   * @return The height of the RB-tree.
   */
  getHeight() {
    if (this.empty()) return 0;
    const traversal: (
      curNode: TreeNode<T, undefined> | undefined
    ) => number = (curNode: TreeNode<T, undefined> | undefined) => {
      if (!curNode) return 1;
      return (
        Math.max(
          traversal(curNode.leftChild),
          traversal(curNode.rightChild)
        ) + 1
      );
    };
    return traversal(this.root);
  }
  [Symbol.iterator]() {
    return this.iterationFunc(this.root);
  }
}

export default OrderedSet;
