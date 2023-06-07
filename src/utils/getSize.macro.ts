import { initContainer } from 'src/base';

/**
 * @param container The init container.
 * @returns The size or length of the container.
 * @internal
 */
export default function $getSize<T>(container: initContainer<T>) {
  const length = container.length;
  if (typeof length === 'number') return length;
  const size = container.size;
  if (typeof size === 'number') return size;
  throw new TypeError('Cannot get the length or size of the container');
}
