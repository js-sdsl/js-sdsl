export const enum TreeNodeColor {
  RED = 1,
  BLACK = 0
}

export class TreeNode<K, V> {
  _color: TreeNodeColor;
  _key: K | undefined;
  _value: V | undefined;
  _left: TreeNode<K, V> | undefined = undefined;
  _right: TreeNode<K, V> | undefined = undefined;
  _parent: TreeNode<K, V> | undefined = undefined;
  constructor(
    key?: K,
    value?: V,
    color: TreeNodeColor = TreeNodeColor.RED
  ) {
    this._key = key;
    this._value = value;
    this._color = color;
  }
  /**
   * @description Get the pre node.
   * @returns TreeNode about the pre node.
   */
  _pre() {
    let preNode: TreeNode<K, V> = this;
    const isRootOrHeader = preNode._parent!._parent === preNode;
    if (isRootOrHeader && preNode._color === TreeNodeColor.RED) {
      preNode = preNode._right!;
    } else if (preNode._left) {
      preNode = preNode._left;
      while (preNode._right) {
        preNode = preNode._right;
      }
    } else {
      // Must be root and left is null
      if (isRootOrHeader) {
        return preNode._parent!;
      }
      let pre = preNode._parent!;
      while (pre._left === preNode) {
        preNode = pre;
        pre = preNode._parent!;
      }
      preNode = pre;
    }
    return preNode;
  }
  /**
   * @description Get the next node.
   * @returns TreeNode about the next node.
   */
  _next() {
    let nextNode: TreeNode<K, V> = this;
    if (nextNode._right) {
      nextNode = nextNode._right;
      while (nextNode._left) {
        nextNode = nextNode._left;
      }
      return nextNode;
    } else {
      let pre = nextNode._parent!;
      while (pre._right === nextNode) {
        nextNode = pre;
        pre = nextNode._parent!;
      }
      if (nextNode._right !== pre) {
        return pre;
      } else return nextNode;
    }
  }
  /**
   * @description Rotate left.
   * @returns TreeNode about moved to original position after rotation.
   */
  _rotateLeft() {
    const PP = this._parent!;
    const V = this._right!;
    const R = V._left;

    if (PP._parent === this) PP._parent = V;
    else if (PP._left === this) PP._left = V;
    else PP._right = V;

    V._parent = PP;
    V._left = this;

    this._parent = V;
    this._right = R;

    if (R) R._parent = this;

    return V;
  }
  /**
   * @description Rotate right.
   * @returns TreeNode about moved to original position after rotation.
   */
  _rotateRight() {
    const PP = this._parent!;
    const F = this._left!;
    const K = F._right;

    if (PP._parent === this) PP._parent = F;
    else if (PP._left === this) PP._left = F;
    else PP._right = F;

    F._parent = PP;
    F._right = this;

    this._parent = F;
    this._left = K;

    if (K) K._parent = this;

    return F;
  }
}

export class TreeNodeEnableIndex<K, V> extends TreeNode<K, V> {
  _subTreeSize = 1;
  /**
   * @description Rotate left and do recount.
   * @returns TreeNode about moved to original position after rotation.
   */
  _rotateLeft() {
    const parent = super._rotateLeft() as TreeNodeEnableIndex<K, V>;
    this._recount();
    parent._recount();
    return parent;
  }
  /**
   * @description Rotate right and do recount.
   * @returns TreeNode about moved to original position after rotation.
   */
  _rotateRight() {
    const parent = super._rotateRight() as TreeNodeEnableIndex<K, V>;
    this._recount();
    parent._recount();
    return parent;
  }
  _recount() {
    this._subTreeSize = 1;
    if (this._left) {
      this._subTreeSize += (this._left as TreeNodeEnableIndex<K, V>)._subTreeSize;
    }
    if (this._right) {
      this._subTreeSize += (this._right as TreeNodeEnableIndex<K, V>)._subTreeSize;
    }
  }
}
