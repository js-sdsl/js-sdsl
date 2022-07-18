import { ContainerIterator, Base, Pair, initContainer } from "../Base/Base";
import { TreeIterator, TreeNode } from "../Base/Tree";

class OrderedMap<K, V> implements Base {
    private length = 0;
    private root: TreeNode<K, V> = new TreeNode<K, V>();
    private header: TreeNode<K, V> = new TreeNode<K, V>();
    private cmp: (x: K, y: K) => number;

    constructor(container: initContainer<Pair<K, V>> = [], cmp?: (x: K, y: K) => number) {
        this.root.color = TreeNode.TreeNodeColorType.black;
        this.header.parent = this.root;
        this.root.parent = this.header;
        this.cmp = cmp ?? ((x: K, y: K) => {
            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
        });
        this.iterationFunc = this.iterationFunc.bind(this);
        container.forEach(({ key, value }) => this.setElement(key, value));
    }

    private findSubTreeMinNode: (curNode: TreeNode<K, V>) => TreeNode<K, V> = (curNode: TreeNode<K, V>) => {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
        return curNode.leftChild ? this.findSubTreeMinNode(curNode.leftChild) : curNode;
    }
    private findSubTreeMaxNode: (curNode: TreeNode<K, V>) => TreeNode<K, V> = (curNode: TreeNode<K, V>) => {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
        return curNode.rightChild ? this.findSubTreeMaxNode(curNode.rightChild) : curNode;
    }
    private _lowerBound: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (!curNode || curNode.key === undefined) return undefined;
        const cmpResult = this.cmp(curNode.key, key);
        if (cmpResult === 0) return curNode;
        if (cmpResult < 0) return this._lowerBound(curNode.rightChild, key);
        const resNode = this._lowerBound(curNode.leftChild, key);
        if (resNode === undefined) return curNode;
        return resNode;
    }
    private _upperBound: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (!curNode || curNode.key === undefined) return undefined;
        const cmpResult = this.cmp(curNode.key, key);
        if (cmpResult <= 0) return this._upperBound(curNode.rightChild, key);
        const resNode = this._upperBound(curNode.leftChild, key);
        if (resNode === undefined) return curNode;
        return resNode;
    }
    private _reverseLowerBound: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (!curNode || curNode.key === undefined) return undefined;
        const cmpResult = this.cmp(curNode.key, key);
        if (cmpResult === 0) return curNode;
        if (cmpResult > 0) return this._reverseLowerBound(curNode.leftChild, key);
        const resNode = this._reverseLowerBound(curNode.rightChild, key);
        if (resNode === undefined) return curNode;
        return resNode;
    }
    private _reverseUpperBound: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (!curNode || curNode.key === undefined) return undefined;
        const cmpResult = this.cmp(curNode.key, key);
        if (cmpResult >= 0) return this._reverseUpperBound(curNode.leftChild, key);
        const resNode = this._reverseUpperBound(curNode.rightChild, key);
        if (resNode === undefined) return curNode;
        return resNode;
    }
    private eraseNodeSelfBalance(curNode: TreeNode<K, V>) {
        const parentNode = curNode.parent;
        if (!parentNode || parentNode === this.header) {
            if (curNode === this.root) return;
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
    private eraseNode(curNode: TreeNode<K, V>) {
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

        if (swapNode.key === undefined) throw new Error("unknown error");
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
    private inOrderTraversal: (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => boolean = (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => {
        if (!curNode || curNode.key === undefined) return false;
        const ifReturn = this.inOrderTraversal(curNode.leftChild, callback);
        if (ifReturn) return true;
        if (callback(curNode)) return true;
        return this.inOrderTraversal(curNode.rightChild, callback);
    }
    private findInsertPos: (curNode: TreeNode<K, V>, key: K) => TreeNode<K, V> = (curNode: TreeNode<K, V>, key: K) => {
        if (!curNode || curNode.key === undefined) throw new Error("unknown error");
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
    }
    private insertNodeSelfBalance(curNode: TreeNode<K, V>) {
        const parentNode = curNode.parent;
        if (!parentNode || parentNode === this.header) {
            if (curNode === this.root) return;
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
    private findElementPos: (curNode: TreeNode<K, V> | undefined, key: K) => TreeNode<K, V> | undefined = (curNode: TreeNode<K, V> | undefined, key: K) => {
        if (!curNode || curNode.key === undefined) return undefined;
        const cmpResult = this.cmp(key, curNode.key);
        if (cmpResult < 0) return this.findElementPos(curNode.leftChild, key);
        else if (cmpResult > 0) return this.findElementPos(curNode.rightChild, key);
        return curNode;
    }
    private iterationFunc: (curNode: TreeNode<K, V> | undefined) => Generator<Pair<K, V>, void, undefined> = function* (this: OrderedMap<K, V>, curNode: TreeNode<K, V> | undefined) {
        if (!curNode || curNode.key === undefined || curNode.value === undefined) return;
        yield* this.iterationFunc(curNode.leftChild);
        yield { key: curNode.key, value: curNode.value };
        yield* this.iterationFunc(curNode.rightChild);
    }

    size() { return this.length; }
    empty() { return this.length === 0; }
    clear() {
        this.length = 0;
        this.root.key = this.root.value = undefined;
        this.root.leftChild = this.root.rightChild = this.root.brother = undefined;
        this.header.leftChild = this.header.rightChild = undefined;
    }
    /**
     * @return Iterator pointing to the begin element.
     */
    begin() {
        return new TreeIterator(this.header.leftChild || this.header, this.header);
    }
    /**
     * @return Iterator pointing to the super end like c++.
     */
    end() {
        return new TreeIterator(this.header, this.header);
    }
    /**
     * @return Iterator pointing to the end element.
     */
    rBegin() {
        return new TreeIterator(this.header.rightChild || this.header, this.header);
    }
    /**
     * @return Iterator pointing to the super begin like c++.
     */
    rEnd() {
        return new TreeIterator(this.header, this.header);
    }
    /**
     * @return The first element.
     */
    front() {
        if (this.empty()) return undefined;
        const minNode = this.header.leftChild;
        if (!minNode || minNode.key === undefined || minNode.value === undefined) throw new Error("unknown error");
        return {
            key: minNode.key,
            value: minNode.value
        };
    }
    /**
     * @return The last element.
     */
    back() {
        if (this.empty()) return undefined;
        const maxNode = this.header.rightChild;
        if (!maxNode || maxNode.key === undefined || maxNode.value === undefined) throw new Error("unknown error");
        return {
            key: maxNode.key,
            value: maxNode.value
        };
    }
    forEach(callback: (element: Pair<K, V>, index: number) => void) {
        let index = 0;
        for (const pair of this) callback(pair, index++);
    }
    /**
     * Gets the key and value of the element at the specified position.
     */
    getElementByPos(pos: number) {
        if (pos < 0 || pos >= this.size()) throw new Error("pos must more than 0 and less than set's size");
        let index = 0;
        for (const pair of this) {
            if (index === pos) return pair;
            ++index;
        }
        throw new Error("unknown Error");
    }
    /**
     * @return An iterator to the first element not less than the given key.
     */
    lowerBound(key: K) {
        const resNode = this._lowerBound(this.root, key);
        return resNode === undefined ? this.end() : new TreeIterator(resNode, this.header);
    }
    /**
     * @return An iterator to the first element greater than the given key.
     */
    upperBound(key: K) {
        const resNode = this._upperBound(this.root, key);
        return resNode === undefined ? this.end() : new TreeIterator(resNode, this.header);
    }
    /**
     * @return An iterator to the first element not greater than the given key.
     */
    reverseLowerBound(key: K) {
        const resNode = this._reverseLowerBound(this.root, key);
        return resNode === undefined ? this.end() : new TreeIterator(resNode, this.header);
    }
    /**
     * @return An iterator to the first element less than the given key.
     */
    reverseUpperBound(key: K) {
        const resNode = this._reverseUpperBound(this.root, key);
        return resNode === undefined ? this.end() : new TreeIterator(resNode, this.header);
    }
    /**
     * Removes the elements at the specified position.
     */
    eraseElementByPos(pos: number) {
        if (pos < 0 || pos >= this.length) throw new Error("pos must more than 0 and less than set's size");
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

        const curNode = this.findElementPos(this.root, key);
        if (curNode === undefined || curNode.key === undefined || this.cmp(curNode.key, key) !== 0) return;

        this.eraseNode(curNode);
    }
    /**
     * @return An iterator point to the next iterator.
     * Removes element by iterator.
     */
    eraseElementByIterator(iter: ContainerIterator<Pair<K, V>>) {
        const nextIter = iter.next();
        // @ts-ignore
        this.eraseNode(iter.node);
        iter = nextIter;
        return iter;
    }
    /**
     * Insert a new key-value pair or set value by key.
     */
    setElement(key: K, value: V) {
        if (key === null || key === undefined) {
            throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
        }

        if (value === null || value === undefined) {
            this.eraseElementByKey(key);
            return;
        }

        if (this.empty()) {
            ++this.length;
            this.root.key = key;
            this.root.value = value;
            this.root.color = TreeNode.TreeNodeColorType.black;
            this.header.leftChild = this.root;
            this.header.rightChild = this.root;
            return;
        }

        const curNode = this.findInsertPos(this.root, key);
        if (curNode.key !== undefined && this.cmp(curNode.key, key) === 0) {
            curNode.value = value;
            return;
        }

        ++this.length;
        curNode.key = key;
        curNode.value = value;

        if (this.header.leftChild === undefined || this.header.leftChild.key === undefined || this.cmp(this.header.leftChild.key, key) > 0) {
            this.header.leftChild = curNode;
        }
        if (this.header.rightChild === undefined || this.header.rightChild.key === undefined || this.cmp(this.header.rightChild.key, key) < 0) {
            this.header.rightChild = curNode;
        }

        this.insertNodeSelfBalance(curNode);
        this.root.color = TreeNode.TreeNodeColorType.black;
    }
    /**
     * @param element The element you want to find.
     * @return Iterator pointing to the element if found, or super end if not found.
     */
    find(key: K) {
        const curNode = this.findElementPos(this.root, key);
        if (curNode === undefined || curNode.key === undefined) return this.end();
        return new TreeIterator(curNode, this.header);
    }
    /**
     * Gets the value of the element of the specified key.
     */
    getElementByKey(key: K) {
        const curNode = this.findElementPos(this.root, key);
        if (curNode?.key === undefined || curNode?.value === undefined) throw new Error("unknown error");
        return curNode.value;
    }
    /**
     * Union the other Set to self.
     * waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
     * More information => https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations
     */
    union(other: OrderedMap<K, V>) {
        other.forEach(({ key, value }) => this.setElement(key, value));
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
    /**
     * Using for 'for...of' syntax like Array.
     */
    [Symbol.iterator]() {
        return this.iterationFunc(this.root);
    }
}

export default OrderedMap;
