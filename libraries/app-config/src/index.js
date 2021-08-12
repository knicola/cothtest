'use strict'

require('dotenv').config()

process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR
    ? process.env.NODE_CONFIG_DIR
    : './src/config'

const config = require('config')
const common = require('./common')

Object
    .keys(common)
    .forEach(key => config[key] = common[key])

module.exports = config
