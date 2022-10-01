import { HashContainerConst } from '@/container/HashContainer/Base';
import { Vector, HashSet } from '@/index';
import { expect } from 'chai';

function generateRandom(low = 0, high = 1e6, fix = 6) {
  return (low + Math.random() * (high - low)).toFixed(fix);
}

const arr: string[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(generateRandom());
}

function judgeHashSet(myHashSet: HashSet<string>, stdSet: Set<string>) {
  expect(myHashSet.size()).to.equal(stdSet.size);
  stdSet.forEach((element) => {
    expect(myHashSet.find(element)).to.equal(true);
  });
}

describe('HashSet test', () => {
  it('constructor test', () => {
    // eslint-disable-next-line no-new
    expect(() => new HashSet([], 28)).to.throw(RangeError);
    expect(new HashSet().size()).to.equal(0);
  });

  it('HashSet hash function test', () => {
    judgeHashSet(
      // @ts-ignore
      new HashSet(arr.map(x => Math.floor(Number(x)))),
      new Set(arr.map(x => Math.floor(Number(x))))
    );
  });

  const myHashSet = new HashSet(arr);
  const stdSet = new Set(arr);

  it('HashSet insert function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashSet.insert(i.toString());
      stdSet.add(i.toString());
      const random = generateRandom();
      myHashSet.insert(random);
      stdSet.add(random);
    }
    judgeHashSet(myHashSet, stdSet);
  });

  it('HashSet forEach function test', () => {
    myHashSet.forEach((element) => {
      expect(stdSet.has(element)).to.equal(true);
    });
    let cnt = 0;
    for (const element of myHashSet) {
      ++cnt;
      expect(stdSet.has(element)).to.equal(true);
    }
    expect(cnt).to.equal(myHashSet.size());
  });

  it('HashSet eraseElementByKey function test', () => {
    for (let i = 0; i < testNum; ++i) {
      myHashSet.eraseElementByKey(arr[i]);
      stdSet.delete(arr[i]);
      const random = generateRandom();
      myHashSet.eraseElementByKey(random);
      stdSet.delete(random);
    }
    myHashSet.eraseElementByKey('-1');
    myHashSet.eraseElementByKey('-2');
    myHashSet.eraseElementByKey('-3');
    myHashSet.eraseElementByKey('-4');
    myHashSet.eraseElementByKey('-5');
    myHashSet.eraseElementByKey('-6');
    myHashSet.eraseElementByKey('-7');
    myHashSet.eraseElementByKey('-8');
    myHashSet.eraseElementByKey('-9');
    expect(myHashSet.find('-1')).to.equal(false);
    expect(myHashSet.find('-2')).to.equal(false);
    expect(myHashSet.find('-3')).to.equal(false);
    expect(myHashSet.find('-4')).to.equal(false);
    expect(myHashSet.find('-5')).to.equal(false);
    expect(myHashSet.find('-6')).to.equal(false);
    expect(myHashSet.find('-7')).to.equal(false);
    expect(myHashSet.find('-8')).to.equal(false);
    expect(myHashSet.find('-9')).to.equal(false);
    judgeHashSet(myHashSet, stdSet);
  });

  it('HashSet clear function test', () => {
    myHashSet.clear();
    stdSet.clear();
    judgeHashSet(myHashSet, stdSet);
  });

  it('HashSet empty test', () => {
    expect(myHashSet.find('1')).to.equal(false);
    myHashSet.insert(arr[0]);
    myHashSet.insert(arr[0]);
    expect(myHashSet.size()).to.equal(1);
    // @ts-ignore
    const bucketNum = myHashSet._bucketNum;
    // @ts-ignore
    myHashSet._bucketNum = HashContainerConst.maxBucketNum;
    // @ts-ignore
    myHashSet._reAllocate();
    // @ts-ignore
    myHashSet._hashTable[0] = new Vector();
    // @ts-ignore
    myHashSet._hashTable[myHashSet.bucketNum - 5] = new Vector();
    // @ts-ignore
    myHashSet._reAllocate(myHashSet.bucketNum);
    // @ts-ignore
    myHashSet._bucketNum = bucketNum;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, no-empty
    for (const _ of myHashSet) {}
  });

  it('HashSet normal test', () => {
    const st = new HashSet<string>();
    const stdSet = new Set<string>();
    for (let i = 0; i < testNum; ++i) {
      st.insert(i.toString());
      stdSet.add(i.toString());
    }
    judgeHashSet(st, stdSet);
    let size = testNum;
    for (let i = 0; i < testNum; ++i) {
      st.eraseElementByKey(i.toString());
      expect(st.size()).to.equal(--size);
    }
    expect(st.size()).to.equal(0);
  });

  it('HashSet hash func test', () => {
    const normalSet = new HashSet<string>();
    const st = new HashSet<string>([], undefined, () => -1);
    const stdSet = new Set<string>();
    const arr: string[] = [];
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      st.insert(random);
      normalSet.insert(random);
      stdSet.add(random);
      arr.push(random);
    }
    judgeHashSet(normalSet, stdSet);
    judgeHashSet(st, stdSet);
    for (let i = 0; i < testNum; ++i) {
      if (Math.random() > 0.5) {
        st.eraseElementByKey(arr[i]);
        normalSet.eraseElementByKey(arr[i]);
        stdSet.delete(arr[i]);
      }
    }
    judgeHashSet(normalSet, stdSet);
    judgeHashSet(st, stdSet);
    arr.length = 0;
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      st.insert(random);
      normalSet.insert(random);
      stdSet.add(random);
      arr.push(random);
    }
    judgeHashSet(normalSet, stdSet);
    judgeHashSet(st, stdSet);
    for (let i = 0; i < testNum; ++i) {
      if (Math.random() > 0.5) {
        st.eraseElementByKey(arr[i]);
        normalSet.eraseElementByKey(arr[i]);
        stdSet.delete(arr[i]);
      }
    }
    judgeHashSet(normalSet, stdSet);
    judgeHashSet(st, stdSet);
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      st.insert(random);
      normalSet.insert(random);
      stdSet.add(random);
      arr.push(random);
    }
    judgeHashSet(normalSet, stdSet);
    judgeHashSet(st, stdSet);
    for (let i = 0; i < testNum; ++i) {
      st.eraseElementByKey(arr[i]);
      normalSet.eraseElementByKey(arr[i]);
      stdSet.delete(arr[i]);
    }
    judgeHashSet(normalSet, stdSet);
    judgeHashSet(st, stdSet);
  });

  it('difficult test', () => {
    const hashSetList: HashSet<string>[] = [];
    for (let i = -10; i <= 10; ++i) {
      hashSetList.push(new HashSet<string>([], undefined, () => i));
    }
    const arr: string[] = [];
    for (let i = 0; i < testNum; ++i) {
      const random = Math.random().toFixed(6);
      stdSet.add(random);
      hashSetList.forEach(st => st.insert(random));
      arr.push(random);
    }
    hashSetList.forEach(st => judgeHashSet(st, stdSet));
    arr.forEach(v => {
      stdSet.delete(v);
      hashSetList.forEach(st => st.eraseElementByKey(v));
    });
    hashSetList.forEach(st => judgeHashSet(st, stdSet));
  });
});
