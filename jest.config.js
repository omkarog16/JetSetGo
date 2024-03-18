module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-native|react-native-paper)/',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    "^\\.\\.\\/Libraries\\/Image\\/Image$": "<rootDir>/path/to/mockImageModule.js"
  },  
  setupFiles: ['./node_modules/react-native/jest/setup.js'],
};
