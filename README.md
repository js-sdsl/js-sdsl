# [js-sdsl](https://github.com/ZLY201/js-sdsl)

[![version](https://img.shields.io/npm/v/js-sdsl?color=blue)](https://www.npmjs.com/package/js-sdsl)
[![downloads](https://img.shields.io/npm/dm/js-sdsl)](https://www.npmjs.com/package/js-sdsl)
[![version](https://img.shields.io/npm/l/js-sdsl?color=%230969da)](https://github.com/ZLY201/js-sdsl/blob/main/LICENSE)

**A javascript standard data structure library which benchmark against C++ STL.**

## Included data structures

- Vector
- Stack
- Queue
- LinkList
- Deque
- PriorityQueue
- Set (using RBTree)
- Map (using RBTree)
- HashSet (for reference only)
- HashMap (for reference only)

## Supported platforms

- node.js (using commonjs)
- react/vue (using es5)
- browser (support most browsers including IE8+)

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

### Other

Just like other packages.

If you want to get more help, viewing `src/test.ts` may help.

## Build by source code

You can pull this repository and run `yarn build` to rebuild this library.

## Unit test

Before publishing, we conducted strict unit tests on each function, you can see `testResult.txt` to find our test
results or run `yarn test` to reproduce it.

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
