'use strict'

const { Model } = require('objection')
const knex = require('../database')

Model.knex(knex)

class BaseModel extends Model { }

module.exports = BaseModel
