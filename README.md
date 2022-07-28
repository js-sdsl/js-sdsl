<p align="center">
  <h1 align="center">
    <a href="https://github.com/ZLY201/js-sdsl">js-sdsl</a>
  </h1 align="center">
</p>

<p align="center">
  <h3 align="center">
    A javascript standard data structure library which benchmark against C++ STL.
  </h3 align="center">
</p>

<p align="center">
  <a target="_blank" href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/v/js-sdsl?color=blue" alt="version" /></a>
  <a target="_blank" href="https://github.com/zly201/js-sdsl/actions"><img src="https://github.com/zly201/js-sdsl/workflows/js-sdsl%20CI/badge.svg?branch=dev" alt="action status" /></a>
  <a target="_blank" href="https://coveralls.io/github/ZLY201/js-sdsl"><img src="https://coveralls.io/repos/github/ZLY201/js-sdsl/badge.svg?branch=dev" alt="coverage status" /></a>
  <a target="_blank" href="https://github.com/ZLY201/js-sdsl"><img src="https://img.shields.io/github/stars/zly201/js-sdsl.svg" alt="stars" /></a>
  <a target="_blank" href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/dm/js-sdsl" alt="downloads" /></a>
  <a target="_blank" href="https://github.com/ZLY201/js-sdsl/blob/dev/LICENSE"><img src="https://img.shields.io/npm/l/js-sdsl?color=%230969da" alt="license" /></a>
  <a target="_blank" href="https://coveralls.io/github/ZLY201/js-sdsl"><img src="https://img.shields.io/github/languages/top/zly201/js-sdsl.svg?branch=dev" alt="top language" /></a>
</p>

<p align="center">English | <a href="https://github.com/ZLY201/js-sdsl/blob/dev/README.zh-CN.md">简体中文</a></p>

## Included data structures

- Vector
- Stack
- Queue
- LinkList
- Deque
- PriorityQueue
- OrderedSet (using RBTree)
- OrderedMap (using RBTree)
- HashSet
- HashMap

## Supported platforms

- node.js (using commonjs)
- react/vue (using es5)
- browser (support most browsers)

## Download

Download directly

- [js-sdsl.js](https://zly201.github.io/js-sdsl/js-sdsl.js) (for development)
- [js-sdsl.min.js](https://zly201.github.io/js-sdsl/js-sdsl.min.js) (for production)

Or install js-sdsl using npm

```bash
npm install js-sdsl
```

## Usage

To help you have a better use, we provide this [API document](https://zly201.github.io/js-sdsl/index.html).

### For Browser

```html
<!-- you can download the file locally and import it or import it dynamically by using url. -->
<script src="https://zly201.github.io/js-sdsl/js-sdsl.min.js"></script>
<script>
    const { 
      Vector,
      Stack,
      Queue,
      LinkList,
      Deque,
      PriorityQueue,
      OrderedSet,
      OrderedMap,
      HashSet,
      HashMap
    } = sdsl;
    const myOrderedMap = new OrderedMap();
    myOrderedMap.setElement(1, 2);
    console.log(myOrderedMap.getElementByKey(1)); // 2
</script>
```

## Build by source code

You can pull this repository and run `yarn build` to rebuild this library.

## Unit test

### For check

We use jest library to write unit tests, you can see test coverage on [coveralls](https://coveralls.io/github/ZLY201/js-sdsl). You can run `yarn test:check` command to reproduce it.

### For performance

We tested most of the functions for efficiency. You can go to `testResult.txt` to see our running results or reproduce it with `yarn test:performance` command.

The following is a partial interception of the performance test:

```bash
=================================== OrderedSet ===================================
┌─────────┬─────────────────────┬─────────┬───────────────┬─────────┐
│ (index) │      testFunc       │ testNum │ containerSize │ runTime │
├─────────┼─────────────────────┼─────────┼───────────────┼─────────┤
│    0    │    'constructor'    │    1    │    1000000    │  1969   │
│    1    │      'insert'       │ 1000000 │    2000000    │   617   │
│    2    │ 'eraseElementByKey' │ 1000000 │    3000000    │   496   │
│    3    │ 'eraseElementByPos' │   10    │    3000000    │   603   │
│    4    │       'union'       │    1    │    2999990    │  3531   │
│    5    │    'lowerBound'     │ 1000000 │    2999990    │  1127   │
│    6    │    'upperBound'     │ 1000000 │    2999990    │  1492   │
│    7    │ 'reverseLowerBound' │ 1000000 │    2999990    │  1131   │
│    8    │ 'reverseUpperBound' │ 1000000 │    2999990    │  1143   │
└─────────┴─────────────────────┴─────────┴───────────────┴─────────┘
=================================== OrderedMap ===================================
┌─────────┬─────────────────────┬─────────┬───────────────┬─────────┐
│ (index) │      testFunc       │ testNum │ containerSize │ runTime │
├─────────┼─────────────────────┼─────────┼───────────────┼─────────┤
│    0    │    'constructor'    │    1    │    1000000    │  2259   │
│    1    │    'setElement'     │ 1000000 │    2000000    │   875   │
│    2    │ 'eraseElementByKey' │ 1000000 │    2000000    │   426   │
│    3    │ 'eraseElementByPos' │   100   │    1000000    │  4722   │
│    4    │       'union'       │    1    │    1999900    │  5106   │
│    5    │    'lowerBound'     │ 1000000 │    1999900    │  1279   │
│    6    │    'upperBound'     │ 1000000 │    1999900    │  1197   │
│    7    │ 'reverseLowerBound' │ 1000000 │    1999900    │  1222   │
│    8    │ 'reverseUpperBound' │ 1000000 │    1999900    │  1347   │
└─────────┴─────────────────────┴─────────┴───────────────┴─────────┘
```

## Maintainers

[@ZLY201](https://github.com/ZLY201)

## Contributing

Feel free to dive in! Open an issue or submit PRs. It may be helpful to read the [Contributor Guide](https://github.com/ZLY201/js-sdsl/blob/main/.github/CONTRIBUTING.md).

### Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/takatoshi-kondo-02a91410/"><img src="https://avatars.githubusercontent.com/u/275959?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Takatoshi Kondo</b></sub></a><br /><a href="https://github.com/ZLY201/js-sdsl/commits?author=redboltz" title="Code">💻</a> <a href="https://github.com/ZLY201/js-sdsl/commits?author=redboltz" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[MIT](https://github.com/ZLY201/js-sdsl/blob/main/LICENSE) © ZLY201
