import SequentialContainer from './base';
import { Entries } from '@/base';
import { ITERATOR_TYPE } from '@/base/iterator';
import { RandomIterator } from '@/sequential/random-iterator';
import { CompareFn, compareFromS2L } from '@/utils/compareFn';

class VectorIterator<T> extends RandomIterator<T> {
  container: Vector<T>;
  constructor(props: {
    node: number,
    container: Vector<T>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    this.container = props.container;
  }
  copy() {
    return new VectorIterator<T>({
      node: this._node,
      container: this.container,
      type: this.type
    });
  }
  // @ts-ignore
  equals(iter: VectorIterator<T>): boolean;
}

export type { VectorIterator };

class Vector<T> extends SequentialContainer<T> {
  /**
   * @internal
   */
  private readonly _vector: T[];
  /**
   * @param entries - Initialize container, must have a forEach function.
   * @param copy - When the container is an array, you can choose to directly operate on the original object of
   *               the array or perform a shallow copy. The default is shallow copy.
   */
  constructor(entries: Entries<T> = [], options: {
    copy?: boolean
  } = {}) {
    super();
    if (Array.isArray(entries)) {
      const { copy = true } = options;
      this._vector = copy ? [...entries] : entries;
      this._length = entries.length;
    } else {
      this._vector = [];
      const self = this;
      entries.forEach(function (el) {
        self.push(el);
      });
    }
  }
  clear() {
    this._length = 0;
    this._vector.length = 0;
  }
  begin() {
    return new VectorIterator<T>({
      node: 0,
      container: this
    });
  }
  end() {
    return new VectorIterator<T>({
      node: this._length,
      container: this
    });
  }
  rBegin() {
    return new VectorIterator<T>({
      node: this._length - 1,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  rEnd() {
    return new VectorIterator<T>({
      node: -1,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  front(): T | undefined {
    return this._vector[0];
  }
  back(): T | undefined {
    return this._vector[this._length - 1];
  }
  unsafe_at(index: number) {
    return this._vector[index];
  }
  erase(iter: VectorIterator<T>) {
    const _node = iter._node;
    iter = iter.next();
    this.splice(_node, 1);
    return iter;
  }
  push(...items: T[]) {
    this._vector.push(...items);
    this._length += items.length;
    return this._length;
  }
  pop() {
    if (this._length === 0) return;
    this._length -= 1;
    return this._vector.pop();
  }
  protected _set(index: number, item: T) {
    this._vector[index] = item;
  }
  find(item: T, cmp: CompareFn<T> = compareFromS2L) {
    const length = this.length;
    for (let i = 0; i < length; ++i) {
      // istanbul ignore else
      if (cmp(this._vector[i], item) === 0) {
        return new VectorIterator<T>({
          node: i,
          container: this
        });
      }
    }
    return this.end();
  }
  reverse() {
    this._vector.reverse();
    return this;
  }
  unique(cmp: CompareFn<T> = compareFromS2L) {
    let index = 1;
    const length = this.length;
    for (let i = 1; i < length; ++i) {
      if (cmp(this._vector[i], this._vector[i - 1]) !== 0) {
        this._vector[index++] = this._vector[i];
      }
    }
    this._length = this._vector.length = index;
    return this._length;
  }
  sort(cmp: CompareFn<T> = compareFromS2L) {
    this._vector.sort(cmp);
    return this;
  }
  splice(...args: [start: number, deleteCount?: number | undefined]) {
    const deleteItems = this._vector.splice(...args);
    this._length = this._vector.length;
    return new Vector(deleteItems);
  }
  entries() {
    return this._vector.entries();
  }
  every(callback: (value: T, index: number, container: this) => unknown) {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const flag = callback(this._vector[i], i, this);
      if (!flag) return false;
    }
    return true;
  }
  filter(callback: (value: T, index: number, container: this) => unknown) {
    const length = this._length;
    const newVector = new Vector<T>();
    for (let i = 0; i < length; ++i) {
      const item = this._vector[i];
      const flag = callback(item, i, this);
      if (flag) newVector.push(item);
    }
    return newVector;
  }
  map<U>(callback: (value: T, index: number, container: this) => U) {
    const length = this._length;
    const newVector = new Vector<U>();
    for (let i = 0; i < length; ++i) {
      const newValue = callback(this._vector[i], i, this);
      newVector.push(newValue);
    }
    return newVector;
  }
  some(callback: (value: T, index: number, container: this) => unknown) {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const flag = callback(this._vector[i], i, this);
      if (flag) return true;
    }
    return false;
  }
  slice(start = 0, end = this._length) {
    return new Vector(this._vector.slice(start, end));
  }
  values() {
    return this._vector.values();
  }
  forEach(callback: (value: T, index: number, container: this) => void) {
    const length = this.length;
    for (let i = 0; i < length; ++i) {
      callback(this._vector[i], i, this);
    }
  }
  * [Symbol.iterator]() {
    yield * this._vector;
  }
}

export default Vector;
