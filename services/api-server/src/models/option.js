'use strict'

const Model = require('./baseModel')

class Option extends Model {
    static get tableName() {
        return 'options'
    }
}

module.exports = Option
