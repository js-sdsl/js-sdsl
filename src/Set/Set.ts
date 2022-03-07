import { TreeNode, TreeIterator } from "../Base/Tree";
import { ContainerIterator, ContainerType } from "../Base/Base";

export type SetType<T> = {
    insert: (element: T) => void;
    lowerBound: (key: T) => ContainerIterator<T>;
    upperBound: (key: T) => ContainerIterator<T>;
    reverseLowerBound: (key: T) => ContainerIterator<T>;
    reverseUpperBound: (key: T) => ContainerIterator<T>;
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
    let root = new TreeNode<T, undefined>();
    root.color = TreeNode.TreeNodeColorType.black;
    const header = new TreeNode<T, undefined>();
    header.parent = root;
    root.parent = header;

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        root.key = undefined;
        root.leftChild = root.rightChild = root.brother = undefined;
        header.leftChild = header.rightChild = undefined;
    };

    this.begin = function () {
        return new TreeIterator(header, 'begin');
    };

    this.end = function () {
        return new TreeIterator(header, 'end');
    };

    const findSubTreeMinNode: (curNode: TreeNode<T, undefined>) => TreeNode<T, undefined> = function (curNode: TreeNode<T, undefined>) {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
        return curNode.leftChild ? findSubTreeMinNode(curNode.leftChild) : curNode;
    };

    const findSubTreeMaxNode: (curNode: TreeNode<T, undefined>) => TreeNode<T, undefined> = function (curNode: TreeNode<T, undefined>) {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
        return curNode.rightChild ? findSubTreeMaxNode(curNode.rightChild) : curNode;
    };

    this.front = function () {
        return header.leftChild?.key;
    };

    this.back = function () {
        return header.rightChild?.key;
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        let index = 0;
        for (const element of this) callback(element, index++);
    };

    this.getElementByPos = function (pos: number) {
        if (pos < 0 || pos >= this.size()) throw new Error("pos must more than 0 and less than set's size");
        let index = 0;
        for (const element of this) {
            if (index === pos) return element;
            ++index;
        }
        throw new Error("unknown error");
    };

    const eraseNodeSelfBalance = function (curNode: TreeNode<T, undefined>) {
        const parentNode = curNode.parent;
        if (!parentNode || parentNode === header) {
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
                if (root === parentNode) {
                    root = newRoot;
                    header.parent = root;
                    root.parent = header;
                }
                eraseNodeSelfBalance(curNode);
            } else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                if (brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = parentNode.color;
                    parentNode.color = TreeNode.TreeNodeColorType.black;
                    if (brotherNode.rightChild) brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = parentNode.rotateLeft();
                    if (root === parentNode) {
                        root = newRoot;
                        header.parent = root;
                        root.parent = header;
                    }
                    curNode.color = TreeNode.TreeNodeColorType.black;
                } else if ((!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    if (brotherNode.leftChild) brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = brotherNode.rotateRight();
                    if (root === brotherNode) {
                        root = newRoot;
                        header.parent = root;
                        root.parent = header;
                    }
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
                if (root === parentNode) {
                    root = newRoot;
                    header.parent = root;
                    root.parent = header;
                }
                eraseNodeSelfBalance(curNode);
            } else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                if (brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = parentNode.color;
                    parentNode.color = TreeNode.TreeNodeColorType.black;
                    if (brotherNode.leftChild) brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = parentNode.rotateRight();
                    if (root === parentNode) {
                        root = newRoot;
                        header.parent = root;
                        root.parent = header;
                    }
                    curNode.color = TreeNode.TreeNodeColorType.black;
                } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    if (brotherNode.rightChild) brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                    const newRoot = brotherNode.rotateLeft();
                    if (root === brotherNode) {
                        root = newRoot;
                        header.parent = root;
                        root.parent = header;
                    }
                    eraseNodeSelfBalance(curNode);
                } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                    brotherNode.color = TreeNode.TreeNodeColorType.red;
                    eraseNodeSelfBalance(parentNode);
                }
            }
        }
    };

    const eraseNode = function (curNode: TreeNode<T, undefined>) {
        let swapNode: TreeNode<T, undefined> = curNode;
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

        if (swapNode.key === undefined) throw new Error("unknown error");
        if (header.leftChild && header.leftChild.key !== undefined && cmp(header.leftChild.key, swapNode.key) === 0) {
            if (header.leftChild !== root) header.leftChild = header.leftChild?.parent;
            else if (header.leftChild?.rightChild) header.leftChild = header.leftChild?.rightChild;
            else header.leftChild = undefined;
        }
        if (header.rightChild && header.rightChild.key !== undefined && cmp(header.rightChild.key, swapNode.key) === 0) {
            if (header.rightChild !== root) header.rightChild = header.rightChild?.parent;
            else if (header.rightChild?.leftChild) header.rightChild = header.rightChild?.leftChild;
            else header.rightChild = undefined;
        }

        eraseNodeSelfBalance(swapNode);
        if (swapNode) swapNode.remove();
        --len;
        root.color = TreeNode.TreeNodeColorType.black;
    };

    const inOrderTraversal: (curNode: TreeNode<T, undefined> | undefined, callback: (curNode: TreeNode<T, undefined>) => boolean) => boolean = function (curNode: TreeNode<T, undefined> | undefined, callback: (curNode: TreeNode<T, undefined>) => boolean) {
        if (!curNode || curNode.key === undefined) return false;
        const ifReturn = inOrderTraversal(curNode.leftChild, callback);
        if (ifReturn) return true;
        if (callback(curNode)) return true;
        return inOrderTraversal(curNode.rightChild, callback);
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
        if (curNode === undefined || curNode.key === undefined || cmp(curNode.key, value) !== 0) return;

        eraseNode(curNode);
    };

    const findInsertPos: (curNode: TreeNode<T, undefined>, element: T) => TreeNode<T, undefined> = function (curNode: TreeNode<T, undefined>, element: T) {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
        const cmpResult = cmp(element, curNode.key);
        if (cmpResult < 0) {
            if (!curNode.leftChild) {
                curNode.leftChild = new TreeNode<T, undefined>();
                curNode.leftChild.parent = curNode;
                curNode.leftChild.brother = curNode.rightChild;
                if (curNode.rightChild) curNode.rightChild.brother = curNode.leftChild;
                return curNode.leftChild;
            }
            return findInsertPos(curNode.leftChild, element);
        } else if (cmpResult > 0) {
            if (!curNode.rightChild) {
                curNode.rightChild = new TreeNode<T, undefined>();
                curNode.rightChild.parent = curNode;
                curNode.rightChild.brother = curNode.leftChild;
                if (curNode.leftChild) curNode.leftChild.brother = curNode.rightChild;
                return curNode.rightChild;
            }
            return findInsertPos(curNode.rightChild, element);
        }
        return curNode;
    };

    const insertNodeSelfBalance = function (curNode: TreeNode<T, undefined>) {
        const parentNode = curNode.parent;
        if (!parentNode || parentNode === header) {
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
                        if (grandParent === root) {
                            root = newRoot;
                            header.parent = root;
                            root.parent = header;
                        }
                    } else if (curNode === parentNode.rightChild) {
                        const newRoot = parentNode.rotateLeft();
                        if (parentNode === root) {
                            root = newRoot;
                            header.parent = root;
                            root.parent = header;
                        }
                        insertNodeSelfBalance(parentNode);
                    }
                } else if (parentNode === grandParent.rightChild) {
                    if (curNode === parentNode.leftChild) {
                        const newRoot = parentNode.rotateRight();
                        if (parentNode === root) {
                            root = newRoot;
                            header.parent = root;
                            root.parent = header;
                        }
                        insertNodeSelfBalance(parentNode);
                    } else if (curNode === parentNode.rightChild) {
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        grandParent.color = TreeNode.TreeNodeColorType.red;
                        const newRoot = grandParent.rotateLeft();
                        if (grandParent === root) {
                            root = newRoot;
                            header.parent = root;
                            root.parent = header;
                        }
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
            header.leftChild = root;
            header.rightChild = root;
            return;
        }

        const curNode = findInsertPos(root, element);
        if (curNode.key !== undefined && cmp(curNode.key, element) === 0) return;

        ++len;
        curNode.key = element;

        if (header.leftChild === undefined || header.leftChild.key === undefined || cmp(header.leftChild.key, element) > 0) {
            header.leftChild = curNode;
        }
        if (header.rightChild === undefined || header.rightChild.key === undefined || cmp(header.rightChild.key, element) < 0) {
            header.rightChild = curNode;
        }

        insertNodeSelfBalance(curNode);
        root.color = TreeNode.TreeNodeColorType.black;
    };

    const findElementPos: (curNode: TreeNode<T, undefined> | undefined, element: T) => TreeNode<T, undefined> | undefined = function (curNode: TreeNode<T, undefined> | undefined, element: T) {
        if (!curNode || curNode.key === undefined) return undefined;
        const cmpResult = cmp(element, curNode.key);
        if (cmpResult < 0) return findElementPos(curNode.leftChild, element);
        else if (cmpResult > 0) return findElementPos(curNode.rightChild, element);
        return curNode;
    };

    this.find = function (element: T) {
        const curNode = findElementPos(root, element);
        if (curNode !== undefined && curNode.key !== undefined) return new TreeIterator(curNode);
        return this.end();
    };

    const _lowerBound: (curNode: TreeNode<T, undefined> | undefined, key: T) => ContainerIterator<T> = (curNode: TreeNode<T, undefined> | undefined, key: T) => {
        if (!curNode || curNode.key === undefined) return this.end();
        const cmpResult = cmp(curNode.key, key);
        if (cmpResult === 0) return new TreeIterator(curNode);
        if (cmpResult < 0) return _lowerBound(curNode.rightChild, key);
        const iter = _lowerBound(curNode.leftChild, key);
        if (iter.equals(this.end())) return new TreeIterator(curNode);
        return iter;
    };

    this.lowerBound = function (key: T) {
        return _lowerBound(root, key);
    };

    const _upperBound: (curNode: TreeNode<T, undefined> | undefined, key: T) => ContainerIterator<T> = (curNode: TreeNode<T, undefined> | undefined, key: T) => {
        if (!curNode || curNode.key === undefined) return this.end();
        const cmpResult = cmp(curNode.key, key);
        if (cmpResult <= 0) return _upperBound(curNode.rightChild, key);
        const iter = _upperBound(curNode.leftChild, key);
        if (iter.equals(this.end())) return new TreeIterator(curNode);
        return iter;
    };

    this.upperBound = function (key: T) {
        return _upperBound(root, key);
    };

    const _reverseLowerBound: (curNode: TreeNode<T, undefined> | undefined, key: T) => ContainerIterator<T> = (curNode: TreeNode<T, undefined> | undefined, key: T) => {
        if (!curNode || curNode.key === undefined) return this.end();
        const cmpResult = cmp(curNode.key, key);
        if (cmpResult === 0) return new TreeIterator(curNode);
        if (cmpResult > 0) return _reverseLowerBound(curNode.leftChild, key);
        const iter = _reverseLowerBound(curNode.rightChild, key);
        if (iter.equals(this.end())) return new TreeIterator(curNode);
        return iter;
    };

    this.reverseLowerBound = function (key: T) {
        return _reverseLowerBound(root, key);
    };

    const _reverseUpperBound: (curNode: TreeNode<T, undefined> | undefined, key: T) => ContainerIterator<T> = (curNode: TreeNode<T, undefined> | undefined, key: T) => {
        if (!curNode || curNode.key === undefined) return this.end();
        const cmpResult = cmp(curNode.key, key);
        if (cmpResult >= 0) return _reverseUpperBound(curNode.leftChild, key);
        const iter = _reverseUpperBound(curNode.rightChild, key);
        if (iter.equals(this.end())) return new TreeIterator(curNode);
        return iter;
    };

    this.reverseUpperBound = function (key: T) {
        return _reverseUpperBound(root, key);
    };

    // waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
    // (https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations)
    this.union = function (other: SetType<T>) {
        other.forEach((element) => this.insert(element));
    };

    this.getHeight = function () {
        if (this.empty()) return 0;
        const traversal: (curNode: TreeNode<T, undefined> | undefined) => number = function (curNode: TreeNode<T, undefined> | undefined) {
            if (!curNode) return 1;
            return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
        };
        return traversal(root);
    };

    const iterationFunc: (curNode: TreeNode<T, undefined> | undefined) => Generator<T, void, undefined> = function* (curNode: TreeNode<T, undefined> | undefined) {
        if (!curNode || curNode.key === undefined) return;
        yield* iterationFunc(curNode.leftChild);
        yield curNode.key;
        yield* iterationFunc(curNode.rightChild);
    };

    this[Symbol.iterator] = function () {
        return iterationFunc(root);
    };

    container.forEach(element => this.insert(element));
}

export default (Set as unknown as { new<T>(container?: { forEach: (callback: (element: T) => void) => void }, cmp?: (x: T, y: T) => number): SetType<T> });
