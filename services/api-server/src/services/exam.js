'use strict'

const db = require('../database')

/**
 * @typedef {object} ExamRecord
 * @property {string} name The exam's name
 */
/**
 * Create new Exam record(s)
 *
 * @param {ExamRecord} input Exam info
 * @returns {Promise<ExamRecord[]>} List of Exam records
 */
function create(input) {
    return db('exams').insert(input).returning('*')
}

/**
 * Find an existing Exam record using the given exam id
 *
 * @param {string|number} examId Exam id
 * @returns {Promise<ExamRecord>} Exam record
 */
function findById(examId) {
    return db('exams').where({ id: examId }).first()
}

/**
 * Retrieve a list of questions for given exam id
 *
 * @param {*} examId Exam id
 * @returns {Promise<any>} List of Exam questions
 */
function getQuestions(examId) {
    return db('questions').where('exam_id', examId)
}

module.exports = {
    create,
    findById,
    getQuestions,
}
