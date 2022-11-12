export function generateRandomNumber(low = 0, high = 1e6, fix = 6) {
  return (low + Math.random() * (high - low)).toFixed(fix);
}

export function generateRandomString() {
  const length = Math.ceil(Math.random() * 10);
  const base = 'a'.charCodeAt(0);
  let str = '';
  for (let i = 0; i < length; ++i) {
    const random = Math.floor(Math.random() * 26);
    str += String.fromCharCode(base + random);
  }
  return str;
}

export function generateRandomSymbol() {
  return Symbol(generateRandomString());
}

export function generateRandomBigInt() {
  return BigInt(generateRandomNumber(0, 1e20, 0));
}

export function generateRandomObject() {
  const obj: Record<string, string> = {};
  obj[generateRandomString()] = generateRandomString();
  return obj;
}

export function generateRandomFunction() {
  return () => {
    return Math.random();
  };
}
