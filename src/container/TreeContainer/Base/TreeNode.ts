class TreeNode<K, V> {
  static readonly RED = true;
  static readonly BLACK = false;
  color = true;
  key: K | undefined = undefined;
  value: V | undefined = undefined;
  left: TreeNode<K, V> | undefined = undefined;
  right: TreeNode<K, V> | undefined = undefined;
  parent: TreeNode<K, V> | undefined = undefined;
  subTreeSize = 1;
  constructor(key?: K, value?: V) {
    this.key = key;
    this.value = value;
  }
  /**
   * @description Get the pre node.
   * @return TreeNode about the pre node.
   */
  pre() {
    let preNode: TreeNode<K, V> = this;
    if (
      preNode.color === TreeNode.RED &&
      (preNode.parent as TreeNode<K, V>).parent === preNode
    ) {
      preNode = preNode.right as TreeNode<K, V>;
    } else if (preNode.left) {
      preNode = preNode.left;
      while (preNode.right) {
        preNode = preNode.right;
      }
    } else {
      let pre = preNode.parent as TreeNode<K, V>;
      while (pre.left === preNode) {
        preNode = pre;
        pre = preNode.parent as TreeNode<K, V>;
      }
      preNode = pre;
    }
    return preNode;
  }
  /**
   * @description Get the next node.
   * @return TreeNode about the next node.
   */
  next() {
    let nextNode: TreeNode<K, V> = this;
    if (nextNode.right) {
      nextNode = nextNode.right;
      while (nextNode.left) {
        nextNode = nextNode.left;
      }
    } else {
      let pre = nextNode.parent as TreeNode<K, V>;
      while (pre.right === nextNode) {
        nextNode = pre;
        pre = nextNode.parent as TreeNode<K, V>;
      }
      if (nextNode.right !== pre) {
        nextNode = pre;
      }
    }
    return nextNode;
  }
  /**
   * @description Rotate left.
   * @return TreeNode about moved to original position after rotation.
   */
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

    this.recount();
    V.recount();

    return V;
  }
  /**
   * @description Rotate left.
   * @return TreeNode about moved to original position after rotation.
   */
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

    this.recount();
    F.recount();

    return F;
  }
  recount() {
    this.subTreeSize = 1;
    if (this.left) this.subTreeSize += this.left.subTreeSize;
    if (this.right) this.subTreeSize += this.right.subTreeSize;
  }
}

export default TreeNode;
