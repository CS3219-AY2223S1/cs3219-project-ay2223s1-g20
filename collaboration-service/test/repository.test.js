// import { createClient } from 'redis'

// client.on('error', (err) => console.log('Redis Client Error', err))
// client.connect()

const saveSessionRequest = require('../model/repository.js')

test('Normal test 1', () => {
    expect(1+1).toBe(2)
})