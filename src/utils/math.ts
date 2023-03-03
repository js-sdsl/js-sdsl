export function max(a: number, b: number) {
  return a > b ? a : b;
}

export function ceil(a: number, b: number) {
  return Math.floor((a + b - 1) / b);
}

export const floor = Math.floor;
