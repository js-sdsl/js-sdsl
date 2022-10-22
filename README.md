<p align="center">
  <a href="https://js-sdsl.github.io/" target="_blank" rel="noopener noreferrer">
    <img src="https://js-sdsl.github.io/assets/logo-removebg.png" alt="js-sdsl logo" width="120" />
  </a>
</p>

<h3><p align="center">A javascript standard data structure library which benchmark against C++ STL</p></h3>

<p align="center">
  <a href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/v/js-sdsl.svg" alt="NPM Version" /></a>
  <a href="https://github.com/js-sdsl/js-sdsl/actions/workflows/build.yml"><img src="https://img.shields.io/github/workflow/status/js-sdsl/js-sdsl/js-sdsl%20CI" alt="Build Status" /></a>
  <a href='https://coveralls.io/github/js-sdsl/js-sdsl?branch=main'><img src='https://coveralls.io/repos/github/js-sdsl/js-sdsl/badge.svg?branch=main' alt='Coverage Status' /></a>
  <a href="https://github.com/js-sdsl/js-sdsl"><img src="https://img.shields.io/github/stars/js-sdsl/js-sdsl.svg" alt="GITHUB Star" /></a>
  <a href="https://npmcharts.com/compare/js-sdsl?minimal=true"><img src="https://img.shields.io/npm/dm/js-sdsl.svg" alt="NPM Downloads" /></a>
  <a href="https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js"><img src="https://img.badgesize.io/https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js?compression=gzip&style=flat-square/" alt="Gzip Size"></a>
  <a href="https://openbase.com/js/js-sdsl?utm_source=embedded&amp;utm_medium=badge&amp;utm_campaign=rate-badge"><img src="https://badges.openbase.com/js/rating/js-sdsl.svg?token=fh3LMNOV+JSWykSjtg1rA8kouSYkJoIDzGbvaByq5X0=" alt="Rate this package"/></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/npm/l/js-sdsl.svg" alt="MIT-license" /></a>
  <a href="https://github.com/js-sdsl/js-sdsl/"><img src="https://img.shields.io/github/languages/top/js-sdsl/js-sdsl.svg" alt="GITHUB-language" /></a>
</p>

<p align="center">English | <a href="https://github.com/js-sdsl/js-sdsl/blob/main/README.zh-CN.md">简体中文</a></p>

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

## Benchmark

We are benchmarking against other popular data structure libraries. In some ways we're better than the best library. See [benchmark](https://js-sdsl.github.io/#/test/benchmark-analyze).

## Supported platforms

<table>
  <tr align="center">
    <td>
      <img alt="IE / Edge" src="https://www.w3schools.com/images/compatible_edge2020.png" />
      <div>IE / Edge</div>
    </td>
    <td>
      <img alt="Firefox" src="https://www.w3schools.com/images/compatible_firefox2020.png" />
      <div>Firefox</div>
    </td>
    <td>
      <img alt="Chrome" src="https://www.w3schools.com/images/compatible_chrome2020.png" />
      <div>Chrome</div>
    </td>
    <td>
      <img alt="Safari" src="https://www.w3schools.com/images/compatible_safari2020.png" />
      <div>Safari</div>
    </td>
    <td>
      <img alt="Opera" src="https://www.w3schools.com/images/compatible_opera2020.png" />
      <div>Opera</div>
    </td>
    <td>
      <img alt="NodeJs" src="https://cdn-icons-png.flaticon.com/512/5968/5968322.png" width="20" />
      <div>NodeJs</div>
    </td>
  </tr>
  <tr align="center">
    <td>Edge 12</td>
    <td>31</td>
    <td>49</td>
    <td>10</td>
    <td>36</td>
    <td>10</td>
  </tr>
</table>

## Download

Download directly

- [js-sdsl.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.js) (for development)
- [js-sdsl.min.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js) (for production)

Or install js-sdsl using npm

```bash
npm install js-sdsl
```

Or you can download the isolation packages containing only the containers you want:

| package                                                                                 | npm                                                                                                                           | install                         |
|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| [@js-sdsl/stack](https://js-sdsl.github.io/js-sdsl/classes/Stack.html)                  | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/stack)](https://www.npmjs.com/package/@js-sdsl/stack)                   | `npm i @js-sdsl/stack`          |
| [@js-sdsl/queue](https://js-sdsl.github.io/js-sdsl/classes/Queue.html)                  | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/queue)](https://www.npmjs.com/package/@js-sdsl/queue)                   | `npm i @js-sdsl/queue`          |
| [@js-sdsl/priority-queue](https://js-sdsl.github.io/js-sdsl/classes/PriorityQueue.html) | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/priority-queue)](https://www.npmjs.com/package/@js-sdsl/priority-queue) | `npm i @js-sdsl/priority-queue` |
| [@js-sdsl/vector](https://js-sdsl.github.io/js-sdsl/classes/Vector.html)                | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/vector)](https://www.npmjs.com/package/@js-sdsl/vector)                 | `npm i @js-sdsl/vector`         |
| [@js-sdsl/link-list](https://js-sdsl.github.io/js-sdsl/classes/LinkList.html)           | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/link-list)](https://www.npmjs.com/package/@js-sdsl/link-list)           | `npm i @js-sdsl/link-list`      |
| [@js-sdsl/deque](https://js-sdsl.github.io/js-sdsl/classes/Deque.html)                  | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/deque)](https://www.npmjs.com/package/@js-sdsl/deque)                   | `npm i @js-sdsl/deque`          |
| [@js-sdsl/ordered-set](https://js-sdsl.github.io/js-sdsl/classes/OrderedSet.html)       | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/ordered-set)](https://www.npmjs.com/package/@js-sdsl/ordered-set)       | `npm i @js-sdsl/ordered-set`    |
| [@js-sdsl/ordered-map](https://js-sdsl.github.io/js-sdsl/classes/OrderedMap.html)       | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/ordered-map)](https://www.npmjs.com/package/@js-sdsl/ordered-map)       | `npm i @js-sdsl/ordered-map`    |
| [@js-sdsl/hash-set](https://js-sdsl.github.io/js-sdsl/classes/HashSet.html)             | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/hash-set)](https://www.npmjs.com/package/@js-sdsl/hash-set)             | `npm i @js-sdsl/hash-set`       |
| [@js-sdsl/hash-map](https://js-sdsl.github.io/js-sdsl/classes/HashMap.html)             | [![NPM Package](https://img.shields.io/npm/v/@js-sdsl/hash-map)](https://www.npmjs.com/package/@js-sdsl/hash-map)             | `npm i @js-sdsl/hash-map`       |

## Usage

You can visit our [official website](https://js-sdsl.github.io/) to get more information.

To help you have a better use, we also provide this [API document](https://js-sdsl.github.io/js-sdsl/index.html).

### For browser

```html
<script src="https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js"></script>
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

## Test

### Unit test

We use jest library to write unit tests, you can see test coverage on [coveralls](https://coveralls.io/github/js-sdsl/js-sdsl). You can run `yarn test:unit` command to reproduce it.

### For performance

We tested most of the functions for efficiency. You can go to [`gh-pages/performance.md`](https://github.com/js-sdsl/js-sdsl/blob/gh-pages/performance.md) to see our running results or reproduce it with `yarn test:performance` command.

You can also visit [here](https://js-sdsl.github.io/#/test/performance-test) to get the result.

## Development

Use Gitpod, a free online dev environment for GitHub.

[![Open in Gippod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/js-sdsl/js-sdsl)

Or clone locally:

```bash
$ git clone https://github.com/js-sdsl/js-sdl.git
$ cd js-sdsl
$ npm install
$ npm run dev   # development mode
```

Then you can see the output in `dist/cjs` folder.

## Maintainers

[@ZLY201](https://github.com/ZLY201)

## Contributing

Feel free to dive in! Open an issue or submit PRs. It may be helpful to read the [Contributor Guide](https://github.com/js-sdsl/js-sdsl/blob/main/.github/CONTRIBUTING.md).

### Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://www.linkedin.com/in/takatoshi-kondo-02a91410/"><img src="https://avatars.githubusercontent.com/u/275959?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Takatoshi Kondo</b></sub></a><br /><a href="https://github.com/js-sdsl/js-sdsl/commits?author=redboltz" title="Code">💻</a> <a href="https://github.com/js-sdsl/js-sdsl/commits?author=redboltz" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://www.youtube.com/c/noname0310"><img src="https://avatars.githubusercontent.com/u/48761044?v=4?s=100" width="100px;" alt=""/><br /><sub><b>noname</b></sub></a><br /><a href="https://github.com/js-sdsl/js-sdsl/commits?author=noname0310" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[MIT](https://github.com/js-sdsl/js-sdsl/blob/main/LICENSE) © ZLY201

## Sponsors and Backers

The special thanks to these sponsors or backers because they provided support at a very early stage:

<svg xmlns="http://www.w3.org/2000/svg" width="203" height="58" fill="none">
  <path d="m46.557 21.11-12.54-7.24a1.014 1.014 0 0 0-1.015 0l-12.54 7.24a1.015 1.015 0 0 0-.508.878v14.48c0 .362.194.697.508.879l12.54 7.24c.314.181.7.181 1.015 0l12.54-7.24c.314-.181.507-.516.507-.879v-14.48c0-.363-.193-.697-.507-.879Z" fill="#8080F2"/>
  <path d="M.904 27.705 15.888 1.638C16.432.695 17.438 0 18.526 0h29.967c1.089 0 2.094.695 2.639 1.638l14.983 26.01a3.1 3.1 0 0 1 0 3.074L51.132 56.576c-.545.942-1.55 1.424-2.639 1.424H18.526c-1.088 0-2.094-.467-2.638-1.41L.905 30.694a2.94 2.94 0 0 1 0-2.99Zm12.407 12.534c0 .384.231.738.563.93L32.96 52.18c.332.192.748.192 1.08 0l19.1-11.011c.332-.192.564-.546.564-.93V18.216c0-.383-.229-.738-.56-.93L34.057 6.277a1.084 1.084 0 0 0-1.079 0l-19.102 11.01c-.332.192-.566.547-.566.93V40.24Z" fill="#4B32C3"/>
  <path d="M86.697 43.71V14.29h18.745v4.581h-13.66v7.733h12.483v4.582H91.783v7.943h13.869v4.581H86.697Zm32.222.589c-2.241 0-4.231-.393-5.968-1.177-1.709-.813-3.054-1.976-4.035-3.489-.98-1.513-1.471-3.362-1.471-5.547v-1.093h5.002v1.093c0 1.933.588 3.376 1.765 4.328 1.177.953 2.746 1.43 4.707 1.43 1.99 0 3.489-.407 4.497-1.22 1.009-.812 1.513-1.863 1.513-3.152 0-.868-.238-1.569-.714-2.101-.476-.56-1.177-1.009-2.102-1.345-.896-.336-1.989-.658-3.278-.967l-1.261-.252c-1.933-.448-3.614-1.008-5.043-1.68-1.401-.701-2.48-1.598-3.236-2.69-.757-1.094-1.135-2.523-1.135-4.288 0-1.765.42-3.278 1.261-4.539.84-1.26 2.031-2.227 3.572-2.9 1.541-.672 3.348-1.009 5.422-1.009 2.073 0 3.923.35 5.548 1.051 1.625.7 2.9 1.751 3.824 3.152.953 1.401 1.429 3.153 1.429 5.254v1.387h-5.001v-1.387c0-1.205-.238-2.172-.715-2.9-.476-.729-1.148-1.26-2.017-1.597-.869-.336-1.891-.504-3.068-.504-1.737 0-3.054.336-3.951 1.008-.896.673-1.345 1.625-1.345 2.858 0 .785.196 1.457.589 2.018.42.532 1.022.98 1.807 1.345.812.336 1.821.63 3.026.882l1.261.294c2.017.449 3.782 1.023 5.296 1.723 1.513.673 2.689 1.57 3.53 2.69.869 1.121 1.303 2.578 1.303 4.371 0 1.766-.462 3.32-1.387 4.666-.897 1.345-2.172 2.395-3.825 3.152-1.625.756-3.558 1.135-5.8 1.135Zm14.181-.589V14.29h5.085v24.839h13.786v4.581H133.1Zm21.727 0V22.948h4.834V43.71h-4.834Zm2.396-23.41c-.869 0-1.625-.28-2.269-.84-.617-.589-.925-1.36-.925-2.312 0-.953.308-1.71.925-2.27a3.255 3.255 0 0 1 2.269-.882c.925 0 1.681.294 2.27.882.616.56.924 1.317.924 2.27 0 .953-.308 1.723-.924 2.311-.589.56-1.345.841-2.27.841Zm7.302 23.41V22.948h4.75v2.9h.714c.364-.785 1.023-1.527 1.975-2.228.953-.7 2.396-1.05 4.329-1.05 1.598 0 3.012.364 4.245 1.092a7.435 7.435 0 0 1 2.858 3.026c.701 1.29 1.051 2.816 1.051 4.582v12.44h-4.833V31.648c0-1.681-.421-2.928-1.261-3.74-.813-.841-1.976-1.262-3.489-1.262-1.709 0-3.054.575-4.034 1.724-.981 1.12-1.471 2.732-1.471 4.833V43.71h-4.834Zm31.924 0c-1.345 0-2.424-.392-3.236-1.177-.785-.812-1.177-1.905-1.177-3.278V26.941h-5.422v-3.993h5.422v-6.683h4.833v6.683h5.968v3.993h-5.968v11.516c0 .84.393 1.26 1.177 1.26h4.161v3.993h-5.758Z" fill="#101828"/>
</svg>

Thanks also give to these sponsors or backers:

[![](https://opencollective.com/js-sdsl/tiers/sponsors.svg?avatarHeight=36)](https://opencollective.com/js-sdsl#support)

[![](https://opencollective.com/js-sdsl/tiers/backers.svg?avatarHeight=36)](https://opencollective.com/js-sdsl#support)
