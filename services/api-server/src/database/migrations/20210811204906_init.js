'use strict'

const { Knex } = require('knex') // eslint-disable-line no-unused-vars

/**
 * @param {Knex} knex knex instance
 * @returns {void}
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('takers', table => {
            table.bigIncrements('id').primary()
            table.string('first_name').notNullable()
            table.string('last_name').notNullable()
            table.string('email').notNullable()
            table.timestamps(true, true)
        })
        .createTable('exams', table => {
            table.bigIncrements('id').primary()
            table.string('name').unique().notNullable()
            table.timestamps(true, true)
        })
        .createTable('questions', table => {
            table.bigIncrements('id').primary()
            table.bigInteger('exam_id').notNullable()
            table.text('text').unique().notNullable()
            table.enum('type', ['mchoice', 'text']).notNullable()
            table.string('correct_answer').notNullable()
            table.timestamps(true, true)
        })
        .createTable('options', table => {
            table.bigIncrements('id').primary()
            table.bigInteger('question_id').notNullable()
            table.text('text')
        })
        .createTable('assessments', table => {
            table.bigIncrements('id').primary()
            table.bigInteger('taker_id').notNullable()
            table.bigInteger('exam_id').notNullable()
            table.integer('score')
            table.string('session').notNullable()
            table.timestamp('started_at', { useTz: true })
            table.timestamp('submitted_at', { useTz: true })
            table.timestamps(true, true)
        })
        .createTable('answers', table => {
            table.bigIncrements('id').primary()
            table.bigInteger('assessment_id').notNullable()
            table.bigInteger('question_id').notNullable()
            table.bigInteger('option_id')
            table.string('answered_text')
            table.boolean('is_correct')
        })
}

/**
 * @param {Knex} knex knex instance
 * @returns {void}
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('takers')
        .dropTable('exams')
        .dropTable('questions')
        .dropTable('options')
        .dropTable('assessments')
        .dropTable('answers')
}
