/** @type {import('jest').Config} */
const path = require('path')

const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [path.join(__dirname, 'setup-testing.js')],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^react-native/Libraries/Animated/Animated$':
      '<rootDir>/__mocks__/react-native/Libraries/Animated/Animated.js',
    '^react-native/Libraries/Animated/createAnimatedComponent$':
      '<rootDir>/__mocks__/react-native/Libraries/Animated/createAnimatedComponent.js',
    '^react-native/Libraries/Animated/createAnimatedPropsHook$':
      '<rootDir>/__mocks__/react-native/Libraries/Animated/createAnimatedPropsHook.js',
    '^react-native/Libraries/Utilities/Platform$':
      '<rootDir>/__mocks__/react-native/Libraries/Utilities/Platform.js',
    '^react-native/Libraries/StyleSheet/StyleSheet$':
      '<rootDir>/__mocks__/react-native/Libraries/StyleSheet/StyleSheet.js'
    // add other aliases as needed
  }
}

module.exports = config
