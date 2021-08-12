'use strict'

const knex = require('knex').default
const config = require('@co/app-config')

module.exports = knex(config.get('database'))
