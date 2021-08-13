'use strict'

const Model = require('./baseModel')
const Option = require('./option')

class Question extends Model {
    static get tableName() {
        return 'questions'
    }

    static get relationMappings() {
        return {
            options: {
                relation: Model.HasManyRelation,
                modelClass: Option,
                join: {
                    from: 'questions.id',
                    to: 'options.question_id'
                }
            }
        }
    }
}

module.exports = Question
