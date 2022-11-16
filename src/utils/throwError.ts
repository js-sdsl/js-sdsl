/**
 * @description Throw an iterator access error.
 * @internal
 */
export function throwIteratorAccessError() {
  throw new RangeError('Iterator access denied!');
}
