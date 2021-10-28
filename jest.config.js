module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
