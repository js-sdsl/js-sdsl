export const enum TREE_NODE_COLOR {
  RED = 1,
  BLACK = 0
}

export class TreeNode<K, V> {
  _color: TREE_NODE_COLOR;
  _key?: K;
  _value?: V;
  _left?: TreeNode<K, V>;
  _right?: TreeNode<K, V>;
  _parent?: TreeNode<K, V>;
  constructor(props: {
    key?: K,
    value?: V,
    color?: TREE_NODE_COLOR,
  } = {}) {
    const { key, value, color = TREE_NODE_COLOR.RED } = props;
    this._key = key;
    this._value = value;
    this._color = color;
  }
  /**
   * @description Get the prev node.
   * @returns TreeNode about the prev node.
   */
  _prev() {
    let prevNode: TreeNode<K, V> = this;
    const isRootOrHeader = prevNode._parent!._parent === prevNode;
    if (isRootOrHeader && prevNode._color === TREE_NODE_COLOR.RED) {
      prevNode = prevNode._right!;
    } else if (prevNode._left) {
      prevNode = prevNode._left;
      while (prevNode._right) {
        prevNode = prevNode._right;
      }
    } else {
      // Must be root and left is null
      if (isRootOrHeader) {
        return prevNode._parent!;
      }
      let prev = prevNode._parent!;
      while (prev._left === prevNode) {
        prevNode = prev;
        prev = prevNode._parent!;
      }
      prevNode = prev;
    }
    return prevNode;
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
      let prev = nextNode._parent!;
      while (prev._right === nextNode) {
        nextNode = prev;
        prev = nextNode._parent!;
      }
      if (nextNode._right !== prev) {
        return prev;
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
  declare _left?: TreeNodeEnableIndex<K, V>;
  declare _right?: TreeNodeEnableIndex<K, V>;
  declare _parent?: TreeNodeEnableIndex<K, V>;
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
      this._subTreeSize += this._left._subTreeSize;
    }
    if (this._right) {
      this._subTreeSize += this._right._subTreeSize;
    }
  }
  // @ts-ignore
  _prev(): TreeNodeEnableIndex<K, V>;
  // @ts-ignore
  _next(): TreeNodeEnableIndex<K, V>;
}
