import type { Config } from 'karma';

module.exports = function (config: Config) {
  const infinity = 1 << 30;

  process.env.EDGE_BIN = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    browserDisconnectTimeout: infinity,
    browserNoActivityTimeout: infinity,

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['mocha', 'karma-typescript'],

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.ts',
      'test/**/*.test.ts',
      'test/utils/*.ts'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },

    // @ts-ignore
    karmaTypescriptConfig: {
      compilerOptions: {
        target: 'ES5',
        module: 'commonjs'
      },
      tsconfig: 'tsconfig.json'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['mocha'],

    client: {
      // @ts-ignore
      mocha: {
        timeout: infinity
      }
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['ChromeHeadless', 'Firefox', 'Edge', 'SafariNative'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,

    plugins: [
      'karma-mocha',
      'karma-requirejs',
      'karma-typescript',
      'karma-mocha-reporter',
      'karma-edge-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safarinative-launcher'
    ]
  });
};
