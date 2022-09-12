import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';

module.exports = defineConfig({
  input: 'src/index.ts',
  output: [{
    file: 'dist/umd/js-sdsl.js',
    format: 'umd',
    name: 'sdsl'
  }],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.esm.json',
      tsconfigOverride: {
        compilerOptions: {
          declaration: false
        }
      }
    })
  ]
});
