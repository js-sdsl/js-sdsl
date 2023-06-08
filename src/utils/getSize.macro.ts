import { Entries } from '@/base';

/**
 * @param entries The init container.
 * @returns The size or length of the container.
 * @internal
 */
export default function $getSize<T>(entries: Entries<T>) {
  const length = entries.length;
  if (typeof length === 'number') return length;
  const size = entries.size;
  if (typeof size === 'number') return size;
  throw new TypeError('Cannot get the length or size of the container');
}
