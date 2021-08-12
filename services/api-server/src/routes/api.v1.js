'use strict'

const express = require('express')
const router = express.Router()

router.get('/test', (req, res, next) => {
    return res.sendStatus(200)
})

module.exports = router
