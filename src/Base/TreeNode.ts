class TreeNode<T, K> {
    static TreeNodeColorType: {
        red: true,
        black: false
    } = {
        red: true,
        black: false
    };
    color = true;
    key: T | null = null;
    value: K | null = null;
    parent: TreeNode<T, K> | null = null;
    brother: TreeNode<T, K> | null = null;
    leftChild: TreeNode<T, K> | null = null;
    rightChild: TreeNode<T, K> | null = null;

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
        this.key = null;
        this.value = null;
        this.parent = null;
        this.brother = null;
    }
}

Object.freeze(TreeNode);

export default TreeNode;
