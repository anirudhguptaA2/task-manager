module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(svg|jpg|jpeg|png|gif|webp|avif)$': 'jest-transform-stub'
  },
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  '\\.(svg)$': '<rootDir>/tests/unit/__mocks__/fileMock.js',
  '\\.(jpg|jpeg|png|gif|webp|avif)$': '<rootDir>/tests/unit/__mocks__/fileMock.js',
  '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js']
};
