'use strict'

module.exports = {
    database: {
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        },
        pool: {
            min: 2,
            max: 10
        },
    },
}
