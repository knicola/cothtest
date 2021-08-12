'use strict'

module.exports = {
    environment: process.env.NODE_ENV || 'development',
    common: {},
    services: {
        api: {
            host: 'api-server',
            port: '3000',
        }
    },
}
