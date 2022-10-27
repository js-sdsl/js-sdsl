<p align="center">
  <a href="https://js-sdsl.github.io/" target="_blank" rel="noopener noreferrer">
    <img src="https://js-sdsl.github.io/assets/logo-removebg.png" alt="js-sdsl logo" width="120" />
  </a>
</p>

<h3><p align="center">一款参考 C++ STL 实现的 JavaScript 标准数据结构库</p></h3>

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

<p align="center"><a href="https://github.com/js-sdsl/js-sdsl/blob/main/README.md">English</a> | 简体中文</p>

## ✨ 包含的数据结构

- **Stack** - 先进先出的堆栈
- **Queue** - 先进后出的队列
- **PriorityQueue** - 堆实现的优先级队列
- **Vector** - 受保护的数组，不能直接操作像 `length` 这样的属性
- **LinkList** - 非连续内存地址的链表
- **Deque** - 双端队列，向前和向后插入元素或按索引获取元素的 O(1) 时间复杂度
- **OrderedSet** - 由红黑树实现的排序集合
- **OrderedMap** - 由红黑树实现的排序字典
- **HashSet** - 参考 java 实现的哈希集合
- **HashMap** - 参考 java 实现的哈希字典

## ⚔️ 基准测试

我们和其他数据结构库进行了基准测试，在某些场景我们甚至超过了当前最流行的库

查看 [benchmark](https://js-sdsl.github.io/#/zh-cn/test/benchmark-analyze) 以获取更多信息

## 🖥 支持的平台

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

## 📦 下载

使用 cdn 直接引入

- [js-sdsl.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.js) (for development)
- [js-sdsl.min.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js) (for production)

使用 npm 下载

```bash
npm install js-sdsl
```

或者根据需要安装以下任意单个包

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

## 🪒 使用说明

您可以[访问我们的主页](https://js-sdsl.github.io/)获取更多信息

并且我们提供了完整的 [API 文档](https://js-sdsl.github.io/js-sdsl/index.html)供您参考

### 在浏览器中使用

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

## 🛠 测试

### 单元测试

我们使用 `jest` 库来编写我们的单元测试，并将结果同步到了 [coveralls](https://coveralls.io/github/js-sdsl/js-sdsl) 上，你可以使用 `yarn test:unit` 命令来重建它

### 对于性能的校验

我们对于编写的所有 API 进行了性能测试，并将结果同步到了 [`gh-pages/performance.md`](https://github.com/js-sdsl/js-sdsl/blob/gh-pages/performance.md) 中，你可以通过 `yarn test:performance` 命令来重现它

您也可以访问[我们的网站](https://js-sdsl.github.io/#/zh-cn/test/performance-test)来获取结果

## ⌨️ 开发

可以使用 Gitpod 进行在线编辑：

[![Open in Gippod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/js-sdsl/js-sdsl)

或者在本地使用以下命令获取源码进行开发：

```bash
$ git clone https://github.com/js-sdsl/js-sdl.git
$ cd js-sdsl
$ npm install
$ npm run dev   # development mode
```

之后您在 `dist/cjs` 文件夹中可以看到在 `dev` 模式下打包生成的产物

## 🤝 贡献

我们欢迎所有的开发人员提交 issue 或 pull request，阅读[贡献者指南](https://github.com/js-sdsl/js-sdsl/blob/main/.github/CONTRIBUTING.md)可能会有所帮助

### 贡献者

感谢对本项目做出贡献的开发者们：

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

本项目遵循 [all-contributors](https://github.com/all-contributors/all-contributors) 规范。 欢迎任何形式的贡献！

## ❤️ 赞助者

特别鸣谢下列赞助商和支持者们，他们在非常早期的时候为我们提供了支持：

<a href="https://eslint.org/"><img src="https://js-sdsl.github.io/assets/sponsors/eslint-logo-color.png" alt="eslint logo" width="150"></a>

同样感谢这些赞助商和支持者们：

[![sponsors](https://opencollective.com/js-sdsl/tiers/sponsors.svg?avatarHeight=36)](https://opencollective.com/js-sdsl#support)

[![backers](https://opencollective.com/js-sdsl/tiers/backers.svg?avatarHeight=36)](https://opencollective.com/js-sdsl#support)

## 🪪 许可证

[MIT](https://github.com/js-sdsl/js-sdsl/blob/main/LICENSE) © [ZLY201](https://github.com/zly201)
