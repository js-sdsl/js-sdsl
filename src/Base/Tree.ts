import { Iterator, MapIteratorType } from "./Base";

class TreeNode<T, K> {
    static TreeNodeColorType: {
        red: true,
        black: false
    } = {
        red: true,
        black: false
    };
    color = true;
    key: T | undefined = undefined;
    value: K | undefined = undefined;
    parent: TreeNode<T, K> | undefined = undefined;
    brother: TreeNode<T, K> | undefined = undefined;
    leftChild: TreeNode<T, K> | undefined = undefined;
    rightChild: TreeNode<T, K> | undefined = undefined;

    constructor(key?: T, value?: K) {
        if (key !== undefined && value !== undefined) {
            this.key = key;
            this.value = value;
        }
    }

    rotateLeft() {
        const PP = this.parent;
        const PB = this.brother;
        const F = this.leftChild;
        const V = this.rightChild;
        if (!V) throw new Error("unknown error");
        const R = V.leftChild;
        const X = V.rightChild;

        if (PP && PP.key !== undefined) {
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

        if (PP && PP.key !== undefined) {
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
            if (this === this.parent.leftChild) this.parent.leftChild = undefined;
            else if (this === this.parent.rightChild) this.parent.rightChild = undefined;
        }
        if (this.brother) this.brother.brother = undefined;
        this.key = undefined;
        this.value = undefined;
        this.parent = undefined;
        this.brother = undefined;
    }
}

const TreeIterator = function <T, K>(this: Iterator<T>, _node: TreeNode<T, K>, IteratorFunc: { new<T, K>(_node: TreeNode<T, K>): Iterator<T> }) {
    Object.defineProperties(this, {
        node: {
            get() {
                return _node;
            }
        },
        value: {
            get() {
                if (_node.value === undefined) return _node.key;
                return _node.value;
            },
            enumerable: true
        }
    });

    this.equals = function (obj: Iterator<T>) {
        // @ts-ignore
        return _node === obj.node;
    };

    this.pre = function () {
        let preNode: TreeNode<T, K> | undefined = _node;
        if (preNode.color === TreeNode.TreeNodeColorType.red && preNode.parent?.parent === preNode) {
            preNode = preNode.rightChild;
        } else if (preNode.leftChild) {
            preNode = preNode.leftChild;
            while (preNode.rightChild) preNode = preNode?.rightChild;
        } else {
            let pre = preNode?.parent || undefined;
            while (pre?.leftChild === preNode) {
                preNode = pre;
                pre = preNode?.parent || undefined;
            }
            preNode = pre;
        }
        if (preNode === undefined) throw new Error("unknown error");
        return new IteratorFunc(preNode);
    };

    this.next = function () {
        let nextNode: TreeNode<T, K> | undefined = _node;
        if (nextNode?.rightChild) {
            nextNode = nextNode.rightChild;
            while (nextNode.leftChild) nextNode = nextNode?.leftChild;
        } else {
            let pre = nextNode?.parent || undefined;
            while (pre?.rightChild === nextNode) {
                nextNode = pre;
                pre = nextNode?.parent || undefined;
            }
            if (nextNode.rightChild !== pre) {
                nextNode = pre;
            }
        }
        if (nextNode === undefined) throw new Error("unknown error");
        return new IteratorFunc(nextNode);
    };
} as unknown as { new<T, K>(_node: TreeNode<T, K>): Iterator<T>; };

const SetIterator = function <T, K>(this: Iterator<T>, _node: TreeNode<T, K>) {
    // @ts-ignore
    TreeIterator.call(this, _node, SetIterator);
} as unknown as { new<T, K>(_node: TreeNode<T, K>): Iterator<T>; };
const MapIterator = function <T, K>(this: MapIteratorType<T, K>, _node: TreeNode<T, K>) {
    // @ts-ignore
    TreeIterator.call(this, _node, MapIterator);
    Object.defineProperty(this, 'key', {
        get() {
            return _node.key;
        },
        enumerable: true
    });
} as unknown as { new<T, K>(_node: TreeNode<T, K>): MapIteratorType<T, K>; };

export { TreeNode, SetIterator, MapIterator };
