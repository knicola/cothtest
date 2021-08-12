'use strict'

const request = require('supertest')
const app = require('../../src/app')

const faker = require('faker')
const examService = require('../../src/services/exam')
jest.mock('../../src/services/exam')
const takerService = require('../../src/services/taker')
jest.mock('../../src/services/taker')
const assessmentService = require('../../src/services/assessment')
jest.mock('../../src/services/assessment')

describe('[unit] API V1', () => {
    afterEach(async () => jest.resetAllMocks())
    describe('POST /assessment/create/:examId', () => {
        it('should fail with 404 if exam id does not exist', async () => {
            examService.findById.mockReturnValueOnce(undefined)

            await request(app)
                .post('/api/v1/assessment/create/100')
                .send({
                    first_name: faker.name.firstName(),
                    last_name: faker.name.lastName(),
                    email: faker.internet.email(),
                })
                .set('Accept', 'application/json')
                .expect(404)

            expect(examService.findById).toBeCalledTimes(1)
            expect(examService.findById).toBeCalledWith('100')
            expect(assessmentService.create).toBeCalledTimes(0)
        }) // test
        it('should fail with 422 if input is invalid', async () => {
            const taker = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: 'invalid email',
            }
            examService.findById.mockResolvedValue({ id: '20' })

            const res = await request(app)
                .post('/api/v1/assessment/create/20')
                .send(taker)
                .set('Accept', 'application/json')
                .expect(422)

            expect(examService.findById).toBeCalledTimes(1)
            expect(examService.findById).toBeCalledWith('20')
            expect(takerService.findOrCreate).toBeCalledTimes(0)
            expect(assessmentService.create).toBeCalledTimes(0)
            expect(res.body).toMatchObject({ status: 422, data: false })
        }) // test
        it('should create new assessment for given taker', async () => {
            const taker = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }

            examService.findById.mockResolvedValue({ id: '20' })
            takerService.findOrCreate.mockResolvedValue(Object.assign({}, taker, { id: '10' }))
            assessmentService.create.mockResolvedValue({ session: 'yolo-uuid' })

            const res = await request(app)
                .post('/api/v1/assessment/create/20')
                .send(taker)
                .set('Accept', 'application/json')
                .expect(200)

            expect(examService.findById).toBeCalledTimes(1)
            expect(examService.findById).toBeCalledWith('20')
            expect(takerService.findOrCreate).toBeCalledTimes(1)
            expect(takerService.findOrCreate).toBeCalledWith(taker)
            expect(assessmentService.create).toBeCalledTimes(1)
            expect(assessmentService.create).toBeCalledWith('20', '10')
            expect(res.body.data).toEqual('yolo-uuid')
        }) // test
    }) // group
}) // group
