'use strict'

module.exports = {
    testMatch: [
        '<rootDir>/tests/**/*.spec.js'
    ],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.js'
    ],
    globalSetup: '<rootDir>/tests/jest.setup.js',
    globalTeardown: '<rootDir>/tests/jest.teardown.js',
}
