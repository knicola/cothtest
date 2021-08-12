'use strict'

const db = require('../src/database')

module.exports = async () => {
    global.__db__ = db
    await global.__db__.migrate.down()
    await global.__db__.migrate.up()
}
