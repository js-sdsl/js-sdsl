import { initContainer } from '@/container/ContainerBase';
import HashContainerBase from '@/container/HashContainer/Base';

class HashSet<K> extends HashContainerBase<K, boolean> {
  constructor(container: initContainer<K> = []) {
    super();
    const self = this;
    container.forEach(function (el) {
      self.insert(el);
    });
  }
  insert(key: K) {
    this._set(key, true);
  }
  forEach(callback: (element: K, index: number, hashSet: HashSet<K>) => void) {
    let index = 0;
    const self = this;
    this._objMap.forEach(function (el) {
      callback(el[0], index++, self);
    });
    Object.keys(this._originMap).forEach((el) => {
      const [elString, suffix] = el.split('_') as [string, string];
      callback(
        HashContainerBase.HASH_CODE_PREFIX_MAP[suffix](elString) as unknown as K,
        index++,
        self
      );
    });
  }
  [Symbol.iterator]() {
    return function * (this: HashSet<K>) {
      const objMapLength = this._objMap.length;
      for (let i = 0; i < objMapLength; ++i) {
        yield this._objMap[i][0];
      }
      const keys = Object.keys(this._originMap);
      const originMapLength = keys.length;
      for (let i = 0; i < originMapLength; ++i) {
        const el = keys[i];
        const [elString, suffix] = el.split('_') as [string, string];
        yield HashContainerBase.HASH_CODE_PREFIX_MAP[suffix](elString) as K;
      }
    }.bind(this)();
  }
}

export default HashSet;
