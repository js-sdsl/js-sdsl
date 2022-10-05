// https://gist.github.com/badboy/6267743#using-multiplication-for-hashing
function get32BitHashCode(key: number) {
  const c2 = 0x27d4eb2d;
  key = (key ^ 61) ^ (key >>> 16);
  key = key + (key << 3);
  key = key ^ (key >>> 4);
  key = key * c2;
  key = key ^ (key >>> 15);
  return key;
}

// https://gist.github.com/badboy/6267743#64-bit-mix-functions
function get64BitHashCode(key: number) {
  key = (~key) + (key << 21);
  key = key ^ (key >>> 24);
  key = (key + (key << 3)) + (key << 8);
  key = key ^ (key >>> 14);
  key = (key + (key << 2)) + (key << 4);
  key = key ^ (key >>> 28);
  key = key + (key << 31);
  return key;
}

function getIntegerHashCode(key: number) {
  if (key < -0x80000000 || key > 0x7fffffff) {
    return get64BitHashCode(key);
  }
  return get32BitHashCode(key);
}

// https://stackoverflow.com/questions/19655733/how-to-use-unordered-set-that-has-elements-that-are-vector-of-pairint-int/19740245#19740245
function getPairHashCode(a: number, b: number) {
  a ^= b + 0x9e3779b9 + (a << 6) + (a >> 2);
  return a;
}

function getNumberHashCode(key: number) {
  if (key % 1 === 0) {
    return getIntegerHashCode(key);
  }
  const [integer, decimal] = key.toFixed(6).split('.') as unknown as [number, number];
  return getPairHashCode(getIntegerHashCode(integer), get32BitHashCode(decimal));
}

function getStringHashCode(key: string) {
  let hashCode = 0;
  const strLength = key.length;
  for (let i = 0; i < strLength; ++i) {
    const ch = key.charCodeAt(i);
    hashCode = ((hashCode << 5) - hashCode) + ch;
    hashCode |= 0;
  }
  return hashCode >>> 0;
}

export default function getHashCode<K>(x: K) {
  const type = typeof x;
  if (type === 'number') {
    return getNumberHashCode(x as unknown as number);
  } else if (type === 'string') {
    return getStringHashCode(x as unknown as string);
  } else return getStringHashCode(JSON.stringify(x));
}
