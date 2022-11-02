/**
 * @description Determine whether the type of key is not object.
 * @param key The key want to check.
 * @return Boolean about whether the type of key is not object.
 * @internal
 */
export function checkNotObject<T>(key: T) {
  const t = typeof key;
  return t === 'string' ||
    t === 'number' ||
    t === 'bigint' ||
    t === 'symbol' ||
    t === 'boolean' ||
    key === undefined ||
    key === null;
}
