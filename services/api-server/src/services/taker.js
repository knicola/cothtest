'use strict'

const Taker = require('../models/taker')

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
    return await Taker.query().insertAndFetch(takers)
}

/**
 * Find an existing Taker record using id
 *
 * @param {string|number} id Taker id
 * @returns {Promise<TakerRecord>} Taker record
 */
async function findById(id) {
    return Taker.query().where('id', id).first()
}

/**
 * Find an existing Taker record using email
 *
 * @param {string} email Taker's email
 * @returns {Promise<TakerRecord>} Taker record
 */
async function findByEmail(email) {
    return Taker.query().where('email', email).first()
}

/**
 * Find an existing or create a new Taker record
 *
 * @param {TakerRecord} takerInfo Taker's info
 * @returns {Promise<TakerRecord>} Taker record
 */
async function findOrCreate(takerInfo) {
    return await findByEmail(takerInfo.email) || await create(takerInfo)
}

module.exports = {
    create,
    findById,
    findByEmail,
    findOrCreate,
}
