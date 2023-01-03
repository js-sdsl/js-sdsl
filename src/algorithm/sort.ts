import type { Vector, Deque } from '@/index';

export function compareFunction<T>(x: T, y: T): number {
  if (x < y) return -1;
  else if (x > y) return 1;
  return 0;
}

type SortOptions<T> = {
  cmp?: (x: T, y: T) => number,
  first?: number,
  last?: number,
}

export function insertionSort<T>(
  container: Array<T> | Vector<T> | Deque <T>,
  options: SortOptions<T> = {}
): T[] {
  const copied = Array.from(container);
  const length = copied.length;
  const {
    cmp = compareFunction,
    first = 0,
    last = length
  } = options;
  for (let i = first; i < last; ++i) {
    let pre = i - 1;
    const cur = copied[i];
    while (pre >= first && cmp(copied[pre], cur) > 0) {
      copied[pre + 1] = copied[pre];
      --pre;
    }
    copied[pre + 1] = cur;
  }
  return copied;
}
