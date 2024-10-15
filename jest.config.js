// jest.config.js
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  };
  