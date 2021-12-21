import { BaseType } from "../Base/Base";

class TreeNode<T> {
    static TreeNodeColorType: { red: '0', black: '1' } = {
        red: '0',
        black: '1'
    };
    color: '0' | '1';
    value: T | null = null;
    parent: TreeNode<T> | null = null;
    brother: TreeNode<T> | null = null;
    leftChild: TreeNode<T> | null = null;
    rightChild: TreeNode<T> | null = null;

    constructor(element?: T) {
        if (element !== undefined) this.value = element;
        this.color = TreeNode.TreeNodeColorType.red;
    }

    rotateLeft() {
        const PP = this.parent;
        const PB = this.brother;
        const F = this.leftChild;
        const V = this.rightChild;
        if (!V) throw new Error("unknown error");
        const R = V.leftChild;
        const X = V.rightChild;

        if (PP) {
            if (PP.leftChild === this) PP.leftChild = V;
            else if (PP.rightChild === this) PP.rightChild = V;
        }

        V.parent = PP;
        V.brother = PB;
        V.leftChild = this;
        V.rightChild = X;

        if (PB) PB.brother = V;

        this.parent = V;
        this.brother = X;
        this.leftChild = F;
        this.rightChild = R;

        if (X) {
            X.parent = V;
            X.brother = this;
        }

        if (F) {
            F.parent = this;
            F.brother = R;
        }

        if (R) {
            R.parent = this;
            R.brother = F;
        }

        return V;
    }

    rotateRight() {
        const PP = this.parent;
        const PB = this.brother;
        const F = this.leftChild;
        if (!F) throw new Error("unknown error");
        const V = this.rightChild;
        const D = F.leftChild;
        const K = F.rightChild;

        if (PP) {
            if (PP.leftChild === this) PP.leftChild = F;
            else if (PP.rightChild === this) PP.rightChild = F;
        }

        F.parent = PP;
        F.brother = PB;
        F.leftChild = D;
        F.rightChild = this;

        if (PB) PB.brother = F;

        if (D) {
            D.parent = F;
            D.brother = this;
        }

        this.parent = F;
        this.brother = D;
        this.leftChild = K;
        this.rightChild = V;

        if (K) {
            K.parent = this;
            K.brother = V;
        }

        if (V) {
            V.parent = this;
            V.brother = K;
        }

        return F;
    }

    remove() {
        if (this.leftChild || this.rightChild) throw new Error("can only remove leaf node");
        if (this.parent) {
            if (this === this.parent.leftChild) this.parent.leftChild = null;
            else if (this === this.parent.rightChild) this.parent.rightChild = null;
        }
        if (this.brother) this.brother.brother = null;
        this.value = null;
        this.parent = null;
        this.brother = null;
    }
}

Object.freeze(TreeNode);

export type SetType<T> = {
    forEach: (callback: (element: T, index: number) => void) => void;
    insert: (element: T) => void;
    erase: (element: T) => void;
    find: (element: T) => boolean;
    union: (other: SetType<T>) => void;
    getHeight: () => number;
} & BaseType;

function Set<T>(this: SetType<T>, arr: T[] = [], cmp: (x: T, y: T) => number) {
    cmp = cmp || ((x, y) => {
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
    });

    let len = 0;
    let root = new TreeNode<T>();
    root.color = TreeNode.TreeNodeColorType.black;

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        root = new TreeNode<T>();
        root.color = TreeNode.TreeNodeColorType.black;
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        let index = 0;

        const inOrderTraversal = function (curNode: TreeNode<T> | null) {
            if (!curNode) return;
            inOrderTraversal(curNode.leftChild);
            if (curNode.value !== null) callback(curNode.value, index++);
            inOrderTraversal(curNode.rightChild);
        };

        inOrderTraversal(root);
    };

    const findInsertPos: (curNode: TreeNode<T>, element: T) => TreeNode<T> = function (curNode: TreeNode<T>, element: T) {
        if (!curNode || curNode.value === null) throw new Error("unknown error");
        const cmpResult = cmp(element, curNode.value);
        if (cmpResult < 0) {
            if (!curNode.leftChild) {
                curNode.leftChild = new TreeNode<T>();
                curNode.leftChild.parent = curNode;
                curNode.leftChild.brother = curNode.rightChild;
                if (curNode.rightChild) curNode.rightChild.brother = curNode.leftChild;
                return curNode.leftChild;
            }
            return findInsertPos(curNode.leftChild, element);
        } else if (cmpResult > 0) {
            if (!curNode.rightChild) {
                curNode.rightChild = new TreeNode<T>();
                curNode.rightChild.parent = curNode;
                curNode.rightChild.brother = curNode.leftChild;
                if (curNode.leftChild) curNode.leftChild.brother = curNode.rightChild;
                return curNode.rightChild;
            }
            return findInsertPos(curNode.rightChild, element);
        }
        return curNode;
    };

    const insertNodeSelfBalance = function (curNode: TreeNode<T>) {
        const parentNode = curNode.parent;
        if (!parentNode) {
            if (curNode === root) return;
            throw new Error("unknown error");
        }

        if (parentNode.color === TreeNode.TreeNodeColorType.black) return;

        if (parentNode.color === TreeNode.TreeNodeColorType.red) {
            const uncleNode = parentNode.brother;
            const grandParent = parentNode.parent;
            if (!grandParent) throw new Error("unknown error");

            if (uncleNode && uncleNode.color === TreeNode.TreeNodeColorType.red) {
                uncleNode.color = parentNode.color = TreeNode.TreeNodeColorType.black;
                grandParent.color = TreeNode.TreeNodeColorType.red;
                insertNodeSelfBalance(grandParent);
            } else if (!uncleNode || uncleNode.color === TreeNode.TreeNodeColorType.black) {
                if (parentNode === grandParent.leftChild) {
                    if (curNode === parentNode.leftChild) {
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        grandParent.color = TreeNode.TreeNodeColorType.red;
                        const newRoot = grandParent.rotateRight();
                        if (grandParent === root) root = newRoot;
                    } else if (curNode === parentNode.rightChild) {
                        const newRoot = parentNode.rotateLeft();
                        if (grandParent === root) root = newRoot;
                        insertNodeSelfBalance(parentNode);
                    }
                } else if (parentNode === grandParent.rightChild) {
                    if (curNode === parentNode.leftChild) {
                        const newRoot = parentNode.rotateRight();
                        if (grandParent === root) root = newRoot;
                        insertNodeSelfBalance(parentNode);
                    } else if (curNode === parentNode.rightChild) {
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        grandParent.color = TreeNode.TreeNodeColorType.red;
                        const newRoot = grandParent.rotateLeft();
                        if (grandParent === root) root = newRoot;
                    }
                }
            }
        }
    };

    this.insert = function (element: T) {
        if (this.empty()) {
            ++len;
            root.value = element;
            root.color = TreeNode.TreeNodeColorType.black;
            return;
        }

        const curNode = findInsertPos(root, element);
        if (curNode.value && cmp(curNode.value, element) === 0) return;

        ++len;
        curNode.value = element;

        insertNodeSelfBalance(curNode);
        root.color = TreeNode.TreeNodeColorType.black;
    };

    const eraseNodeSelfBalance = function (curNode: TreeNode<T>) {
        const parentNode = curNode.parent;
        if (!parentNode) {
            if (curNode === root) return;
            throw new Error("unknown error");
        }

        if (curNode.color === TreeNode.TreeNodeColorType.red) return;

        const brotherNode = curNode.brother;
        if (!brotherNode) {
            throw new Error("unknown error");
        }

        if (curNode === parentNode.leftChild) {
            if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
                brotherNode.color = TreeNode.TreeNodeColorType.black;
                parentNode.color = TreeNode.TreeNodeColorType.red;
                const newRoot = parentNode.rotateLeft();
                if (root === parentNode) root = newRoot;
                eraseNodeSelfBalance(curNode);
            } else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                if (brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = parentNode.color;
                    parentNode.color = TreeNode.TreeNodeColorType.black;
                    if (brotherNode.rightChild) brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = parentNode.rotateLeft();
                    if (root === parentNode) root = newRoot;
                } else if ((!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    if (brotherNode.leftChild) brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = brotherNode.rotateRight();
                    if (root === brotherNode) root = newRoot;
                    eraseNodeSelfBalance(curNode);
                } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    parentNode.color = TreeNode.TreeNodeColorType.black;
                }
            }
        } else if (curNode === parentNode.rightChild) {
            if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
                brotherNode.color = TreeNode.TreeNodeColorType.black;
                parentNode.color = TreeNode.TreeNodeColorType.red;
                const newRoot = parentNode.rotateRight();
                if (root === parentNode) root = newRoot;
                eraseNodeSelfBalance(curNode);
            } else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                if (brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = parentNode.color;
                    parentNode.color = TreeNode.TreeNodeColorType.black;
                    if (brotherNode.leftChild) brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = parentNode.rotateRight();
                    if (root === parentNode) root = newRoot;
                } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    if (brotherNode.rightChild) brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = brotherNode.rotateLeft();
                    if (root === brotherNode) root = newRoot;
                    eraseNodeSelfBalance(curNode);
                } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    parentNode.color = TreeNode.TreeNodeColorType.black;
                }
            }
        }
    };

    const findSubTreeMinNode: (curNode: TreeNode<T>) => TreeNode<T> = function (curNode: TreeNode<T>) {
        if (!curNode || curNode.value === null) throw new Error("unknown error");
        return curNode.leftChild ? findSubTreeMinNode(curNode.leftChild) : curNode;
    };

    const findSubTreeMaxNode: (curNode: TreeNode<T>) => TreeNode<T> = function (curNode: TreeNode<T>) {
        if (!curNode || curNode.value === null) throw new Error("unknown error");
        return curNode.rightChild ? findSubTreeMaxNode(curNode.rightChild) : curNode;
    };

    this.erase = function (element: T) {
        if (this.empty()) return;

        let curNode = findElementPos(root, element);
        if (curNode === null || curNode.value === null || cmp(curNode.value, element) !== 0) return;

        let swapNode: TreeNode<T> = curNode;
        while (swapNode.leftChild || swapNode.rightChild) {
            if (swapNode.rightChild) {
                swapNode = findSubTreeMinNode(swapNode.rightChild);
                const tmpValue = curNode.value;
                curNode.value = swapNode.value;
                swapNode.value = tmpValue;
                curNode = swapNode;
            }
            if (swapNode.leftChild) {
                swapNode = findSubTreeMaxNode(swapNode.leftChild);
                const tmpValue = curNode.value;
                curNode.value = swapNode.value;
                swapNode.value = tmpValue;
                curNode = swapNode;
            }
        }

        eraseNodeSelfBalance(swapNode);
        if (swapNode) swapNode.remove();
        --len;
        root.color = TreeNode.TreeNodeColorType.black;
    };

    const findElementPos: (curNode: TreeNode<T> | null, element: T) => TreeNode<T> | null = function (curNode: TreeNode<T> | null, element: T) {
        if (!curNode || curNode.value === null) return null;
        const cmpResult = cmp(element, curNode.value);
        if (cmpResult < 0) return findElementPos(curNode.leftChild, element);
        else if (cmpResult > 0) return findElementPos(curNode.rightChild, element);
        return curNode;
    };

    this.find = function (element: T) {
        const curNode = findElementPos(root, element);
        return curNode !== null && curNode.value !== null && cmp(curNode.value, element) === 0;
    };

    // waiting for optimization, this is O(mlogn) algorithm now, but we expect it be O(mlog(n/m+1)).
    // (https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations)
    this.union = function (other: SetType<T>) {
        other.forEach(element => this.insert(element));
    };

    this.getHeight = function () {
        if (this.empty()) return 0;
        const traversal: (curNode: TreeNode<T> | null) => number = function (curNode: TreeNode<T> | null) {
            if (!curNode) return 1;
            return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
        };
        return traversal(root);
    };

    arr.forEach(element => this.insert(element));

    Object.freeze(this);
}

export default (Set as any as { new<T>(arr?: T[], cmp?: (x: T, y: T) => number): SetType<T> });
