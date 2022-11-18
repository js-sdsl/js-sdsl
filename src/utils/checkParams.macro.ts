/**
 * @description Check if access is out of bounds.
 * @param pos - The position want to access.
 * @param lower - The lower bound.
 * @param upper - The upper bound.
 * @returns Whether access is out of bounds.
 * @internal
 */
export default function $checkWithinAccessParams(pos: number, lower: number, upper: number) {
  if (pos < lower || pos > upper) {
    throw new RangeError();
  }
}
