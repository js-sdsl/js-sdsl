<p align="center">
  <a href="https://js-sdsl.github.io/" target="_blank"  rel="noopener noreferrer">
    <img src="https://js-sdsl.github.io/assets/logo-removebg.png" alt="js-sdsl logo" width="120" />
  </a>
</p>

<h3><p align="center">A javascript standard data structure library which benchmark against C++ STL</p></h3>

<p align="center">
  <a href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/v/js-sdsl" alt="NPM version" /></a>
  <a href="https://github.com/ZLY201/js-sdsl/actions?query=branch%3Amain"><img src="https://github.com/ZLY201/js-sdsl/actions/workflows/build.yml/badge.svg?branch=main" alt="Build Status" /></a>
  <a href='https://coveralls.io/github/ZLY201/js-sdsl?branch=main'><img src='https://coveralls.io/repos/github/ZLY201/js-sdsl/badge.svg?branch=main' alt='Coverage Status' /></a>
  <a href="https://github.com/ZLY201/js-sdsl"><img src="https://img.shields.io/github/stars/ZLY201/js-sdsl.svg" alt="GITHUB Star" /></a>
  <a href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/dm/js-sdsl.svg" alt="NPM Downloads" /></a>
  <a href="https://openbase.com/js/js-sdsl?utm_source=embedded&amp;utm_medium=badge&amp;utm_campaign=rate-badge"><img src="https://badges.openbase.com/js/rating/js-sdsl.svg?token=fh3LMNOV+JSWykSjtg1rA8kouSYkJoIDzGbvaByq5X0=" alt="Rate this package"/></a>
  <a href="https://github.com/ZLY201/js-sdsl/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/js-sdsl.svg" alt="MIT-license" /></a>
  <a href="https://github.com/ZLY201/js-sdsl/"><img src="https://img.shields.io/github/languages/top/ZLY201/js-sdsl.svg?branch=main" alt="GITHUB-language" /></a>
</p>

<p align="center">English | <a href="https://github.com/zly201/js-sdsl/blob/main/README.zh-CN.md">简体中文</a></p>

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

You can visit our [official website](https://js-sdsl.github.io/) to get more information.

To help you have a better use, we also provide this [API document](https://zly201.github.io/js-sdsl/index.html).

### For browser

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

### For npm

```javascript
// esModule
import { OrderedMap } from 'js-sdsl';
// commonJs
const { OrderedMap } = require('js-sdsl');
const myOrderedMap = new OrderedMap();
myOrderedMap.setElement(1, 2);
console.log(myOrderedMap.getElementByKey(1)); // 2
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
│    0    │    'constructor'    │    1    │    1000000    │  1625   │
│    1    │      'insert'       │ 1000000 │    2000000    │   565   │
│    2    │ 'eraseElementByKey' │ 1000000 │    3000000    │   340   │
│    3    │ 'eraseElementByPos' │   10    │    3000000    │   539   │
│    4    │       'union'       │    1    │    2999998    │  1580   │
│    5    │    'lowerBound'     │ 1000000 │    2999998    │  1147   │
│    6    │    'upperBound'     │ 1000000 │    2999998    │  1195   │
│    7    │ 'reverseLowerBound' │ 1000000 │    2999998    │  1254   │
│    8    │ 'reverseUpperBound' │ 1000000 │    2999998    │  1423   │
└─────────┴─────────────────────┴─────────┴───────────────┴─────────┘
=================================== OrderedMap ===================================
┌─────────┬─────────────────────┬─────────┬───────────────┬─────────┐
│ (index) │      testFunc       │ testNum │ containerSize │ runTime │
├─────────┼─────────────────────┼─────────┼───────────────┼─────────┤
│    0    │    'constructor'    │    1    │    1000000    │  1748   │
│    1    │    'setElement'     │ 1000000 │    2000000    │   659   │
│    2    │ 'eraseElementByKey' │ 1000000 │    2000000    │   359   │
│    3    │ 'eraseElementByPos' │   100   │    1000000    │  4578   │
│    4    │       'union'       │    1    │    1999900    │  1442   │
│    5    │    'lowerBound'     │ 1000000 │    1999900    │  1167   │
│    6    │    'upperBound'     │ 1000000 │    1999900    │  1162   │
│    7    │ 'reverseLowerBound' │ 1000000 │    1999900    │  1143   │
│    8    │ 'reverseUpperBound' │ 1000000 │    1999900    │  1178   │
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
