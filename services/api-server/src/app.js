'use strict'

const express = require('express')
const logger = require('./logger')
const config = require('@co/app-config')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const jsonResponseHelper = require('./jsonResponseHelper')

module.exports = express()
    .set('env', config.get('environment'))
    .set('port', config.get('app.port'))
    .set('config', config)
    .set('trust proxy', true)
    .use(jsonResponseHelper)
    .use(morgan('dev', { stream: logger.stream.write, skip: () => process.env.NODE_ENV === 'test' }))
    .use(helmet())
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(require('./routes'))
