# [js-sdsl](https://github.com/ZLY201/js-sdsl)

**A javascript standard data structure library which benchmark against C++ STL.**

## Note

**Note that our official version starts from 2.0.0. In order to avoid unnecessary trouble, please select the latest
version when downloading (>= 2.0.0).**

Unfortunately, I try my best to improve the performance of hash table but failed. Ideally, the hash table should be O(1)
and in my project when the size of each bucket is 1, its time is much longer than Set and Map.

After analysis, I find the operator `new` costs nearly 2s when the size is 1e6, This seems to be the bottleneck of js.

You can try the following code to verify my statement.

```javascript
console.time("run");
const arr = new Array(1000000);
arr[100000] = new Array();
console.timeEnd("run");
```

You can imagine what happens when I repeat the above operation many times.

If you want to use hash container in js, please use set or map in ES6.

The official Set and Map are implemented using hash table instead of RBTree.

For more information about js hash table, please refer
to https://stackoverflow.com/questions/368280/javascript-hashmap-equivalent.

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

## License

This project is [MIT licensed](https://github.com/ZLY201/js-sdsl/blob/main/LICENSE).
