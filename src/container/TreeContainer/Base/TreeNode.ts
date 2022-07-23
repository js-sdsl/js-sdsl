import { InternalError } from '@/utils/error';

class TreeNode<K, V> {
  static TreeNodeColorType = {
    red: true,
    black: false
  } as const;
  color = true;
  key: K | undefined = undefined;
  value: V | undefined = undefined;
  parent: TreeNode<K, V> | undefined = undefined;
  brother: TreeNode<K, V> | undefined = undefined;
  leftChild: TreeNode<K, V> | undefined = undefined;
  rightChild: TreeNode<K, V> | undefined = undefined;
  constructor(key?: K, value?: V) {
    this.key = key;
    this.value = value;
  }
  rotateLeft() {
    const PP = this.parent;
    const PB = this.brother;
    const F = this.leftChild;
    const V = this.rightChild as TreeNode<K, V>;

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
    const F = this.leftChild as TreeNode<K, V>;

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
    if (this.leftChild || this.rightChild) {
      throw new InternalError('can only remove leaf node');
    }
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

export default TreeNode;
