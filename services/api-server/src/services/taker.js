'use strict'

const db = require('../database')

/**
 * @typedef {object} TakerRecord
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 */
/**
 * Create new Taker record(s)
 *
 * @param {TakerRecord|TakerRecord[]} takers Taker record(s) to create
 * @returns {Promise<array>} List of taker records
 */
async function create(takers) {
    return await db('takers').insert(takers).returning('*')
}

/**
 * Find an existing Taker record using id
 *
 * @param {string|number} id Taker id
 * @returns {Promise<TakerRecord>} Taker record
 */
async function findById(id) {
    return db('takers').where('id', id).first()
}

/**
 * Find an existing Taker record using email
 *
 * @param {string} email Taker's email
 * @returns {Promise<TakerRecord>} Taker record
 */
async function findByEmail(email) {
    return db('takers').where('email', email).first()
}

/**
 * Find an existing or create a new Taker record
 *
 * @param {TakerRecord} takerInfo Taker's info
 * @returns {Promise<TakerRecord>} Taker record
 */
async function findOrCreate(takerInfo) {
    return await findByEmail(takerInfo.email) || (await create(takerInfo))[0]
}

module.exports = {
    create,
    findById,
    findByEmail,
    findOrCreate,
}
