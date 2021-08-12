'use strict'

const express = require('express')
const router = express.Router()
const logger = require('../logger')

// API v1 routes
router.use('/api/v1', require('./api.v1'))

// 404
router.use(function (req, res) {
    return res.sendStatus(404)
})

// error handler
router.use(function (err, req, res) {
    logger.error(`${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`)

    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // return error
    res.status(err.status || 500)
    res.json(res.locals)
})

module.exports = router
