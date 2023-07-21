/**
 * @description Compare function.
 */
export type CompareFn<T> = (a: T, b: T) => number;

/**
 * @description Compare items from small to large.
 */
export function compareFromS2L<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * @description Compare items from large to small.
 */
export function compareFromL2S<T>(a: T, b: T): number {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
}
