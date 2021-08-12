'use strict'

const faker = require('faker')
const db = require('../../src/database')
const examService = require('../../src/services/exam')

describe('[intgr] services/taker.js', () => {
    afterAll(async () => await db.destroy())
    describe('.create()', () => {
        it('should insert a new record and return the result', async () => {
            const record = {
                name: faker.datatype.string('20'),
            }

            const [insertRes] = await examService.create(record)
            expect(insertRes).toMatchObject(record)
            expect(insertRes).toHaveProperty('id')
            expect(insertRes).toHaveProperty('created_at')
            expect(insertRes).toHaveProperty('updated_at')

            const selectRes = await db('exams').where('id', insertRes.id).first()
            expect(selectRes).toEqual(insertRes)
        }) // test
    }) // group
    describe('.findById()', () => {
        it('should retrieve a record using the given id', async () => {
            const record = {
                name: faker.datatype.string('20'),
            }
            const [insertRes] = await db('exams').insert(record).returning('*')

            const res = await examService.findById(insertRes.id)

            expect(res).toEqual(insertRes)
        }) // test
    }) // group
    describe('.getQuestions()', () => {
        it('should retrieve all questions for given exam id', async () => {
            const examRecord = {
                name: faker.datatype.string('20'),
            }
            const [examRes] = await db('exams').insert(examRecord).returning('*')
            const questionRecords = Array.from({ length: 2 }, () => {
                return {
                    exam_id: examRes.id,
                    text: faker.datatype.string(100),
                    type: 'text',
                    correct_answer: faker.datatype.string(10)
                }
            })
            const questionRes = await db('questions').insert(questionRecords).returning('*')

            const res = await examService.getQuestions(examRes.id)

            expect(res).toEqual(questionRes)
        }) // test
    }) // group
}) // group
