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

export function createTreeNode<K, V>(props: TreeNodeProps<K, V> = {}): TreeNode<K, V> {
  const { color = TREE_NODE_COLOR.RED, key, value } = props;
  return {
    _key: key,
    _value: value,
    _color: color,
    _left: undefined,
    _right: undefined,
    _parent: undefined,
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
    },
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
    },
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
    },
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
  };
}

export type TreeNodeEnableIndex<K, V> = {
  _left?: TreeNodeEnableIndex<K, V>;
  _right?: TreeNodeEnableIndex<K, V>;
  _parent?: TreeNodeEnableIndex<K, V>;
  _subTreeSize: number;
  _prev(): TreeNodeEnableIndex<K, V>;
  _next(): TreeNodeEnableIndex<K, V>;
  __rotateLeft(): TreeNodeEnableIndex<K, V>;
  __rotateRight(): TreeNodeEnableIndex<K, V>;
  _rotateLeft(): TreeNodeEnableIndex<K, V>;
  _rotateRight(): TreeNodeEnableIndex<K, V>;
  _recount(): void;
} & TreeNode<K, V>;

export function createTreeNodeEnableIndex<K, V>(
  props: TreeNodeProps<K, V> = {}
): TreeNodeEnableIndex<K, V> {
  const {
    _color, _key, _value, _prev, _next, _rotateLeft, _rotateRight
  } = createTreeNode(props) as TreeNodeEnableIndex<K, V>;
  return {
    _key,
    _value,
    _color,
    _left: undefined,
    _right: undefined,
    _parent: undefined,
    _prev,
    _next,
    _subTreeSize: 1,
    __rotateLeft: _rotateLeft,
    __rotateRight: _rotateRight,
    _rotateLeft() {
      const parent = this.__rotateLeft();
      this._recount();
      parent._recount();
      return parent;
    },
    _rotateRight() {
      const parent = this.__rotateRight();
      this._recount();
      parent._recount();
      return parent;
    },
    _recount() {
      this._subTreeSize = 1;
      if (this._left) {
        this._subTreeSize += this._left._subTreeSize;
      }
      if (this._right) {
        this._subTreeSize += this._right._subTreeSize;
      }
    }
  };
}
