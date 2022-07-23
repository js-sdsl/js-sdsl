import {
  Vector,
  LinkList,
  Deque,
  OrderedSet,
  OrderedMap
} from '@/index';
import { RunTimeError } from '@/utils/error';
import { ContainerIterator } from '@/container/ContainerBase/index';

let arr: number[] = [];
const testNum = 10000;
for (let i = 0; i < testNum; ++i) {
  arr.push(Math.floor(Math.random() * testNum));
}
arr = Array.from(new Set(arr));
arr.sort((x, y) => x - y);

const containerArr = [
  new Vector(arr),
  new LinkList(arr),
  new Deque(arr),
  new OrderedSet(arr),
  new OrderedMap(arr.map((element, index) => [index, element]))
];

describe('iterator test', () => {
  test('normal iterator next function test', () => {
    for (const container of containerArr) {
      let index = 0;
      for (let it = container.begin() as ContainerIterator<unknown, unknown>;
        !it.equals(container.end() as ContainerIterator<unknown, unknown>);
        it = it.next()) {
        if (container instanceof OrderedMap) {
          expect((it as ContainerIterator<[number, number], unknown>).pointer[1])
            .toEqual(arr[index++]);
        } else {
          expect(it.pointer).toEqual(arr[index++]);
        }
      }
    }
  });

  test('normal iterator pre function test', () => {
    for (const container of containerArr) {
      let index = arr.length - 1;
      for (let it = container.end().pre() as ContainerIterator<unknown, unknown>;
        !it.equals(container.begin() as ContainerIterator<unknown, unknown>);
        it = it.pre()) {
        if (container instanceof OrderedMap) {
          expect((it as ContainerIterator<[number, number], unknown>).pointer[1])
            .toEqual(arr[index--]);
        } else {
          expect(it.pointer).toEqual(arr[index--]);
        }
      }
    }
  });

  test('reverse iterator next function test', () => {
    for (const container of containerArr) {
      let index = arr.length - 1;
      for (let it = container.rBegin() as ContainerIterator<unknown, unknown>;
        !it.equals(container.rEnd() as ContainerIterator<unknown, unknown>);
        it = it.next()) {
        if (container instanceof OrderedMap) {
          expect((it as ContainerIterator<[number, number], unknown>).pointer[1])
            .toEqual(arr[index--]);
        } else {
          expect(it.pointer).toEqual(arr[index--]);
        }
      }
    }
  });

  test('reverse iterator pre function test', () => {
    for (const container of containerArr) {
      let index = 0;
      for (let it = container.rEnd().pre() as ContainerIterator<unknown, unknown>;
        !it.equals(container.rBegin() as ContainerIterator<unknown, unknown>);
        it = it.pre()) {
        if (container instanceof OrderedMap) {
          expect((it as ContainerIterator<[number, number], unknown>).pointer[1])
            .toEqual(arr[index++]);
        } else {
          expect(it.pointer).toEqual(arr[index++]);
        }
      }
    }
  });

  for (const container of containerArr) {
    test('normal iterator next run time error test', () => {
      expect(() => container.end().next()).toThrowError(RunTimeError);
    });

    test('normal iterator pre run time error test', () => {
      expect(() => container.begin().pre()).toThrowError(RunTimeError);
    });

    test('reverse iterator next run time error test', () => {
      expect(() => container.rEnd().next()).toThrowError(RunTimeError);
    });

    test('reverse iterator pre run time error test', () => {
      expect(() => container.rBegin().pre()).toThrowError(RunTimeError);
    });

    test('normal iterator type error test', () => {
      // @ts-ignore
      expect(() => container.begin().equals(container.rBegin())).toThrowError(TypeError);
    });

    test('reverse iterator next type error test', () => {
      // @ts-ignore
      expect(() => container.rEnd().equals(container.begin())).toThrowError(TypeError);
    });

    test('normal iterator type error test', () => {
      // @ts-ignore
      expect(() => container.begin().equals({})).toThrowError(TypeError);
    });

    test('reverse iterator next type error test', () => {
      // @ts-ignore
      expect(() => container.rEnd().equals({})).toThrowError(TypeError);
    });
  }
});
