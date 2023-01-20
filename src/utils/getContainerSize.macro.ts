import { initContainer } from '@/container/ContainerBase';

/**
 * @param container The init container.
 * @returns The size or length of the container.
 * @internal
 */
export default function $getContainerSize<T>(container: initContainer<T>) {
  if (typeof container.length === 'number') return container.length;
  if (typeof container.size === 'number') return container.size;
  if (typeof container.size === 'function') return container.size();
  throw new TypeError('Cannot get the length or size of the container');
}
