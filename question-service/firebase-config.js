const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { readFileSync } = require('fs')

const service_account = require('./creds.json')
const key = process.env.FIREBASE_KEY || readFileSync('./firebase.key').toString()

initializeApp({
    ...service_account,
    privateKey: key,
})

const db = getFirestore()

module.exports = { db }