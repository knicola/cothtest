'use strict'

const Model = require('./baseModel')

class Answer extends Model {
    static get tableName() {
        return 'answers'
    }
}

module.exports = Answer
