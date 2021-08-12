'use strict'

const Model = require('./baseModel')

class Assessment extends Model {
    static get tableName() {
        return 'assessments'
    }
}

module.exports = Assessment
