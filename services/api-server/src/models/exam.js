'use strict'

const Model = require('./baseModel')
const Question = require('./question')

class Exam extends Model {
    static get tableName() {
        return 'exams'
    }

    static get relationMappings() {
        return {
            questions: {
                relation: Model.HasManyRelation,
                modelClass: Question,
                join: {
                    from: 'exams.id',
                    to: 'questions.exam_id'
                }
            }
        }
    }
}

module.exports = Exam
