import { Base } from '@/container/ContainerBase';

abstract class HashContainer<K, V> extends Base {
  /**
   * @internal
   */
  protected _objMap: [K, V][] = [];
  /**
   * @internal
   */
  protected _originMap: Record<string, [K, V]> = {};
  /**
   * @internal
   */
  protected readonly HASH_KEY_TAG = Symbol('JS_SDSL_HASH_KEY_TAG');
  /**
   * @internal
   */
  protected _set(key: K, value?: V) {
    const t = typeof key;
    if (t === 'string' || t === 'number' || t === 'boolean' || key === undefined || key === null) {
      const originValue = this._originMap[<string><unknown>key];
      if (originValue) {
        originValue[1] = <V>value;
        return;
      }
      this._originMap[<string><unknown>key] = [key, <V>value];
    } else {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG];
      if (index !== undefined) {
        this._objMap[<number>index][1] = <V>value;
        return;
      }
      Object.defineProperty(key, this.HASH_KEY_TAG, {
        value: this._objMap.length,
        configurable: true
      });
      this._objMap.push([key, <V>value]);
    }
    this._length += 1;
  }
  clear() {
    const self = this;
    this._objMap.forEach(function (el) {
      delete (<Record<symbol, number>><unknown>el[0])[self.HASH_KEY_TAG];
    });
    this._objMap = [];
    this._originMap = {};
    this._length = 0;
  }
  eraseElementByKey(key: K) {
    const t = typeof key;
    if (t === 'string' || t === 'number' || t === 'boolean' || key === undefined || key === null) {
      if (this._originMap[<string><unknown>key] === undefined) return;
      delete this._originMap[<string><unknown>key];
    } else {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG];
      if (index === undefined) return;
      delete (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG];
      delete this._objMap[index];
    }
    this._length -= 1;
  }
  find(key: K) {
    const t = typeof key;
    if (t === 'string' || t === 'number' || t === 'boolean' || key === undefined || key === null) {
      return this._originMap[<string><unknown>key] !== undefined;
    } else {
      return typeof (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG] === 'number';
    }
  }
  abstract forEach(
    callback: (element: K | [K, V], index: number, hashContainer: HashContainer<K, V>) => void
  ): void;
  abstract [Symbol.iterator](): Generator<K | [K, V], void, undefined>;
}

export default HashContainer;
