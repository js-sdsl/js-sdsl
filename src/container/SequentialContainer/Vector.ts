import { RunTimeError } from '@/utils/error';
import { ContainerIterator, initContainer } from '@/container/ContainerBase/index';
import { checkUndefinedParams, checkWithinAccessParams } from '@/utils/checkParams';
import SequentialContainer from './Base/index';

export class VectorIterator<T> extends ContainerIterator<T> {
  private node;
  private size: () => number;
  private getElementByPos: (pos: number) => T;
  private setElementByPos: (pos: number, element: T) => void;
  constructor(
    index: number,
    size: () => number,
    getElementByPos: (pos: number) => T,
    setElementByPos: (pos: number, element: T) => void,
    iteratorType: 'normal' | 'reverse' = 'normal'
  ) {
    super(iteratorType);
    this.node = index;
    this.size = size;
    this.getElementByPos = getElementByPos;
    this.setElementByPos = setElementByPos;
  }
  get pointer() {
    checkWithinAccessParams(this.node, 0, this.size() - 1);
    return this.getElementByPos(this.node);
  }
  set pointer(newValue: T) {
    checkWithinAccessParams(this.node, 0, this.size() - 1);
    this.setElementByPos(this.node, newValue);
  }
  pre() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.size() - 1) {
        throw new RunTimeError('Vector iterator access denied!');
      }
      this.node += 1;
    } else {
      if (this.node === 0) {
        throw new RunTimeError('Vector iterator access denied!');
      }
      this.node -= 1;
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node === -1) {
        throw new RunTimeError('Vector iterator access denied!');
      }
      this.node -= 1;
    } else {
      if (this.node === this.size()) {
        throw new RunTimeError('Iterator access denied!');
      }
      this.node += 1;
    }
    return this;
  }
  equals(obj: VectorIterator<T>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new TypeError(`obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new TypeError('iterator type error!');
    }
    return this.node === obj.node;
  }
}

class Vector<T> extends SequentialContainer<T> {
  private vector: T[] = [];
  constructor(container: initContainer<T> = []) {
    super();
    container.forEach(element => this.pushBack(element));
    this.size = this.size.bind(this);
    this.getElementByPos = this.getElementByPos.bind(this);
    this.setElementByPos = this.setElementByPos.bind(this);
  }
  clear() {
    this.length = 0;
    this.vector.length = 0;
  }
  begin() {
    return new VectorIterator(
      0,
      this.size,
      this.getElementByPos,
      this.setElementByPos
    );
  }
  end() {
    return new VectorIterator(
      this.length,
      this.size,
      this.getElementByPos,
      this.setElementByPos
    );
  }
  rBegin() {
    return new VectorIterator(
      this.length - 1,
      this.size,
      this.getElementByPos,
      this.setElementByPos,
      'reverse'
    );
  }
  rEnd() {
    return new VectorIterator(
      -1,
      this.size,
      this.getElementByPos,
      this.setElementByPos,
      'reverse'
    );
  }
  front() {
    if (!this.length) return undefined;
    return this.vector[0];
  }
  back() {
    if (!this.length) return undefined;
    return this.vector[this.length - 1];
  }
  forEach(callback: (element: T, index: number) => void) {
    this.vector.forEach(callback);
  }
  getElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    return this.vector[pos];
  }
  eraseElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    for (let i = pos; i < this.length - 1; ++i) this.vector[i] = this.vector[i + 1];
    this.popBack();
  }
  eraseElementByValue(value: T) {
    const newArr: T[] = [];
    this.forEach(element => {
      if (element !== value) newArr.push(element);
    });
    newArr.forEach((element, index) => {
      this.vector[index] = element;
    });
    const newLen = newArr.length;
    while (this.length > newLen) this.popBack();
  }
  eraseElementByIterator(iter: VectorIterator<T>) {
    // @ts-ignore
    const node = iter.node;
    iter = iter.next();
    this.eraseElementByPos(node);
    return iter;
  }
  pushBack(element: T) {
    this.vector.push(element);
    this.length += 1;
  }
  popBack() {
    this.vector.pop();
    if (this.length > 0) this.length -= 1;
  }
  setElementByPos(pos: number, element: T) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    if (element === undefined || element === null) {
      this.eraseElementByPos(pos);
      return;
    }
    this.vector[pos] = element;
  }
  insert(pos: number, element: T, num = 1) {
    checkUndefinedParams(element);
    checkWithinAccessParams(pos, 0, this.length);
    this.vector.splice(pos, 0, ...new Array<T>(num).fill(element));
    this.length += num;
  }
  find(element: T) {
    for (let i = 0; i < this.length; ++i) {
      if (this.vector[i] === element) {
        return new VectorIterator(
          i,
          this.size,
          this.getElementByPos,
          this.getElementByPos
        );
      }
    }
    return this.end();
  }
  reverse() {
    this.vector.reverse();
  }
  unique() {
    let pre: T;
    const newArr: T[] = [];
    this.forEach((element, index) => {
      if (index === 0 || element !== pre) {
        newArr.push(element);
        pre = element;
      }
    });
    newArr.forEach((element, index) => {
      this.vector[index] = element;
    });
    const newLen = newArr.length;
    while (this.length > newLen) this.popBack();
  }
  sort(cmp?: (x: T, y: T) => number) {
    this.vector.sort(cmp);
  }
  [Symbol.iterator]() {
    return function * (this: Vector<T>) {
      return yield * this.vector;
    }.bind(this)();
  }
}

export default Vector;
