import { initContainer } from '@/container/ContainerBase';
import HashContainer from '@/container/HashContainer/Base';

class HashMap<K, V> extends HashContainer<K, V> {
  constructor(container: initContainer<[K, V]> = []) {
    super();
    const self = this;
    container.forEach(function (el) {
      self.setElement(el[0], el[1]);
    });
  }
  setElement(key: K, value: V) {
    this._set(key, value);
  }
  getElementByKey(key: K) {
    const hashCode = this._hash(key);
    if (hashCode === '') {
      return this._objMap[
        (key as unknown as Record<string, number>)[HashContainer.HASH_KEY_TAG]
      ][1];
    } else return this._originMap[hashCode];
  }
  forEach(callback: (element: [K, V], index: number, hashMap: HashMap<K, V>) => void) {
    let index = 0;
    const self = this;
    this._objMap.forEach(function (el) {
      callback(el, index++, self);
    });
    Object.keys(this._originMap).forEach((el) => {
      const [elString, suffix] = el.split('_') as [string, string];
      callback(
        [
          HashContainer.HASH_CODE_PREFIX_MAP[
            suffix
          ](elString) as K, this._originMap[el]
        ],
        index++,
        self
      );
    });
  }
  [Symbol.iterator]() {
    return function * (this: HashMap<K, V>) {
      yield * this._objMap;
      const keys = Object.keys(this._originMap);
      const originMapLength = keys.length;
      for (let i = 0; i < originMapLength; ++i) {
        const el = keys[i];
        const [elString, suffix] = el.split('_') as [string, string];
        yield [
          HashContainer.HASH_CODE_PREFIX_MAP[suffix](elString), this._originMap[el]
        ] as [K, V];
      }
    }.bind(this)();
  }
}

export default HashMap;
