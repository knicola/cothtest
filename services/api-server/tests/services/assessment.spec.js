'use strict'

const faker = require('faker')
const Assessment = require('../../src/models/assessment')
const db = require('../../src/database')
const assessmentService = require('../../src/services/assessment')
const { DateTime } = require('luxon')

describe('[intgr] services/taker.js', () => {
    afterAll(async () => await db.destroy())
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
    describe('.startBySession()', () => {
        it('should start assessment', async () => {
            const assessmentRes = await Assessment.query().insertAndFetch({
                taker_id: 1,
                exam_id: 1,
                session: faker.datatype.uuid(),
            })
            jest.spyOn(Assessment.fn, 'now').mockImplementationOnce(() => '2021-08-12T17:41:36.019Z')
            const res = await assessmentService.startBySession(assessmentRes.session)

            expect(res).toMatchObject({
                started_at: new Date('2021-08-12T17:41:36.019Z'),
                submitted_at: null,
            })
        }) //test
    }) // group
    describe('.endBySession()', () => {
        it('should end assessment', async () => {
            const assessmentRes = await Assessment.query().insertAndFetch({
                taker_id: 1,
                exam_id: 1,
                session: faker.datatype.uuid(),
                started_at: '2021-08-12T17:41:36.019Z',
            })
            jest.spyOn(Assessment.fn, 'now').mockImplementationOnce(() => '2021-08-12T18:01:47.269Z')
            const res = await assessmentService.endBySession(assessmentRes.session)

            expect(res).toMatchObject({
                started_at: new Date('2021-08-12T17:41:36.019Z'),
                submitted_at: new Date('2021-08-12T18:01:47.269Z'),
            })
        }) //test
    }) // group
    describe('.isExpired()', () => {
        it('should return false if time is up', () => {
            const assessment = { started_at: DateTime.now().toSQL() }
            const res = assessmentService.isExpired(assessment)
            expect(res).toBe(false)
        })
        it('should return true if time is not up', () => {
            const assessment = { started_at: DateTime.now().minus({ hour: 1 }).toSQL() }
            const res = assessmentService.isExpired(assessment)
            expect(res).toBe(true)
        })
    }) // group
    describe('.isCompleted()', () => {
        it('should return false if assessment has not been submitted', () => {
            const assessment = { submitted_at: null }
            const res = assessmentService.isCompleted(assessment)
            expect(res).toBe(false)
        })
        it('should return true if assessment has been submitted', () => {
            const assessment = { submitted_at: DateTime.now().toSQL() }
            const res = assessmentService.isCompleted(assessment)
            expect(res).toBe(true)
        })
    }) // group
    describe('.isAccessible()', () => {
        it('should return false if time is up or assessment has been submitted', () => {
            // time's up
            const assessment1 = { started_at: DateTime.now().minus({ hour: 1 }).toSQL(), submitted_at: null }
            const res1 = assessmentService.isAccessible(assessment1)
            expect(res1).toBe(false)

            // submitted
            const assessment2 = { started_at: DateTime.now().toSQL(), submitted_at: DateTime.now().toSQL() }
            const res2 = assessmentService.isAccessible(assessment2)
            expect(res2).toBe(false)
        })
        it('should return true if assessment has not expired and has not been submitted', () => {
            const assessment = { started_at: DateTime.now().toSQL(), submitted_at: null }
            const res = assessmentService.isAccessible(assessment)
            expect(res).toBe(true)
        })
    }) // group
}) // group
