'use strict'

const winston = require('winston')

const logger = new winston.createLogger({
    level: 'info',
    defaultMeta: { service: 'api-server' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
    exitOnError: false
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }))
}

module.exports = logger
