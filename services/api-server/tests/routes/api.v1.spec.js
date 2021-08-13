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
    describe('GET /assessment/:session/test', () => {
        it('should fail with 404 if assessment is not found or is inactive', async () => {
            assessmentService.findBySession.mockResolvedValue(undefined)
            const session = faker.datatype.uuid()
            const res = await request(app)
                .get(`/api/v1/assessment/${session}/test`)
                .set('Accept', 'application/json')

            expect(assessmentService.findBySession).toBeCalledTimes(1)
            expect(assessmentService.findBySession).toBeCalledWith(session)
            expect(takerService.findById).toBeCalledTimes(0)
            expect(res.body).toMatchObject({ status: 404, data: false })
            expect(res.status).toBe(404)
        }) // test
        it('should retrieve the assessment', async () => {
            const taker = {
                id: faker.datatype.number(100),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }
            const assessment = {
                test: faker.datatype.string(10),
                ing: faker.datatype.string(10),
                taker_id: taker.id,
            }
            const session = faker.datatype.uuid()
            assessmentService.isAccessible.mockReturnValue(true)
            assessmentService.findBySession.mockResolvedValue({
                ...assessment,
                taker_id: taker.id,
            })
            takerService.findById.mockResolvedValue(taker)

            const res = await request(app)
                .get(`/api/v1/assessment/${session}/test`)
                .set('Accept', 'application/json')
                .expect(200)

            expect(assessmentService.findBySession).toBeCalledTimes(1)
            expect(assessmentService.findBySession).toBeCalledWith(session)
            expect(takerService.findById).toBeCalledTimes(1)
            expect(takerService.findById).toBeCalledWith(taker.id)
            expect(res.body.data).toStrictEqual({
                ...assessment,
                taker,
            })
        }) // test
    }) // group
    describe('POST /assessment/:session/start', () => {
        it('should fail with 404 if assessment is not found or is inactive', async () => {
            const session = faker.datatype.uuid()
            assessmentService.startBySession.mockResolvedValue(undefined)

            const res = await request(app)
                .post(`/api/v1/assessment/${session}/start`)
                .set('Accept', 'application/json')

            expect(assessmentService.startBySession).toBeCalledTimes(1)
            expect(assessmentService.startBySession).toBeCalledWith(session)
            expect(res.body).toMatchObject({ status: 404, data: false })
            expect(res.status).toEqual(404)
        }) // test
        it('should start the assessment', async () => {
            const session = faker.datatype.uuid()
            assessmentService.startBySession.mockResolvedValue({
                id: 100,
                session: session,
                started_at: Date.now(),
            })

            const res = await request(app)
                .post(`/api/v1/assessment/${session}/start`)
                .set('Accept', 'application/json')
                .expect(200)

            expect(assessmentService.startBySession).toBeCalledTimes(1)
            expect(assessmentService.startBySession).toBeCalledWith(session)
            expect(res.body.data).toBe(true)
        }) // test
    }) // group
    describe('GET /assessment/:session/question/:questionId', () => {
        it('should fail with 404 if assessment is not found or is inactive', async () => {
            assessmentService.findBySession.mockResolvedValue(undefined)
            assessmentService.isAccessible.mockReturnValue(false)
            const session = faker.datatype.uuid()
            const res = await request(app)
                .get(`/api/v1/assessment/${session}/question/1`)
                .set('Accept', 'application/json')
            expect(assessmentService.findBySession).toBeCalledTimes(1)
            expect(assessmentService.findBySession).toBeCalledWith(session)
            expect(examService.getQuestions).toBeCalledTimes(0)
            expect(res.body).toMatchObject({ status: 404, data: false, })
            expect(res.status).toEqual(404)
        }) // test
        it('should fail with 404 if question is not found', async () => {
            assessmentService.findBySession.mockResolvedValue({ exam_id: 100 })
            assessmentService.isAccessible.mockReturnValue(true)
            examService.getQuestions.mockResolvedValue([ { text: 'i has cheezburgerz' }, { text: 'i has friez'} ])
            const session = faker.datatype.uuid()

            const res = await request(app)
                .get(`/api/v1/assessment/${session}/question/3`)
                .set('Accept', 'application/json')
                .expect(404)

            expect(res.body).toMatchObject({ status: 404, data: false })
        }) // test
        it('should retrieve the first question', async () => {
            assessmentService.findBySession.mockResolvedValue({ exam_id: 100 })
            assessmentService.isAccessible.mockReturnValue(true)
            examService.getQuestions.mockResolvedValue([ { text: 'i has cheezburgerz' }, { text: 'i has friez'} ])
            const session = faker.datatype.uuid()

            const res = await request(app)
                .get(`/api/v1/assessment/${session}/question/1`)
                .set('Accept', 'application/json')
                .expect(200)

            expect(res.body.data).toEqual({ text: 'i has cheezburgerz' })
        }) // test
        it('should retrieve the second question', async () => {
            assessmentService.findBySession.mockResolvedValue({ exam_id: 100 })
            assessmentService.isAccessible.mockReturnValue(true)
            examService.getQuestions.mockResolvedValue([ { text: 'i has cheezburgerz' }, { text: 'i has friez'} ])
            const session = faker.datatype.uuid()

            const res = await request(app)
                .get(`/api/v1/assessment/${session}/question/2`)
                .set('Accept', 'application/json')
                .expect(200)

            expect(res.body.data).toEqual({ text: 'i has friez' })
        }) // test
    }) // group
}) // group
