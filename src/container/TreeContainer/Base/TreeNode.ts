/**
 * @internal
 */
export const enum TreeNodeColor {
  RED = 1,
  BLACK = 0
}

export class TreeNode<K, V> {
  /**
   * @internal
   */
  _color = TreeNodeColor.RED;
  /**
   * @internal
   */
  _key: K | undefined = undefined;
  /**
   * @internal
   */
  _value: V | undefined = undefined;
  /**
   * @internal
   */
  _left: TreeNode<K, V> | undefined = undefined;
  /**
   * @internal
   */
  _right: TreeNode<K, V> | undefined = undefined;
  /**
   * @internal
   */
  _parent: TreeNode<K, V> | undefined = undefined;
  constructor(_key?: K, _value?: V) {
    this._key = _key;
    this._value = _value;
  }
  /**
   * @description Get the pre node.
   * @return TreeNode about the pre node.
   */
  pre() {
    let preNode: TreeNode<K, V> = this;
    if (
      preNode._color === TreeNodeColor.RED &&
      (preNode._parent as TreeNode<K, V>)._parent === preNode
    ) {
      preNode = preNode._right as TreeNode<K, V>;
    } else if (preNode._left) {
      preNode = preNode._left;
      while (preNode._right) {
        preNode = preNode._right;
      }
    } else {
      let pre = preNode._parent as TreeNode<K, V>;
      while (pre._left === preNode) {
        preNode = pre;
        pre = preNode._parent as TreeNode<K, V>;
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
    if (nextNode._right) {
      nextNode = nextNode._right;
      while (nextNode._left) {
        nextNode = nextNode._left;
      }
      return nextNode;
    } else {
      let pre = nextNode._parent as TreeNode<K, V>;
      while (pre._right === nextNode) {
        nextNode = pre;
        pre = nextNode._parent as TreeNode<K, V>;
      }
      if (nextNode._right !== pre) {
        return pre;
      } else return nextNode;
    }
  }
  /**
   * @description Rotate _left.
   * @return TreeNode about moved to original position after rotation.
   */
  rotateLeft() {
    const PP = this._parent as TreeNode<K, V>;
    const V = this._right as TreeNode<K, V>;
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
   * @description Rotate _right.
   * @return TreeNode about moved to original position after rotation.
   */
  rotateRight() {
    const PP = this._parent as TreeNode<K, V>;
    const F = this._left as TreeNode<K, V>;
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
  /**
   * @internal
   */
  _left: TreeNodeEnableIndex<K, V> | undefined = undefined;
  /**
   * @internal
   */
  _right: TreeNodeEnableIndex<K, V> | undefined = undefined;
  /**
   * @internal
   */
  _parent: TreeNodeEnableIndex<K, V> | undefined = undefined;
  /**
   * @internal
   */
  _subTreeSize = 1;
  /**
   * @description Rotate _left and do recount.
   * @return TreeNode about moved to original position after rotation.
   */
  rotateLeft() {
    const _parent = super.rotateLeft() as TreeNodeEnableIndex<K, V>;
    this.recount();
    _parent.recount();
    return _parent;
  }
  /**
   * @description Rotate _right and do recount.
   * @return TreeNode about moved to original position after rotation.
   */
  rotateRight(): TreeNode<K, V> {
    const _parent = super.rotateRight() as TreeNodeEnableIndex<K, V>;
    this.recount();
    _parent.recount();
    return _parent;
  }
  recount() {
    this._subTreeSize = 1;
    if (this._left) this._subTreeSize += this._left._subTreeSize;
    if (this._right) this._subTreeSize += this._right._subTreeSize;
  }
}
