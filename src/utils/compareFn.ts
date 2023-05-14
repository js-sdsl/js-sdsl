export type CompareFn<T> = (a: T, b: T) => number;

export function compareFromS2L<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function compareFromL2S<T>(a: T, b: T): number {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
}
