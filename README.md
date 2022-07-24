# <p>[js-sdsl](https://github.com/ZLY201/js-sdsl)</p>

<p align="center"><h3>A javascript standard data structure library which benchmark against C++ STL.</h3></p>

<p align="center">

[![Version](https://img.shields.io/npm/v/js-sdsl?color=blue)](https://www.npmjs.com/package/js-sdsl)
[![Actions Status](https://github.com/zly201/js-sdsl/workflows/js-sdsl%20test%20CI/badge.svg)](https://github.com/zly201/js-sdsl/actions)
[![Coverage Status](https://coveralls.io/repos/github/ZLY201/js-sdsl/badge.svg?branch=feat%2Frefactor)](https://coveralls.io/github/ZLY201/js-sdsl)
[![Stars](https://img.shields.io/github/stars/zly201/js-sdsl.svg)](https://github.com/ZLY201/js-sdsl)
[![Downloads](https://img.shields.io/npm/dm/js-sdsl)](https://www.npmjs.com/package/js-sdsl)
[![License](https://img.shields.io/npm/l/js-sdsl?color=%230969da)](https://github.com/ZLY201/js-sdsl/blob/main/LICENSE)
[![Language](https://img.shields.io/github/languages/top/zly201/js-sdsl.svg)](https://coveralls.io/github/ZLY201/js-sdsl)

</p>

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
    const { Vector } = sdsl;
    const myVector = new Vector();
    // you code here...
</script>
```

## Build by source code

You can pull this repository and run `yarn build` to rebuild this library.

## Unit test

### For check

We use jest library to write unit tests, you can see test coverage on [coveralls](https://coveralls.io/github/ZLY201/js-sdsl). You can run `yarn test:check` command to reproduce it.

### For performance

We tested most of the functions for efficiency. You can go to `testResult.txt` to see our running results or reproduce it with `yarn test:performance` command.

## Maintainers

[@ZLY201](https://github.com/ZLY201).

## Contributing

Feel free to dive in! Open an issue or submit PRs.

### Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

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
