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

module.exports = router
