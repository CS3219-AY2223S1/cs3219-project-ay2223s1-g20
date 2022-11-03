const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { readFileSync } = require('fs')

const serviceAccount = require('./creds.json')
const privateKey = readFileSync('firebase.key')


initializeApp({
    credential: cert({
        ...serviceAccount,
        privateKey: privateKey.toString()
    })
})

const db = getFirestore()

module.exports = { db }