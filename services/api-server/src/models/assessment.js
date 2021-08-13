'use strict'

const Answer = require('./answer')
const Model = require('./baseModel')
const Exam = require('./exam')
const Taker = require('./taker')

class Assessment extends Model {
    static get tableName() {
        return 'assessments'
    }

    static get relationMappings() {
        return {
            taker: {
                relation: Model.BelongsToOneRelation,
                modelClass: Taker,
                join: {
                    from: 'assessments.taker_id',
                    to: 'takers.id',
                }
            },
            exam: {
                relation: Model.BelongsToOneRelation,
                modelClass: Exam,
                join: {
                    from: 'assessments.exam_id',
                    to: 'exams.id',
                }
            },
            answers: {
                relation: Model.HasManyRelation,
                modelClass: Answer,
                join: {
                    from: 'assessments.id',
                    to: 'answers.assessment_id',
                }
            }
        }
    }
}

module.exports = Assessment
