/**
 * @description throw iterator access error
 * @internal
 */
export function throwIteratorAccessError() {
  throw new RangeError('Iterator access denied!');
}
