<p align="center">
  <a href="https://js-sdsl.github.io/" target="_blank" rel="noopener noreferrer">
    <img src="https://js-sdsl.github.io/assets/logo-removebg.png" alt="js-sdsl logo" width="120" />
  </a>
</p>

<h3><p align="center">一个参考 C++ STL 实现的 JavaScript 标准数据结构库</p></h3>

<p align="center">
  <a href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/v/js-sdsl.svg" alt="NPM version" /></a>
  <a href="https://github.com/ZLY201/js-sdsl/actions/workflows/build.yml"><img src="https://img.shields.io/github/workflow/status/ZLY201/js-sdsl/js-sdsl%20CI" alt="Build status" /></a>
  <a href='https://coveralls.io/github/ZLY201/js-sdsl?branch=dev'><img src='https://coveralls.io/repos/github/ZLY201/js-sdsl/badge.svg?branch=dev' alt='Coverage Status' /></a>
  <a href="https://github.com/ZLY201/js-sdsl"><img src="https://img.shields.io/github/stars/ZLY201/js-sdsl.svg" alt="GITHUB star" /></a>
  <a href="https://npmcharts.com/compare/js-sdsl?minimal=true"><img src="https://img.shields.io/npm/dm/js-sdsl.svg" alt="NPM Downloads" /></a>
  <a href="https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js"><img src="https://img.badgesize.io/https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js?compression=gzip&style=flat-square/" alt="Gzip Size"></a>
  <a href="https://openbase.com/js/js-sdsl?utm_source=embedded&amp;utm_medium=badge&amp;utm_campaign=rate-badge"><img src="https://badges.openbase.com/js/rating/js-sdsl.svg?token=fh3LMNOV+JSWykSjtg1rA8kouSYkJoIDzGbvaByq5X0=" alt="Rate this package"/></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/npm/l/js-sdsl.svg" alt="MIT-license" /></a>
  <a href="https://github.com/ZLY201/js-sdsl/"><img src="https://img.shields.io/github/languages/top/ZLY201/js-sdsl.svg" alt="GITHUB-language" /></a>
</p>

<p align="center"><a href="https://github.com/ZLY201/js-sdsl/blob/dev/README.md">English</a> | 简体中文</p>

## 包含的数据结构

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

## 支持的平台

- node.js (using commonjs)
- react/vue (using es5)
- browser (support most browsers)

## 下载

使用 cdn 直接引入

- [js-sdsl.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.js) (for development)
- [js-sdsl.min.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js) (for production)

使用 npm 下载

```bash
npm install js-sdsl
```

## 使用说明

您可以[访问我们的主页](https://js-sdsl.github.io/)获取更多信息

并且我们提供了完整的 [API 文档](https://zly201.github.io/js-sdsl/index.html)供您参考

### 在浏览器中使用

```html
<!-- you can download the file locally and import it or import it dynamically by using url. -->
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

### npm 引入

```javascript
// esModule
import { OrderedMap } from 'js-sdsl';
// commonJs
const { OrderedMap } = require('js-sdsl');
const myOrderedMap = new OrderedMap();
myOrderedMap.setElement(1, 2);
console.log(myOrderedMap.getElementByKey(1)); // 2
```

## 从源码构建

您可以克隆此仓库后运行 `yarn build` 命令重新构建这个库

## 测试

### 对于正确性的校验

我们使用 `jest` 库来编写我们的单元测试，并将结果同步到了 [coveralls](https://coveralls.io/github/ZLY201/js-sdsl) 上，你可以使用 `yarn test:check` 命令来重建它

### 对于性能的校验

我们对于编写的所有 API 进行了性能测试，并将结果同步到了 `testResult.txt` 中，你可以通过 `yarn test:performance` 命令来重现它

以下是性能测试结果的一部分：

```bash
=================================== OrderedSet ===================================
┌─────────┬─────────────────────┬─────────┬───────────────┬─────────┐
│ (index) │      testFunc       │ testNum │ containerSize │ runTime │
├─────────┼─────────────────────┼─────────┼───────────────┼─────────┤
│    0    │    'constructor'    │    1    │    1000000    │  1667   │
│    1    │      'insert'       │ 1000000 │    2000000    │   558   │
│    2    │ 'eraseElementByKey' │ 1000000 │    3000000    │   362   │
│    3    │ 'eraseElementByPos' │   10    │    3000000    │   633   │
│    4    │       'union'       │    1    │    2999998    │  1949   │
│    5    │    'lowerBound'     │ 1000000 │    2999998    │  1665   │
│    6    │    'upperBound'     │ 1000000 │    2999998    │  1722   │
│    7    │ 'reverseLowerBound' │ 1000000 │    2999998    │  1690   │
│    8    │ 'reverseUpperBound' │ 1000000 │    2999998    │  1713   │
└─────────┴─────────────────────┴─────────┴───────────────┴─────────┘
=================================== OrderedMap ===================================
┌─────────┬─────────────────────┬─────────┬───────────────┬─────────┐
│ (index) │      testFunc       │ testNum │ containerSize │ runTime │
├─────────┼─────────────────────┼─────────┼───────────────┼─────────┤
│    0    │    'constructor'    │    1    │    1000000    │  1574   │
│    1    │    'setElement'     │ 1000000 │    2000000    │   643   │
│    2    │ 'eraseElementByKey' │ 1000000 │    2000000    │   344   │
│    3    │ 'eraseElementByPos' │   100   │    1000000    │  6082   │
│    4    │       'union'       │    1    │    1999900    │  1888   │
│    5    │    'lowerBound'     │ 1000000 │    1999900    │  1615   │
│    6    │    'upperBound'     │ 1000000 │    1999900    │  1666   │
│    7    │ 'reverseLowerBound' │ 1000000 │    1999900    │  1619   │
│    8    │ 'reverseUpperBound' │ 1000000 │    1999900    │  1665   │
└─────────┴─────────────────────┴─────────┴───────────────┴─────────┘
```

## 维护者

[@ZLY201](https://github.com/ZLY201)

## 贡献

我们欢迎所有的开发人员提交 issue 或 pull request，阅读[贡献者指南](https://github.com/ZLY201/js-sdsl/blob/main/.github/CONTRIBUTING.md)可能会有所帮助

### 贡献者

感谢对本项目做出贡献的开发者们：

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

本项目遵循 [all-contributors](https://github.com/all-contributors/all-contributors) 规范。 欢迎任何形式的贡献！

## 许可证

[MIT](https://github.com/ZLY201/js-sdsl/blob/main/LICENSE) © ZLY201
