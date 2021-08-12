'use strict'

const Model = require('./baseModel')

class Taker extends Model {
    static get tableName() {
        return 'takers'
    }
}

module.exports = Taker
