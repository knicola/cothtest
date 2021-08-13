'use strict'

const faker = require('faker')
const { DateTime } = require('luxon')
const Assessment = require('../../models/assessment')

exports.seed = function () {
    return Assessment.query().insertGraphAndFetch(createAssessment(5))
}

function createAssessment(num) {
    return Array.from({ length: num }, () => {
        return {
            session: faker.datatype.uuid(),
            taker: createTakers(1),
            exam: createExams(1),
            started_at: DateTime.now().toSQL(),
        }
    })
}

function createTakers(num) {
    return Array.from({ length: num }, () => {
        return {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
        }
    })
}

function createExams(num) {
    return Array.from({ length: num }, () => {
        return {
            name: faker.lorem.words(5),
            questions: createQuestions(15),
        }
    })
}

function createQuestions(num) {
    const enums = ['mchoice', 'text']
    return Array.from({ length: num }, () => {
        const type = enums[Math.floor(Math.random() * enums.length)]
        const options = type === 'mchoice' ? createOptions(5) : null
        const correct_answer = type === 'mchoice'
            ? Math.floor(Math.random() * (4 - 0) + 0)
            : faker.lorem.words(1)
        return {
            text: faker.lorem.sentences(3),
            type,
            options,
            correct_answer,
        }
    })
}

function createOptions(num) {
    return Array.from({ length: num }, () => {
        return {
            text: faker.lorem.sentences(1),
        }
    })
}
