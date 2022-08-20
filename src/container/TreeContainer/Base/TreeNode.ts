class TreeNode<K, V> {
  static readonly red = true;
  static readonly black = false;
  color = true;
  key: K | undefined = undefined;
  value: V | undefined = undefined;
  left: TreeNode<K, V> | undefined = undefined;
  right: TreeNode<K, V> | undefined = undefined;
  parent: TreeNode<K, V> | undefined = undefined;
  brother: TreeNode<K, V> | undefined = undefined;
  constructor(key?: K, value?: V) {
    this.key = key;
    this.value = value;
  }
  rotateLeft() {
    const PP = this.parent as TreeNode<K, V>;
    const PB = this.brother;
    const F = this.left;
    const V = this.right as TreeNode<K, V>;

    const R = V.left;
    const X = V.right;

    if (PP.parent === this) PP.parent = V;
    else if (PP.left === this) PP.left = V;
    else PP.right = V;

    V.parent = PP;
    V.brother = PB;
    V.left = this;

    if (PB) PB.brother = V;

    this.parent = V;
    this.brother = X;
    this.right = R;

    if (X) X.brother = this;

    if (F) F.brother = R;

    if (R) {
      R.parent = this;
      R.brother = F;
    }

    return V;
  }
  rotateRight() {
    const PP = this.parent as TreeNode<K, V>;
    const PB = this.brother;
    const F = this.left as TreeNode<K, V>;
    const V = this.right;

    const D = F.left;
    const K = F.right;

    if (PP.parent === this) PP.parent = F;
    else if (PP.left === this) PP.left = F;
    else PP.right = F;

    F.parent = PP;
    F.brother = PB;
    F.right = this;

    if (PB) PB.brother = F;

    if (D) D.brother = this;

    this.parent = F;
    this.brother = D;
    this.left = K;

    if (K) {
      K.parent = this;
      K.brother = V;
    }

    if (V) V.brother = K;

    return F;
  }
  remove() {
    const parent = this.parent as TreeNode<K, V>;
    if (this === parent.left) {
      parent.left = undefined;
    } else {
      parent.right = undefined;
    }
    if (this.brother) this.brother.brother = undefined;
    this.key = undefined;
    this.value = undefined;
    this.parent = undefined;
    this.brother = undefined;
  }
}

export default TreeNode;
