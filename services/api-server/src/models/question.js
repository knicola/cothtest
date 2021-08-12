'use strict'

const Model = require('./baseModel')

class Question extends Model {
    static get tableName() {
        return 'questions'
    }
}

module.exports = Question
