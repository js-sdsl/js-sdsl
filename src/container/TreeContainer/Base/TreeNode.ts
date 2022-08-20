class TreeNode<K, V> {
  static readonly red = true;
  static readonly black = false;
  color = true;
  key: K | undefined = undefined;
  value: V | undefined = undefined;
  left: TreeNode<K, V> | undefined = undefined;
  right: TreeNode<K, V> | undefined = undefined;
  parent: TreeNode<K, V> | undefined = undefined;
  constructor(key?: K, value?: V) {
    this.key = key;
    this.value = value;
  }
  rotateLeft() {
    const PP = this.parent as TreeNode<K, V>;
    const V = this.right as TreeNode<K, V>;
    const R = V.left;

    if (PP.parent === this) PP.parent = V;
    else if (PP.left === this) PP.left = V;
    else PP.right = V;

    V.parent = PP;
    V.left = this;

    this.parent = V;
    this.right = R;

    if (R) R.parent = this;

    return V;
  }
  rotateRight() {
    const PP = this.parent as TreeNode<K, V>;
    const F = this.left as TreeNode<K, V>;
    const K = F.right;

    if (PP.parent === this) PP.parent = F;
    else if (PP.left === this) PP.left = F;
    else PP.right = F;

    F.parent = PP;
    F.right = this;

    this.parent = F;
    this.left = K;

    if (K) K.parent = this;

    return F;
  }
  remove() {
    const parent = this.parent as TreeNode<K, V>;
    if (this === parent.left) {
      parent.left = undefined;
    } else parent.right = undefined;
  }
}

export default TreeNode;
