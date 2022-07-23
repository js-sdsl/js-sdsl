module.exports = {
  preset: 'ts-jest',
  roots: [
    '<rootDir>/__check__'
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
