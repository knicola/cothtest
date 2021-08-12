'use strict'

const faker = require('faker')
const Taker = require('../../src/models/taker')
const takerService = require('../../src/services/taker')

describe('[intgr] services/taker.js', () => {
    afterAll(async () => await Taker.knex().destroy())
    describe('.create()', () => {
        it('should insert a new record and return the result', async () => {
            const record = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }

            const insertRes = await takerService.create(record)
            expect(insertRes).toMatchObject(record)
            expect(insertRes).toHaveProperty('id')
            expect(insertRes).toHaveProperty('created_at')
            expect(insertRes).toHaveProperty('updated_at')

            const selectRes = await Taker.query().where('id', insertRes.id).first()
            expect(selectRes).toEqual(insertRes)
        }) // test
    }) // group
    describe('.findById()', () => {
        it('should retrieve a record using the given id', async () => {
            const record = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }
            const insertRes = await Taker.query().insertAndFetch(record)

            const res = await takerService.findById(insertRes.id)

            expect(res).toEqual(insertRes)
        }) // test
    }) // group
    describe('.findByEmail()', () => {
        it('should retrieve a record using the given email', async () => {
            const record = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }
            const insertRes = await Taker.query().insertAndFetch(record)
            const res = await takerService.findByEmail(insertRes.email)
            expect(res).toEqual(insertRes)
        }) // test
    }) // group
    describe('.findOrCreate()', () => {
        it('should return the existing record, if given email already exists', async () => {
            const record = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }

            const insertRes = await Taker.query().insertAndFetch(record)
            const res = await takerService.findOrCreate(record)

            const {count} = await Taker.query().where('email', record.email).count().first()
            expect(res).toEqual(insertRes)
            expect(count).toEqual('1')
        }) // test
        it('should insert a new record, if given email does not exist, and return the result', async () => {
            const record = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }
            const {count: count0 } = await Taker.query().where('email', record.email).count().first()
            expect(count0).toEqual('0')

            const res = await takerService.findOrCreate(record)

            const selectRes = await Taker.query().where('email', record.email).first()
            const {count: count1} = await Taker.query().where('email', record.email).count().first()
            expect(res).toEqual(selectRes)
            expect(count1).toEqual('1')
        }) // test
    }) // group
}) // group
