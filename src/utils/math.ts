/**
 * @description Same to Math.ceil(a / b).
 * @param a - numerator.
 * @param b - Denominator.
 * @internal
 */
export function ceil(a: number, b: number) {
  return Math.floor((a + b - 1) / b);
}

/**
 * @internal
 */
export const floor = Math.floor;
