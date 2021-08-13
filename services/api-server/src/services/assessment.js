'use strict'

const Assessment = require('../models/assessment')
const uuid = require('uuid')
const { DateTime } = require('luxon')

/**
 * Create new Assessment record
 *
 * @param {string|number} examId Exam id
 * @param {string|number} takerId Taker's id
 * @returns {Promise<any>} Assessment record
 */
async function create(examId, takerId) {
    return Assessment.query().insertAndFetch({
        exam_id: examId,
        taker_id: takerId,
        session: uuid.v4(),
    })
}

/**
 * Find an existing assessment record using the given session
 *
 * @param {string} session Session uuid
 * @returns {Promise<any>} Assessment record
 */
function findBySession(session) {
    return Assessment.query().where('session', session).first()
}

/**
 * Start assessment
 *
 * @param {string} session Session uuid
 * @returns {Promise<any>} Assessment record
 */
async function startBySession(session) {
    return Assessment.query()
        .where('session', session)
        .whereNull('started_at')
        .whereNull('submitted_at')
        .patch({ started_at: Assessment.fn.now() })
        .returning('*')
        .first()
}

/**
 * End assessment
 *
 * @param {string} session Session uuid
 * @returns {Promise<any>} Assessment record
 */
async function endBySession(session) {
    return Assessment.query()
        .where('session', session)
        .whereNotNull('started_at')
        .whereNull('submitted_at')
        .patch({ submitted_at: Assessment.fn.now() })
        .returning('*')
        .first()
}

/**
 * Submit answer for given session
 *
 * @param {Assessment} assessment Assessment model instance
 * @param {AnswerRecord} answer Answer input
 * @returns {Promise<AnswerRecord>} Answer record
 */
async function submitAnswer(assessment, answer) {
    return await assessment.$relatedQuery('answers').insertAndFetch(answer)
}

const isExpired = (assessment) => DateTime.fromSQL(assessment.started_at).plus({ hour: 1 }) <= DateTime.now()
const isCompleted = (assessment) => !! assessment.submitted_at
const isAccessible = (assessment) => ! isCompleted(assessment) && ! isExpired(assessment)

module.exports = {
    create,
    findBySession,
    startBySession,
    endBySession,
    submitAnswer,
    isExpired,
    isCompleted,
    isAccessible,
}
