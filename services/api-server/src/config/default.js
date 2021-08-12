'use strict'

module.exports = {
    app: {
        port: 3000
    },
    database: {
        client: 'postgresql',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
            database: process.env.DB_NAME || 'api',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASS || 'password',
        },
        migrations: {
            tableName: 'migrations',
            directory: 'src/database/migrations',
        },
        seeds: {
            directory: 'src/database/seeds',
        },
    },
}
