import { Entries } from '@/base';
import { ITERATOR_TYPE } from '@/base/iterator';
import { HashContainer, HashLinkNode } from '@/hash/base';
import { HashContainerIterator } from '@/hash/hash-iterator';
import { throwIteratorAccessError } from '@/utils/throwError';

class HashSetIterator<K> extends HashContainerIterator<K, undefined> {
  readonly container: HashSet<K>;
  constructor(props: {
    node: HashLinkNode<K, undefined>,
    header: HashLinkNode<K, undefined>,
    container: HashSet<K>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    this.container = props.container;
  }
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    return this._node._key;
  }
  copy() {
    return new HashSetIterator<K>({
      node: this._node,
      header: this._header,
      container: this.container,
      type: this.type
    });
  }
  // @ts-ignore
  equals(iter: HashSetIterator<K>): boolean;
}

export type { HashSetIterator };

class HashSet<K> extends HashContainer<K, undefined> {
  constructor(entries: Entries<K> = []) {
    super();
    const self = this;
    entries.forEach(function (el) {
      self.add(el);
    });
  }
  begin() {
    return new HashSetIterator<K>({
      node: this._head,
      header: this._header,
      container: this
    });
  }
  end() {
    return new HashSetIterator<K>({
      node: this._header,
      header: this._header,
      container: this
    });
  }
  rBegin() {
    return new HashSetIterator<K>({
      node: this._tail,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  rEnd() {
    return new HashSetIterator<K>({
      node: this._header,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  front(): K | undefined {
    return this._head._key;
  }
  back(): K | undefined {
    return this._tail._key;
  }
  /**
   * @description Insert item to set.
   * @param key - The key want to insert.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @returns The size of container after inserting.
   */
  add(key: K, isObject?: boolean) {
    this._set(key, undefined, isObject);
    return this;
  }
  protected _at(index: number) {
    let node = this._head;
    while (index--) {
      node = node._next;
    }
    return node._key;
  }
  /**
   * @description Check key if exist in container.
   * @param key - The item you want to search.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @returns An iterator pointing to the item if found, or super end if not found.
   */
  find(key: K, isObject?: boolean) {
    const node = this._getHashLinkNodeByKey(key, isObject);
    return new HashSetIterator<K>({
      node,
      header: this._header,
      container: this
    });
  }
  forEach(callback: (value: K, index: number, container: this) => void) {
    let index = 0;
    let node = this._head;
    while (node !== this._header) {
      callback(node._key, index++, this);
      node = node._next;
    }
  }
  * [Symbol.iterator]() {
    let node = this._head;
    while (node !== this._header) {
      yield node._key;
      node = node._next;
    }
  }
  entries(): IterableIterator<[K, K]> {
    const self = this;
    let node = this._head;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            done,
            value: undefined as unknown as [K, K]
          };
        }
        const value = <[K, K]>[node._key, node._key];
        node = node._next;
        return {
          done,
          value
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  }
  every(callback: (value: K, index: number, container: this) => unknown) {
    let index = 0;
    let node = this._head;
    while (node !== this._header) {
      const flag = callback(node._key, index++, this);
      if (!flag) return false;
      node = node._next;
    }
    return true;
  }
  filter(callback: (value: K, index: number, container: this) => unknown) {
    let index = 0;
    let node = this._head;
    const filtered: K[] = [];
    while (node !== this._header) {
      const item = node._key;
      const flag = callback(item, index++, this);
      if (flag) filtered.push(item);
      node = node._next;
    }
    return new HashSet(filtered);
  }
  some(callback: (value: K, index: number, container: this) => unknown) {
    let index = 0;
    let node = this._head;
    while (node !== this._header) {
      const flag = callback(node._key, index++, this);
      if (flag) return true;
      node = node._next;
    }
    return false;
  }
  values() {
    return this.keys();
  }
}

export default HashSet;
