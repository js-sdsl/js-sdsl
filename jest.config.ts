module.exports = {
  preset: 'ts-jest',
  roots: [
    '<rootDir>/check'
  ],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules'
  ],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  }
};
