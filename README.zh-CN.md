<h1><p align="center"><a href="https://github.com/ZLY201/js-sdsl">js-sdsl</a></p></h1>

<h3><p align="center">一个参考 C++ STL 实现的 JavaScript 标准数据结构库</p></h3>

<p align="center">
  <a target="_blank" href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/v/js-sdsl?color=blue" alt="version" /></a>
  <a target="_blank" href="https://github.com/zly201/js-sdsl/actions"><img src="https://github.com/zly201/js-sdsl/workflows/js-sdsl%20CI/badge.svg" alt="action status" /></a>
  <a target="_blank" href="https://coveralls.io/github/ZLY201/js-sdsl"><img src="https://coveralls.io/repos/github/ZLY201/js-sdsl/badge.svg" alt="coverage status" /></a>
  <a target="_blank" href="https://github.com/ZLY201/js-sdsl"><img src="https://img.shields.io/github/stars/zly201/js-sdsl.svg" alt="stars" /></a>
  <a target="_blank" href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/dm/js-sdsl" alt="downloads" /></a>
  <a target="_blank" href="https://github.com/ZLY201/js-sdsl/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/js-sdsl?color=%230969da" alt="license" /></a>
  <a target="_blank" href="https://coveralls.io/github/ZLY201/js-sdsl"><img src="https://img.shields.io/github/languages/top/zly201/js-sdsl.svg" alt="top language" /></a>
</p>

<p align="center"><a href="https://github.com/ZLY201/js-sdsl/blob/main/README.md">English</a> | 简体中文</p>

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

- [js-sdsl.js](https://zly201.github.io/js-sdsl/js-sdsl.js) (for development)
- [js-sdsl.min.js](https://zly201.github.io/js-sdsl/js-sdsl.min.js) (for production)

使用 npm 下载

```bash
npm install js-sdsl
```

## 使用说明

我们提供了完整的 [API 文档](https://zly201.github.io/js-sdsl/index.html)供您参考

### 在浏览器中试用版

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
