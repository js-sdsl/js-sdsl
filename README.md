# [js-sdsl](https://github.com/ZLY201/js-sdsl)

**A javascript standard data structure library**

## Included data structures

- Vector
- Stack
- Queue
- LinkList
- Deque
- PriorityQueue

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

To help you have a better use, we provide this API document (**it will become soon**).

### For Browser
```html
<!-- you can download the file locally and import it or import it dynamically by using url. -->
<script src="https://zly201.github.io/js-sdsl/js-sdsl.min.js"></script>
<script>
    const { Vector } = SDSL;
	const myVector = new Vector();
	// you code here...
</script>
```

### Other
Please see `src/test.ts` to find usage.

## Build by source code

You can pull this repository and run `yarn build` or run `yarn test` to test our library.

## License

This project is [MIT licensed](https://github.com/ZLY201/js-sdsl/blob/main/LICENSE).
