'use strict'

const config = require('./jest.config')

delete config.globalSetup
delete config.globalTeardown

module.exports = config
