module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  '\\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff|avif|JPG|PNG|SVG|GIF|WEBP|ICO|BMP|TIFF|AVIF)$': '<rootDir>/tests/unit/__mocks__/fileMock.js',
  '\\.(css|less|scss|sass|styl|stylus)$': '<rootDir>/tests/unit/__mocks__/fileMock.js'
  },
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js']
};
