import { Pair } from "./Base";
import { ContainerIterator } from "./Base";

export class TreeNode<T, K> {
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

function _TreeIterator<T, K>(this: ContainerIterator<unknown>, _node: TreeNode<T, K>, position: 'begin' | 'end' | 'mid' = 'mid') {
    Object.defineProperties(this, {
        node: {
            value: _node
        },
        position: {
            value: position
        },
        pointer: {
            value: _node.value === undefined ? _node.key : {
                key: _node.key,
                value: _node.value
            },
            enumerable: true
        }
    });

    this.equals = function (obj: ContainerIterator<unknown>) {
        // @ts-ignore
        return _node === obj.node && this.position === obj.position;
    };

    this.pre = function () {
        if (position === 'begin') throw new Error("Iterator access denied!");
        let preNode: TreeNode<T, K | undefined> | undefined = _node;
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
        return new TreeIterator(preNode as TreeNode<unknown, undefined>, preNode.key === undefined ? 'begin' : 'mid');
    };

    this.next = function () {
        if (position === 'end') throw new Error("Iterator access denied!");
        let nextNode: TreeNode<T, K | undefined> | undefined = _node;
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
        return new TreeIterator(nextNode as TreeNode<unknown, undefined>, nextNode.key === undefined ? 'end' : 'mid');
    };
}

export const TreeIterator = _TreeIterator as unknown as {
    new<T>(_node: TreeNode<T, undefined>, position?: 'begin' | 'end' | 'mid'): ContainerIterator<T>;
    new<T, K>(_node: TreeNode<T, K>, position?: 'begin' | 'end' | 'mid'): ContainerIterator<Pair<T, K>>;
};
