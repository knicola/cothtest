'use strict'

const Assessment = require('../models/assessment')
const uuid = require('uuid')

/**
 * Create new Assessment record
 *
 * @param {string|number} examId Exam id
 * @param {string|number} takerId Taker's id
 * @returns {Promise<any>} Assessment record
 */
async function create(examId, takerId) {
    return Assessment.query().insert({
        exam_id: examId,
        taker_id: takerId,
        session: uuid.v4(),
    }).returning('*')
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

module.exports = {
    create,
    findBySession,
}
