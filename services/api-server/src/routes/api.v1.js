'use strict'

const express = require('express')
const router = express.Router()
const yup = require('yup')
const assessmentService = require('../services/assessment')
const takerService = require('../services/taker')
const examService = require('../services/exam')

const assessmentSchema = yup.object({
    first_name: yup.string().min(2).max(18).required(),
    last_name: yup.string().min(2).max(18).required(),
    email: yup.string().email().required(),
})
router.post('/assessment/create/:examId', async (req, res) => {
    const examExists = await examService.findById(req.params.examId)

    if (! examExists) {
        return res.yield({ status: 404, message: 'Exam not found.' })
    }

    const body = await assessmentSchema.validate(req.body, { stripUnknown: true })
        .then(val => Object.assign({ val }))
        .catch(err => Object.assign({ err }))

    if (body.err) {
        return res.yield({ status: 422, message: 'Invalid input.' })
    }

    const taker = await takerService.findOrCreate(body.val)
    const assessment = await assessmentService.create(req.params.examId, taker.id)

    return res.yield({ data: assessment.session })
})

router.get('/assessment/:session/test', async (req, res) => {
    const assessment = await assessmentService.findBySession(req.params.session)
    if (! assessmentService.isAccessible(assessment)) {
        return res.yield({ status: 404, message: 'Assessment not found or inactive.'})
    }

    const taker = await takerService.findById(assessment.taker_id)

    return res.yield({
        data: {
            ...assessment,
            taker,
        }
    })
})

router.post('/assessment/:session/start', async (req, res) => {
    const assessment = await assessmentService.startBySession(req.params.session)

    return assessment
        ? res.yield({ message: 'success' })
        : res.yield({ status: 404, message: 'Assessment not found or inactive.' })
})

router.get('/assessment/:session/question/:questionId', async (req, res) => {
    const assessment = await assessmentService.findBySession(req.params.session)
    if (! assessmentService.isAccessible(assessment)) {
        return res.yield({ status: 404, message: 'Assessment not found or inactive.'})
    }

    // consider caching question Ids in Redis during assessment creation
    // to avoid fetching all question from database everytime.
    const questions = await examService.getQuestions(assessment)
    const question = questions[Number(req.params.questionId) - 1]

    if (! questions.length || ! question) {
        return res.yield({ status: 404, message: 'Question not found.' })
    }

    return res.yield({ data: question })
})

const answerSchema = yup.object({
    questionId: yup.number().positive().integer().required(),
    optionId: yup.number().positive().integer().notRequired(),
    answeredText: yup.string().min(1).notRequired(),
})
router.post('/assessment/:session/answer', async (req, res) => {
    // todo ...
})

router.post('/assessment/:session/end', async (req, res) => {
    const assessment = await assessmentService.findBySession(req.params.session)
    if (! assessmentService.isAccessible(assessment)) {
        return res.yield({ status: 404, message: 'Assessment not found or inactive.'})
    }

    await assessmentService.endBySession(req.params.session)

    return res.yield({ message: 'success' })
})

router.get('/assessment/:session/result', async (req, res) => {
    // todo ...
})

module.exports = router
