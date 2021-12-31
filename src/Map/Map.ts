import { TreeNode, MapIterator } from "../Base/Tree";
import { BaseType, MapIteratorType, Pair } from "../Base/Base";

export type MapType<T, K> = {
    begin: () => MapIteratorType<T, K>;
    end: () => MapIteratorType<T, K>;
    rBegin: () => MapIteratorType<T, K>;
    rEnd: () => MapIteratorType<T, K>;
    front: () => Pair<T, K> | undefined;
    back: () => Pair<T, K> | undefined;
    forEach: (callback: (element: Pair<T, K>, index: number) => void) => void;
    find: (element: T) => boolean;
    lowerBound: (key: T) => Pair<T, K> | undefined;
    upperBound: (key: T) => Pair<T, K> | undefined;
    getElementByPos: (pos: number) => Pair<T, K>;
    getElementByKey: (key: T) => K | undefined;
    setElement: (key: T, value: K) => void;
    eraseElementByPos: (pos: number) => void;
    eraseElementByKey: (key: T) => void;
    union: (other: MapType<T, K>) => void;
    getHeight: () => number;
    [Symbol.iterator]: () => Generator<Pair<T, K>, void, undefined>;
} & BaseType;

function Map<T, K>(this: MapType<T, K>, container: { forEach: (callback: (element: Pair<T, K>) => void) => void } = [], cmp: (x: T, y: T) => number) {
    cmp = cmp || ((x, y) => {
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
    });

    let len = 0;
    let root = new TreeNode<T, K>();
    root.color = TreeNode.TreeNodeColorType.black;
    const header = new TreeNode<T, K>();
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
        root.key = root.value = undefined;
        root.leftChild = root.rightChild = root.brother = undefined;
        header.leftChild = header.rightChild = undefined;
    };

    this.begin = function () {
        return new MapIterator(header.leftChild || header);
    }

    this.end = function () {
        return new MapIterator(header);
    }

    this.rBegin = function () {
        return new MapIterator(header.rightChild || header);
    }

    this.rEnd = function () {
        return new MapIterator(header);
    }

    const findSubTreeMinNode: (curNode: TreeNode<T, K>) => TreeNode<T, K> = function (curNode: TreeNode<T, K>) {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
        return curNode.leftChild ? findSubTreeMinNode(curNode.leftChild) : curNode;
    };

    const findSubTreeMaxNode: (curNode: TreeNode<T, K>) => TreeNode<T, K> = function (curNode: TreeNode<T, K>) {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
        return curNode.rightChild ? findSubTreeMaxNode(curNode.rightChild) : curNode;
    };

    this.front = function () {
        if (this.empty()) return undefined;
        const minNode = header.leftChild;
        if (!minNode || minNode.key === undefined || minNode.value === undefined) throw new Error("unknown error");
        return {
            key: minNode.key,
            value: minNode.value
        };
    };

    this.back = function () {
        if (this.empty()) return undefined;
        const maxNode = header.rightChild;
        if (!maxNode || maxNode.key === undefined || maxNode.value === undefined) throw new Error("unknown error");
        return {
            key: maxNode.key,
            value: maxNode.value
        };
    };

    this.forEach = function (callback: (element: Pair<T, K>, index: number) => void) {
        let index = 0;
        for (const pair of this) callback(pair, index++);
    };

    this.getElementByPos = function (pos: number) {
        if (pos < 0 || pos >= this.size()) throw new Error("pos must more than 0 and less than set's size");
        let index = 0;
        for (const pair of this) {
            if (index === pos) return pair;
            ++index;
        }
        throw new Error("unknown Error");
    };

    const _lowerBound: (curNode: TreeNode<T, K> | undefined, key: T) => Pair<T, K> | undefined = function (curNode: TreeNode<T, K> | undefined, key: T) {
        if (!curNode || curNode.key === undefined || curNode.value === undefined) return undefined;
        const cmpResult = cmp(curNode.key, key);
        if (cmpResult === 0) return { key: curNode.key, value: curNode.value };
        if (cmpResult < 0) return _lowerBound(curNode.rightChild, key);
        return _lowerBound(curNode.leftChild, key) || {
            key: curNode.key,
            value: curNode.value
        };
    };

    this.lowerBound = function (key: T) {
        return _lowerBound(root, key);
    };

    const _upperBound: (curNode: TreeNode<T, K> | undefined, key: T) => Pair<T, K> | undefined = function (curNode: TreeNode<T, K> | undefined, key: T) {
        if (!curNode || curNode.key === undefined || curNode.value === undefined) return undefined;
        const cmpResult = cmp(curNode.key, key);
        if (cmpResult <= 0) return _upperBound(curNode.rightChild, key);
        return _upperBound(curNode.leftChild, key) || {
            key: curNode.key,
            value: curNode.value
        };
    };

    this.upperBound = function (key: T) {
        return _upperBound(root, key);
    };

    const eraseNodeSelfBalance = function (curNode: TreeNode<T, K>) {
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

    const eraseNode = function (curNode: TreeNode<T, K>) {
        let swapNode: TreeNode<T, K> = curNode;
        while (swapNode.leftChild || swapNode.rightChild) {
            if (swapNode.rightChild) {
                swapNode = findSubTreeMinNode(swapNode.rightChild);
                const tmpKey = curNode.key;
                curNode.key = swapNode.key;
                swapNode.key = tmpKey;
                const tmpValue = curNode.value;
                curNode.value = swapNode.value;
                swapNode.value = tmpValue;
                curNode = swapNode;
            }
            if (swapNode.leftChild) {
                swapNode = findSubTreeMaxNode(swapNode.leftChild);
                const tmpKey = curNode.key;
                curNode.key = swapNode.key;
                swapNode.key = tmpKey;
                const tmpValue = curNode.value;
                curNode.value = swapNode.value;
                swapNode.value = tmpValue;
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

    const inOrderTraversal: (curNode: TreeNode<T, K> | undefined, callback: (curNode: TreeNode<T, K>) => boolean) => boolean = function (curNode: TreeNode<T, K> | undefined, callback: (curNode: TreeNode<T, K>) => boolean) {
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

    this.eraseElementByKey = function (key: T) {
        if (this.empty()) return;

        const curNode = findElementPos(root, key);
        if (curNode === undefined || curNode.key === undefined || cmp(curNode.key, key) !== 0) return;

        eraseNode(curNode);
    };

    const findInsertPos: (curNode: TreeNode<T, K>, element: T) => TreeNode<T, K> = function (curNode: TreeNode<T, K>, element: T) {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
        const cmpResult = cmp(element, curNode.key);
        if (cmpResult < 0) {
            if (!curNode.leftChild) {
                curNode.leftChild = new TreeNode<T, K>();
                curNode.leftChild.parent = curNode;
                curNode.leftChild.brother = curNode.rightChild;
                if (curNode.rightChild) curNode.rightChild.brother = curNode.leftChild;
                return curNode.leftChild;
            }
            return findInsertPos(curNode.leftChild, element);
        } else if (cmpResult > 0) {
            if (!curNode.rightChild) {
                curNode.rightChild = new TreeNode<T, K>();
                curNode.rightChild.parent = curNode;
                curNode.rightChild.brother = curNode.leftChild;
                if (curNode.leftChild) curNode.leftChild.brother = curNode.rightChild;
                return curNode.rightChild;
            }
            return findInsertPos(curNode.rightChild, element);
        }
        return curNode;
    };

    const insertNodeSelfBalance = function (curNode: TreeNode<T, K>) {
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

    this.setElement = function (key: T, value: K) {
        if (key === null || key === undefined) {
            throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
        }

        if (value === null || value === undefined) {
            this.eraseElementByKey(key);
            return;
        }

        if (this.empty()) {
            ++len;
            root.key = key;
            root.value = value;
            root.color = TreeNode.TreeNodeColorType.black;
            header.leftChild = root;
            header.rightChild = root;
            return;
        }

        const curNode = findInsertPos(root, key);
        if (curNode.key !== undefined && cmp(curNode.key, key) === 0) {
            curNode.value = value;
            return;
        }

        ++len;
        curNode.key = key;
        curNode.value = value;

        if (header.leftChild === undefined || header.leftChild.key === undefined || cmp(header.leftChild.key, key) > 0) {
            header.leftChild = curNode;
        }
        if (header.rightChild === undefined || header.rightChild.key === undefined || cmp(header.rightChild.key, key) < 0) {
            header.rightChild = curNode;
        }

        insertNodeSelfBalance(curNode);
        root.color = TreeNode.TreeNodeColorType.black;
    };

    const findElementPos: (curNode: TreeNode<T, K> | undefined, element: T) => TreeNode<T, K> | undefined = function (curNode: TreeNode<T, K> | undefined, element: T) {
        if (!curNode || curNode.key === undefined) return undefined;
        const cmpResult = cmp(element, curNode.key);
        if (cmpResult < 0) return findElementPos(curNode.leftChild, element);
        else if (cmpResult > 0) return findElementPos(curNode.rightChild, element);
        return curNode;
    };

    this.find = function (element: T) {
        return !!findElementPos(root, element);
    };

    this.getElementByKey = function (element: T) {
        const curNode = findElementPos(root, element);
        if (curNode?.key === undefined || curNode?.value === undefined) throw new Error("unknown error");
        return curNode.value;
    };

    // waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
    // (https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations)
    this.union = function (other: MapType<T, K>) {
        other.forEach(({ key, value }) => this.setElement(key, value));
    };

    this.getHeight = function () {
        if (this.empty()) return 0;
        const traversal: (curNode: TreeNode<T, K> | undefined) => number = function (curNode: TreeNode<T, K> | undefined) {
            if (!curNode) return 1;
            return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
        };
        return traversal(root);
    };

    const iterationFunc: (curNode: TreeNode<T, K> | undefined) => Generator<Pair<T, K>, void, undefined> = function* (curNode: TreeNode<T, K> | undefined) {
        if (!curNode || curNode.key === undefined || curNode.value === undefined) return;
        yield* iterationFunc(curNode.leftChild);
        yield { key: curNode.key, value: curNode.value };
        yield* iterationFunc(curNode.rightChild);
    };

    this[Symbol.iterator] = function () {
        return iterationFunc(root);
    };

    container.forEach(({ key, value }) => this.setElement(key, value));

    Object.freeze(this);
}

Object.freeze(Map);

export default (Map as unknown as { new<T, K>(container?: { forEach: (callback: (element: Pair<T, K>) => void) => void }, cmp?: (x: T, y: T) => number): MapType<T, K> });
