export function generateRandom(low = 0, high = 1e6) {
  return (low + Math.random() * (high - low));
}
