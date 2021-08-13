'use strict'

const Assessment = require('./assessment')
const Model = require('./baseModel')

class Answer extends Model {
    static get tableName() {
        return 'answers'
    }

    static get relationMappings() {
        return {
            assessment: {
                relation: Model.BelongsToOneRelation,
                modelClass: Assessment,
                join: {
                    from: 'answers.assessment_id',
                    to: 'assessments.id',
                }
            },
            question: {
                relation: Model.BelongsToOneRelation,
                modelClass: Assessment,
                join: {
                    from: 'answers.question_id',
                    to: 'questions.id',
                }
            },
        }
    }
}

module.exports = Answer
