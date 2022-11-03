/**
 * @description Determine whether the type of key is `object`.
 * @param key The key want to check.
 * @return Boolean about whether the type of key is `object`.
 * @internal
 */
export default function checkObject<T>(key: T) {
  if (key === null) return false;
  const t = typeof key;
  return t === 'object' || t === 'function';
}
