'use strict'

module.exports = async () => {
    await global.__db__.migrate.down()
    await global.__db__.destroy()
}
