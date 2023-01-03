import { compareFunction, insertionSort } from './sort';
import { SORT_CONSTANT } from '@/algorithm/constant';
import type { Deque, Vector } from '@/index';

function getMedian<T>(
  a: T,
  b: T,
  c: T,
  cmp: (x: T, y: T) => number
) {
  // Total of 3x2x1=6 situations
  if (cmp(a, b) < 0) {
    if (cmp(b, c) < 0) {
      return b; // a < b < c
    } else if (cmp(a, c) < 0) {
      return c; // a < c < b
    } else {
      return a; // c < a < b
    }
  } else if (cmp(a, c) < 0) {
    return a; // b < a < c
  } else if (cmp(b, c) < 0) {
    return c; // b < c < a
  } else {
    return b; // c < b < a
  }
}

function unguardedPartition<T>(
  arr: T[],
  first: number,
  last: number,
  pivot: T,
  cmp: (x: T, y: T) => number
) {
  while (true) {
    while (cmp(arr[first], pivot) < 0) ++first;
    --last;
    while (cmp(arr[last], pivot) > 0) --last;
    if (first >= last) return first;
    [arr[first], arr[last]] = [arr[last], arr[first]];
    ++first;
  }
}

function _nthElement<T>(
  arr: T[],
  first: number,
  nth: number,
  last: number,
  cmp: (x: T, y: T) => number
) {
  while (last - first < SORT_CONSTANT.INSERT_SORT_MAX) {
    const mid = (first + last) >> 1;
    const median = getMedian(arr[first], arr[last], arr[mid], cmp);
    const cut = unguardedPartition(arr, first, last, median, cmp);
    if (cut <= nth) first = nth;
    else last = nth;
  }
  return insertionSort(arr, { cmp, first, last });
}

type NthElementOptions<T> = {
  cmp?: (x: T, y: T) => number,
  first?: number,
  last?: number,
}

export default function nthElement<T>(
  container: Array<T> | Vector<T> | Deque<T>,
  nth: number,
  options: NthElementOptions<T> = {}
) {
  const length = container.length;
  if (nth <= 0 || length === 0) return [];
  const {
    cmp = compareFunction,
    first = 0,
    last = length
  } = options;
  const copied = Array.from(container);
  return _nthElement(copied, first, nth, last, cmp);
}
