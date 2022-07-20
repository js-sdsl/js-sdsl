import { InternalError, RunTimeError } from '@/types/error';
import { ContainerIterator, Pair } from '@/types/interface';

export class TreeNode<K, V> {
  static TreeNodeColorType: {
        red: true,
        black: false
    } = {
      red: true,
      black: false
    };
  color = true;
  key: K | undefined = undefined;
  value: V | undefined = undefined;
  parent: TreeNode<K, V> | undefined = undefined;
  brother: TreeNode<K, V> | undefined = undefined;
  leftChild: TreeNode<K, V> | undefined = undefined;
  rightChild: TreeNode<K, V> | undefined = undefined;
  constructor(key?: K, value?: V) {
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
    if (!V) throw new InternalError();
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
    const F = this.leftChild;
    if (!F) throw new InternalError();
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
    if (this.leftChild || this.rightChild) throw new InternalError('can only remove leaf node');
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

export const TreeIterator = class <K, V> implements ContainerIterator<unknown> {
  private node: TreeNode<K, V>;
  private header: TreeNode<K, V>;
  readonly iteratorType: 'normal' | 'reverse';
  constructor(
    node: TreeNode<K, V>,
    header: TreeNode<K, V>,
    iteratorType: 'normal' | 'reverse' = 'normal'
  ) {
    this.node = node;
    this.header = header;
    this.iteratorType = iteratorType;
  }
  private _pre() {
    let preNode: TreeNode<K, V> | undefined = this.node;
    if (preNode.color === TreeNode.TreeNodeColorType.red && preNode.parent?.parent === preNode) {
      preNode = preNode.rightChild;
    } else if (preNode.leftChild) {
      preNode = preNode.leftChild;
      while (preNode.rightChild) preNode = preNode?.rightChild;
    } else {
      let pre = preNode?.parent || undefined;
      while (pre?.leftChild === preNode) {
        preNode = pre;
        pre = preNode?.parent || undefined;
      }
      preNode = pre;
    }
    if (preNode === undefined) {
      throw new InternalError();
    }
    return preNode;
  }
  private _next() {
    let nextNode: TreeNode<K, V> | undefined = this.node;
    if (nextNode?.rightChild) {
      nextNode = nextNode.rightChild;
      while (nextNode.leftChild) nextNode = nextNode?.leftChild;
    } else {
      let pre = nextNode?.parent || undefined;
      while (pre?.rightChild === nextNode) {
        nextNode = pre;
        pre = nextNode?.parent || undefined;
      }
      if (nextNode.rightChild !== pre) {
        nextNode = pre;
      }
    }
    if (nextNode === undefined) throw new InternalError();
    return nextNode;
  }
  get pointer() {
    if (this.node.key === undefined) {
      throw new RunTimeError('Tree iterator access denied!');
    }
    if (this.node.value === undefined) {
      return this.node.key;
    }
    const obj = {};
    Object.defineProperties(obj, {
      key: {
        get: () => {
          return this.node.key;
        },
        enumerable: true
      },
      value: {
        get: () => {
          return this.node.value;
        },
        set: (newValue: V) => {
          this.node.value = newValue;
        },
        enumerable: true
      }
    });
    return obj;
  }
  pre() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.header.rightChild) {
        throw new RunTimeError('Tree iterator access denied!');
      }
      this.node = this._next();
    } else {
      if (this.node === this.header.leftChild) {
        throw new RunTimeError('Tree iterator access denied!');
      }
      this.node = this._pre();
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.header) {
        throw new RunTimeError('Tree iterator access denied!');
      }
      this.node = this._pre();
    } else {
      if (this.node === this.header) {
        throw new RunTimeError('Tree iterator access denied!');
      }
      this.node = this._next();
    }
    return this;
  }
  equals(obj: ContainerIterator<unknown>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new RunTimeError(`obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new RunTimeError('iterator type error!');
    }
    // @ts-ignore
    return this.node === obj.node;
  }
} as unknown as {
  new <T>(
      _node: TreeNode<T, undefined>,
      header: TreeNode<T, undefined>,
      iteratorType?: 'normal' | 'reverse'
  ): ContainerIterator<T>;
  new <K, V>(
      _node: TreeNode<K, V>,
      header: TreeNode<K, V>,
      iteratorType?: 'normal' | 'reverse'
  ): ContainerIterator<Pair<K, V>>;
};
