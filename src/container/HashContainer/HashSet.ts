import { initContainer, IteratorType } from '@/container/ContainerBase';
import { HashContainer, HashContainerIterator } from '@/container/HashContainer/Base';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import { throwIteratorAccessError } from '@/utils/throwError';

class HashSetIterator<K, V> extends HashContainerIterator<K, V> {
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    return this._node._key;
  }
  copy() {
    return new HashSetIterator(this._node, this._header, this.iteratorType);
  }
  // @ts-ignore
  equals(iter: HashSetIterator<K, V>): boolean;
}

export type { HashSetIterator };

class HashSet<K> extends HashContainer<K, undefined> {
  constructor(container: initContainer<K> = []) {
    super();
    const self = this;
    container.forEach(function (el) {
      self.insert(el);
    });
  }
  begin() {
    return new HashSetIterator(this._head, this._header);
  }
  end() {
    return new HashSetIterator(this._header, this._header);
  }
  rBegin() {
    return new HashSetIterator(this._tail, this._header, IteratorType.REVERSE);
  }
  rEnd() {
    return new HashSetIterator(this._header, this._header, IteratorType.REVERSE);
  }
  front(): K | undefined {
    return this._head._key;
  }
  back(): K | undefined {
    return this._tail._key;
  }
  /**
   * @description Insert element to set.
   * @param key - The key want to insert.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @returns The size of container after inserting.
   */
  insert(key: K, isObject?: boolean) {
    return this._set(key, undefined, isObject);
  }
  /**
   * @description Check key if exist in container.
   * @param key - The element you want to search.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @returns An iterator pointing to the element if found, or super end if not found.
   */
  find(key: K, isObject?: boolean) {
    const node = this._findElementNode(key, isObject);
    return new HashSetIterator(node, this._header);
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let node = this._head;
    while (pos--) {
      node = node._next;
    }
    return node._key;
  }
  forEach(callback: (element: K, index: number, container: HashSet<K>) => void) {
    let index = 0;
    let node = this._head;
    while (node !== this._header) {
      callback(node._key, index++, this);
      node = node._next;
    }
  }
  [Symbol.iterator]() {
    return function * (this: HashSet<K>) {
      let node = this._head;
      while (node !== this._header) {
        yield node._key;
        node = node._next;
      }
    }.bind(this)();
  }
}

export default HashSet;
