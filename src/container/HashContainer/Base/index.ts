import { Base } from '@/container/ContainerBase';

abstract class HashContainer<K, V> extends Base {
  /**
   * @internal
   */
  protected _objMap: [K, V][] = [];
  /**
   * @internal
   */
  protected _originMap: Record<string, V> = {};
  /**
   * @internal
   */
  protected static readonly HASH_KEY_TAG = 'JS_SDSL_HASH_KEY_TAG';
  /**
   * @internal
   */
  protected static HASH_CODE_PREFIX_MAP: Record<string, (el: string) => unknown> = {
    U: function () {
      return undefined;
    },
    B: Boolean,
    N: Number,
    S: String
  };
  /**
   * @internal
   */
  protected _hash(key: K) {
    let suffix;
    const t = typeof key;
    if (t === 'string') suffix = 'S';
    else if (t === 'number') suffix = 'N';
    else if (t === 'boolean') suffix = 'B';
    else if (key === undefined || key === null) suffix = 'U';
    else return '';
    return key + '_' + suffix;
  }
  /**
   * @internal
   */
  protected _set(key: K, value: V) {
    if (value === undefined || value === null) {
      this.eraseElementByKey(key);
      return;
    }
    let originValue;
    const t = typeof key;
    if (t === 'string' || t === 'number' || t === 'boolean' || key === undefined || key === null) {
      const hashCode = this._hash(key);
      originValue = this._originMap[hashCode];
      this._originMap[hashCode] = value;
    } else {
      const index = (key as unknown as Record<string, unknown>)[HashContainer.HASH_KEY_TAG];
      if (index !== undefined) {
        this._objMap[index as number][1] = value;
        return;
      }
      Object.defineProperty(key, HashContainer.HASH_KEY_TAG, {
        value: this._objMap.length,
        configurable: true
      });
      this._objMap.push([key, value]);
    }
    if (originValue === undefined) this._length += 1;
  }
  clear() {
    this._objMap.forEach(function (el) {
      delete (el[0] as unknown as Record<string, unknown>)[HashContainer.HASH_KEY_TAG];
    });
    this._objMap = [];
    this._originMap = {};
    this._length = 0;
  }
  eraseElementByKey(key: K) {
    const t = typeof key;
    if (t === 'string' || t === 'number' || t === 'boolean' || key === undefined || key === null) {
      const hashCode = this._hash(key);
      if (this._originMap[hashCode] === undefined) return;
      delete this._originMap[hashCode];
    } else {
      const index = (key as unknown as Record<string, unknown>)[
        HashContainer.HASH_KEY_TAG
      ] as number | undefined;
      if (index === undefined) return;
      delete this._objMap[index];
    }
    this._length -= 1;
  }
  find(key: K) {
    const t = typeof key;
    if (t === 'string' || t === 'number' || t === 'boolean' || key === undefined || key === null) {
      const hashCode = this._hash(key);
      return this._originMap[hashCode] !== undefined;
    } else {
      return typeof (key as unknown as Record<string, unknown>)[HashContainer.HASH_KEY_TAG] ===
        'number';
    }
  }
  abstract forEach(
    callback: (element: K | [K, V], index: number, hashContainer: HashContainer<K, V>) => void
  ): void;
  abstract [Symbol.iterator](): Generator<K | [K, V], void, undefined>;
}

export default HashContainer;
