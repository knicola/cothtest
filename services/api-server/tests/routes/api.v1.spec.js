'use strict'

const request = require('supertest')
const app = require('../../src/app')

describe('[unit] API V1', () => {
    it('should work', async () => {
        await request(app)
            .get('/api/v1/test')
            .expect(200)
    }) // test
}) // group
