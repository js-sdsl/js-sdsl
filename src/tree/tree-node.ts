export const enum TREE_NODE_COLOR {
  RED = 1,
  BLACK = 0
}

export type TreeNode<K, V> = {
  _color: TREE_NODE_COLOR;
  _key?: K;
  _value?: V;
  _left?: TreeNode<K, V>;
  _right?: TreeNode<K, V>;
  _parent?: TreeNode<K, V>;
  /**
   * @description Get the previous node.
   * @returns TreeNode about the previous node.
   */
  _prev(): TreeNode<K, V>;
  /**
   * @description Get the next node.
   * @returns TreeNode about the next node.
   */
  _next(): TreeNode<K, V>;
  /**
   * @description Rotate left.
   * @returns TreeNode about moved to original position after rotation.
   */
  _rotateLeft(): TreeNode<K, V>;
  /**
   * @description Rotate right.
   * @returns TreeNode about moved to original position after rotation.
   */
  _rotateRight(): TreeNode<K, V>;
}

type TreeNodeProps<K, V> = {
  color?: TREE_NODE_COLOR;
  key?: K;
  value?: V;
};

function prev<K, V>(this: TreeNode<K, V>) {
  let prevNode = this;
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

function next<K, V>(this: TreeNode<K, V>) {
  let nextNode = this;
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

function rotateLeft<K, V>(this: TreeNode<K, V>) {
  const PP = this._parent!;
  const T = this._right!;
  const R = T._left;

  if (PP._parent === this) PP._parent = T;
  else if (PP._left === this) PP._left = T;
  else PP._right = T;

  T._parent = PP;
  T._left = this;

  this._parent = T;
  this._right = R;

  if (R) R._parent = this;

  return T;
}

function rotateRight<K, V>(this: TreeNode<K, V>) {
  const PP = this._parent!;
  const F = this._left!;
  const T = F._right;

  if (PP._parent === this) PP._parent = F;
  else if (PP._left === this) PP._left = F;
  else PP._right = F;

  F._parent = PP;
  F._right = this;

  this._parent = F;
  this._left = T;

  if (T) T._parent = this;

  return F;
}

export function createTreeNode<K, V>(props: TreeNodeProps<K, V> = {}): TreeNode<K, V> {
  return {
    _key: props.key,
    _value: props.value,
    _color: props.color === undefined ? TREE_NODE_COLOR.RED : props.color,
    _left: undefined,
    _right: undefined,
    _parent: undefined,
    _prev: prev,
    _next: next,
    _rotateLeft: rotateLeft,
    _rotateRight: rotateRight
  };
}

export type TreeNodeEnableIndex<K, V> = {
  _left?: TreeNodeEnableIndex<K, V>;
  _right?: TreeNodeEnableIndex<K, V>;
  _parent?: TreeNodeEnableIndex<K, V>;
  _subTreeSize: number;
  _prev(): TreeNodeEnableIndex<K, V>;
  _next(): TreeNodeEnableIndex<K, V>;
  _rotateLeft(): TreeNodeEnableIndex<K, V>;
  _rotateRight(): TreeNodeEnableIndex<K, V>;
  _recount(): void;
} & TreeNode<K, V>;

function rotateLeftEnableIndex<K, V>(this: TreeNodeEnableIndex<K, V>) {
  const parent = rotateLeft.apply(this) as TreeNodeEnableIndex<K, V>;
  this._recount();
  parent._recount();
  return parent;
}

function rotateRightEnableIndex<K, V>(this: TreeNodeEnableIndex<K, V>) {
  const parent = rotateRight.apply(this) as TreeNodeEnableIndex<K, V>;
  this._recount();
  parent._recount();
  return parent;
}

function recount<K, V>(this: TreeNodeEnableIndex<K, V>) {
  this._subTreeSize = 1;
  if (this._left) {
    this._subTreeSize += this._left._subTreeSize;
  }
  if (this._right) {
    this._subTreeSize += this._right._subTreeSize;
  }
}

export function createTreeNodeEnableIndex<K, V>(
  props: TreeNodeProps<K, V> = {}
): TreeNodeEnableIndex<K, V> {
  return {
    _key: props.key,
    _value: props.value,
    _color: props.color === undefined ? TREE_NODE_COLOR.RED : props.color,
    _left: undefined,
    _right: undefined,
    _parent: undefined,
    _prev: prev as (() => TreeNodeEnableIndex<K, V>),
    _next: next as (() => TreeNodeEnableIndex<K, V>),
    _subTreeSize: 1,
    _rotateLeft: rotateLeftEnableIndex,
    _rotateRight: rotateRightEnableIndex,
    _recount: recount
  };
}
