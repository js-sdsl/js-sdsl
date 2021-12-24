import TreeNode from "../Base/TreeNode";
import { ContainerType } from "../Base/Base";

export type SetType<T> = {
    insert: (element: T) => void;
    find: (element: T) => boolean;
    union: (other: SetType<T>) => void;
    getHeight: () => number;
} & ContainerType<T>;

function Set<T>(this: SetType<T>, container: { forEach: (callback: (element: T) => void) => void } = [], cmp: (x: T, y: T) => number) {
    cmp = cmp || ((x, y) => {
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
    });

    let len = 0;
    let root = new TreeNode<T, null>();
    root.color = TreeNode.TreeNodeColorType.black;

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        root.leftChild = root.rightChild = root.brother = root.parent = null;
        root.key = null;
        root.color = TreeNode.TreeNodeColorType.black;
    };

    const findSubTreeMinNode: (curNode: TreeNode<T, null>) => TreeNode<T, null> = function (curNode: TreeNode<T, null>) {
        if (!curNode || curNode.key === null) throw new Error("unknown error");
        return curNode.leftChild ? findSubTreeMinNode(curNode.leftChild) : curNode;
    };

    const findSubTreeMaxNode: (curNode: TreeNode<T, null>) => TreeNode<T, null> = function (curNode: TreeNode<T, null>) {
        if (!curNode || curNode.key === null) throw new Error("unknown error");
        return curNode.rightChild ? findSubTreeMaxNode(curNode.rightChild) : curNode;
    };

    this.front = function () {
        if (this.empty()) return undefined;
        const minNode = findSubTreeMinNode(root);
        if (minNode.key === null) return undefined;
        return minNode.key;
    };

    this.back = function () {
        if (this.empty()) return undefined;
        const maxNode = findSubTreeMaxNode(root);
        if (maxNode.key === null) return undefined;
        return maxNode.key;
    };

    const inOrderTraversal: (curNode: TreeNode<T, null> | null, callback: (curNode: TreeNode<T, null>) => boolean) => boolean = function (curNode: TreeNode<T, null> | null, callback: (curNode: TreeNode<T, null>) => boolean) {
        if (!curNode || curNode.key === null) return false;
        const ifReturn = inOrderTraversal(curNode.leftChild, callback);
        if (ifReturn) return true;
        if (callback(curNode)) return true;
        return inOrderTraversal(curNode.rightChild, callback);
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        let index = 0;
        inOrderTraversal(root, curNode => {
            if (curNode.key === null) throw new Error("unknown error");
            callback(curNode.key, index++);
            return false;
        });
    };

    this.getElementByPos = function (pos: number) {
        if (pos < 0 || pos >= this.size()) throw new Error("pos must more than 0 and less than set's size");
        let index = 0;
        let element = null;
        inOrderTraversal(root, curNode => {
            if (pos === index) {
                element = curNode.key;
                return true;
            }
            ++index;
            return false;
        });
        if (element === null) throw new Error("unknown error");
        return element;
    };

    const eraseNodeSelfBalance = function (curNode: TreeNode<T, null>) {
        const parentNode = curNode.parent;
        if (!parentNode) {
            if (curNode === root) return;
            throw new Error("unknown error");
        }

        if (curNode.color === TreeNode.TreeNodeColorType.red) {
            curNode.color = TreeNode.TreeNodeColorType.black;
            return;
        }

        const brotherNode = curNode.brother;
        if (!brotherNode) throw new Error("unknown error");

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
                    curNode.color = TreeNode.TreeNodeColorType.black;
                } else if ((!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    if (brotherNode.leftChild) brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = brotherNode.rotateRight();
                    if (root === brotherNode) root = newRoot;
                    eraseNodeSelfBalance(curNode);
                } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    eraseNodeSelfBalance(parentNode);
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
                    curNode.color = TreeNode.TreeNodeColorType.black;
                } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    if (brotherNode.rightChild) brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = brotherNode.rotateLeft();
                    if (root === brotherNode) root = newRoot;
                    eraseNodeSelfBalance(curNode);
                } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    eraseNodeSelfBalance(parentNode);
                }
            }
        }
    };

    const eraseNode = function (curNode: TreeNode<T, null>) {
        let swapNode: TreeNode<T, null> = curNode;
        while (swapNode.leftChild || swapNode.rightChild) {
            if (swapNode.rightChild) {
                swapNode = findSubTreeMinNode(swapNode.rightChild);
                const tmpKey = curNode.key;
                curNode.key = swapNode.key;
                swapNode.key = tmpKey;
                curNode = swapNode;
            }
            if (swapNode.leftChild) {
                swapNode = findSubTreeMaxNode(swapNode.leftChild);
                const tmpKey = curNode.key;
                curNode.key = swapNode.key;
                swapNode.key = tmpKey;
                curNode = swapNode;
            }
        }

        eraseNodeSelfBalance(swapNode);
        if (swapNode) swapNode.remove();
        --len;
        root.color = TreeNode.TreeNodeColorType.black;
    };

    this.eraseElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than set's size");
        let index = 0;
        inOrderTraversal(root, curNode => {
            if (pos === index) {
                eraseNode(curNode);
                return true;
            }
            ++index;
            return false;
        });
    };

    this.eraseElementByValue = function (value: T) {
        if (this.empty()) return;

        const curNode = findElementPos(root, value);
        if (curNode === null || curNode.key === null || cmp(curNode.key, value) !== 0) return;

        eraseNode(curNode);
    };

    const findInsertPos: (curNode: TreeNode<T, null>, element: T) => TreeNode<T, null> = function (curNode: TreeNode<T, null>, element: T) {
        if (!curNode || curNode.key === null) throw new Error("unknown error");
        const cmpResult = cmp(element, curNode.key);
        if (cmpResult < 0) {
            if (!curNode.leftChild) {
                curNode.leftChild = new TreeNode<T, null>();
                curNode.leftChild.parent = curNode;
                curNode.leftChild.brother = curNode.rightChild;
                if (curNode.rightChild) curNode.rightChild.brother = curNode.leftChild;
                return curNode.leftChild;
            }
            return findInsertPos(curNode.leftChild, element);
        } else if (cmpResult > 0) {
            if (!curNode.rightChild) {
                curNode.rightChild = new TreeNode<T, null>();
                curNode.rightChild.parent = curNode;
                curNode.rightChild.brother = curNode.leftChild;
                if (curNode.leftChild) curNode.leftChild.brother = curNode.rightChild;
                return curNode.rightChild;
            }
            return findInsertPos(curNode.rightChild, element);
        }
        return curNode;
    };

    const insertNodeSelfBalance = function (curNode: TreeNode<T, null>) {
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
        if (element === null || element === undefined) {
            throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
        }

        if (this.empty()) {
            ++len;
            root.key = element;
            root.color = TreeNode.TreeNodeColorType.black;
            return;
        }

        const curNode = findInsertPos(root, element);
        if (curNode.key && cmp(curNode.key, element) === 0) return;

        ++len;
        curNode.key = element;

        insertNodeSelfBalance(curNode);
        root.color = TreeNode.TreeNodeColorType.black;
    };

    const findElementPos: (curNode: TreeNode<T, null> | null, element: T) => TreeNode<T, null> | null = function (curNode: TreeNode<T, null> | null, element: T) {
        if (!curNode || curNode.key === null) return null;
        const cmpResult = cmp(element, curNode.key);
        if (cmpResult < 0) return findElementPos(curNode.leftChild, element);
        else if (cmpResult > 0) return findElementPos(curNode.rightChild, element);
        return curNode;
    };

    this.find = function (element: T) {
        const curNode = findElementPos(root, element);
        return curNode !== null && curNode.key !== null && cmp(curNode.key, element) === 0;
    };

    // waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
    // (https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations)
    this.union = function (other: SetType<T>) {
        other.forEach((element) => this.insert(element));
    };

    this.getHeight = function () {
        if (this.empty()) return 0;
        const traversal: (curNode: TreeNode<T, null> | null) => number = function (curNode: TreeNode<T, null> | null) {
            if (!curNode) return 1;
            return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
        };
        return traversal(root);
    };

    container.forEach(element => this.insert(element));

    Object.freeze(this);
}

Object.freeze(Set);

export default (Set as any as { new<T>(container?: { forEach: (callback: (element: T) => void) => void }, cmp?: (x: T, y: T) => number): SetType<T> });
