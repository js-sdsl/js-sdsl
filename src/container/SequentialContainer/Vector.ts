import SequentialContainer from './Base';
import {
  CallbackFn,
  initContainer,
  IteratorType
} from '@/container/ContainerBase';
import { RandomIterator } from '@/container/SequentialContainer/Base/RandomIterator';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import { CompareFn, compareFromS2L } from '@/utils/compareFn';

class VectorIterator<T> extends RandomIterator<T> {
  container: Vector<T>;
  constructor(node: number, container: Vector<T>, iteratorType?: IteratorType) {
    super(node, iteratorType);
    this.container = container;
  }
  copy() {
    return new VectorIterator<T>(this._node, this.container, this.iteratorType);
  }
  // @ts-ignore
  equals(iter: VectorIterator<T>): boolean;
}

export type { VectorIterator };

class Vector<T> extends SequentialContainer<T> {
  splice(start = 0, deleteCount = 0, ...items: T[]) {
    const deleteItems = this._vector.splice(start, deleteCount, ...items);
    this._length = this._vector.length;
    return new Vector(deleteItems);
  }
  entries() {
    return this._vector.entries();
  }
  every(callback: CallbackFn<T, this, unknown>) {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const flag = callback(this._vector[i], i, this);
      if (!flag) return false;
    }
    return true;
  }
  filter(callback: CallbackFn<T, this, unknown>) {
    const length = this._length;
    const newVector = new Vector<T>();
    for (let i = 0; i < length; ++i) {
      const item = this._vector[i];
      const flag = callback(item, i, this);
      if (flag) newVector.push(item);
    }
    return newVector;
  }
  map<U>(callback: CallbackFn<T, this, U>, cmp?: CompareFn<U>) {
    const length = this._length;
    const newVector = new Vector<U>();
    for (let i = 0; i < length; ++i) {
      const newValue = callback(this._vector[i], i, this);
      newVector.push(newValue);
    }
    return newVector;
  }
  some(callback: CallbackFn<T, this, unknown>) {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const flag = callback(this._vector[i], i, this);
      if (flag) return true;
    }
    return false;
  }
  slice(start = 0, end = this._length) {
    const length = this._length;
    const newVector = new Vector<T>();
    if (start >= length) return newVector;
    else if (start < 0) start = 0;
    if (end < 0) end += length;
    else if (end >= length) end = length;
    for (let i = start; i < end; ++i) {
      newVector.push(this._vector[i]);
    }
    return newVector;
  }
  values() {
    return this._vector.values();
  }
  /**
   * @internal
   */
  private readonly _vector: T[];
  /**
   * @param container - Initialize container, must have a forEach function.
   * @param copy - When the container is an array, you can choose to directly operate on the original object of
   *               the array or perform a shallow copy. The default is shallow copy.
   */
  constructor(container: initContainer<T> = [], copy = true) {
    super();
    if (Array.isArray(container)) {
      this._vector = copy ? [...container] : container;
      this._length = container.length;
    } else {
      this._vector = [];
      const self = this;
      container.forEach(function (el) {
        self.push(el);
      });
    }
  }
  clear() {
    this._length = 0;
    this._vector.length = 0;
  }
  begin() {
    return new VectorIterator<T>(0, this);
  }
  end() {
    return new VectorIterator<T>(this._length, this);
  }
  rBegin() {
    return new VectorIterator<T>(this._length - 1, this, IteratorType.REVERSE);
  }
  rEnd() {
    return new VectorIterator<T>(-1, this, IteratorType.REVERSE);
  }
  front(): T | undefined {
    return this._vector[0];
  }
  back(): T | undefined {
    return this._vector[this._length - 1];
  }
  at(index: number) {
    $checkWithinAccessParams!(index, 0, this._length - 1);
    return this._vector[index];
  }
  eraseElementByIterator(iter: VectorIterator<T>) {
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
  set(index: number, item: T) {
    $checkWithinAccessParams!(index, 0, this._length - 1);
    this._vector[index] = item;
  }
  find(item: T, cmp: CompareFn<T> = compareFromS2L) {
    const length = this.length;
    for (let i = 0; i < length; ++i) {
      if (cmp(this._vector[i], item) === 0) {
        return new VectorIterator<T>(i, this);
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
  forEach(callback: CallbackFn<T, this, void>) {
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
