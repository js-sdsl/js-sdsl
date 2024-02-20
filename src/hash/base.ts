import { Container } from '@/base';
import { HashContainerIterator } from '@/hash/hash-iterator';
import checkObject from '@/utils/checkObject';
import { throwIteratorAccessError } from '@/utils/throwError';

export type HashLinkNode<K, V> = {
  _key: K,
  _value: V,
  _prev: HashLinkNode<K, V>,
  _next: HashLinkNode<K, V>
}

export abstract class HashContainer<K, V> extends Container<K | [K, V]> {
  /**
   * @internal
   */
  protected _objMap: HashLinkNode<K, V>[] = [];
  /**
   * @internal
   */
  protected _originMap: Record<string, HashLinkNode<K, V>> = {};
  /**
   * @internal
   */
  protected _head: HashLinkNode<K, V>;
  /**
   * @internal
   */
  protected _tail: HashLinkNode<K, V>;
  /**
   * @internal
   */
  protected readonly _header: HashLinkNode<K, V>;
  /**
   * @description Unique symbol used to tag object.
   */
  readonly HASH_TAG = Symbol('@@HASH_TAG');
  /**
   * @internal
   */
  protected constructor() {
    super();
    Object.setPrototypeOf(this._originMap, null);
    this._header = <HashLinkNode<K, V>>{};
    this._header._prev = this._header._next = this._head = this._tail = this._header;
  }
  /**
   * @internal
   */
  protected _eraseNode(node: HashLinkNode<K, V>) {
    const { _prev, _next } = node;
    _prev._next = _next;
    _next._prev = _prev;
    if (node === this._head) {
      this._head = _next;
    }
    if (node === this._tail) {
      this._tail = _prev;
    }
    this._length -= 1;
  }
  /**
   * @internal
   */
  protected _set(key: K, value?: V, isObject = checkObject(key)) {
    let newTail;
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_TAG];
      if (index !== undefined) {
        this._objMap[<number>index]._value = <V>value;
        return this._length;
      }
      Object.defineProperty(key, this.HASH_TAG, {
        value: this._objMap.length,
        configurable: true
      });
      newTail = {
        _key: key,
        _value: <V>value,
        _prev: this._tail,
        _next: this._header
      };
      this._objMap.push(newTail);
    } else {
      const node = this._originMap[<string><unknown>key];
      if (node) {
        node._value = <V>value;
        return this._length;
      }
      this._originMap[<string><unknown>key] = newTail = {
        _key: key,
        _value: <V>value,
        _prev: this._tail,
        _next: this._header
      };
    }
    if (this._length === 0) {
      this._head = newTail;
      this._header._next = newTail;
    } else {
      this._tail._next = newTail;
    }
    this._tail = newTail;
    this._header._prev = newTail;
    this._length += 1;
  }
  /**
   * @internal
   */
  protected _getHashLinkNodeByKey(key: K, isObject = checkObject(key)) {
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_TAG];
      if (index === undefined) return this._header;
      return this._objMap[index];
    } else {
      return this._originMap[<string><unknown>key] || this._header;
    }
  }
  clear() {
    const { HASH_TAG } = this;
    this._objMap.forEach(function (el) {
      delete (<Record<symbol, number>><unknown>el._key)[HASH_TAG];
    });
    this._objMap = [];
    this._originMap = {};
    Object.setPrototypeOf(this._originMap, null);
    this._length = 0;
    this._head = this._tail = this._header._prev = this._header._next = this._header;
  }
  /**
   * @description Remove the item of the specified key.
   * @param key - The key you want to remove.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If an `undefined` value is passed in, the type will be automatically judged.
   * @returns Whether erase successfully.
   */
  delete(key: K, isObject = checkObject(key)) {
    let node;
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_TAG];
      if (index === undefined) return false;
      delete (<Record<symbol, number>><unknown>key)[this.HASH_TAG];
      node = this._objMap[index];
      delete this._objMap[index];
    } else {
      node = this._originMap[<string><unknown>key];
      if (node === undefined) return false;
      delete this._originMap[<string><unknown>key];
    }
    this._eraseNode(node);
    return true;
  }
  erase(iter: HashContainerIterator<K, V>) {
    const node = iter._node;
    if (node === this._header) {
      throwIteratorAccessError();
    }
    this._eraseNode(node);
    return iter.next();
  }
  keys(): IterableIterator<K> {
    const self = this;
    let node = this._head;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            done,
            value: undefined as unknown as K
          };
        }
        const value = node._key;
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
  abstract filter(
    callback: (value: K | [K, V], index: number, container: this) => unknown
  ): HashContainer<K, V>;
}
