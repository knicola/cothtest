'use strict'

const faker = require('faker')
const Assessment = require('../../src/models/assessment')
const assessmentService = require('../../src/services/assessment')

describe('[intgr] services/taker.js', () => {
    afterAll(async () => await Assessment.knex().destroy())
    describe('.create()', () => {
        it('should insert a new record and return the result', async () => {
            const record = {
                taker_id: faker.datatype.number(10000).toString(),
                exam_id: faker.datatype.number(10000).toString(),
            }

            const insertRes = await assessmentService.create(record.exam_id, record.taker_id)
            expect(insertRes).toMatchObject(record)
            expect(insertRes).toHaveProperty('id')
            expect(insertRes).toHaveProperty('created_at')
            expect(insertRes).toHaveProperty('updated_at')

            const selectRes = await Assessment.query().where('id', insertRes.id).first()
            expect(selectRes).toEqual(insertRes)
        }) // test
    }) // group
    describe('.findBySession()', () => {
        it('should retrieve a record using the given session', async () => {
            const record = {
                taker_id: faker.datatype.number(10000).toString(),
                exam_id: faker.datatype.number(10000).toString(),
                session: faker.datatype.uuid(),
            }
            const insertRes = await Assessment.query().insert(record).returning('*')

            const res = await assessmentService.findBySession(record.session)

            expect(res).toEqual(insertRes)
        }) // test
    }) // group
}) // group
