'use strict'

const db = require('../database')
const uuid = require('uuid')

/**
 * Create new Assessment record(s)
 *
 * @param {string|number} examId Exam id
 * @param {string|number} takerId Taker's id
 * @returns {Promise<any>} List of Assessment records
 */
async function create(examId, takerId) {
    return await db('assessments').insert({
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
    return db('assessments').where('session', session).first()
}

module.exports = {
    create,
    findBySession,
}
