const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { readFileSync } = require('fs')

const serviceAccount = require('./creds.json')

const privateKey = process.env.FIREBASE_KEY || readFileSync('firebase.key').toString()

initializeApp({
    credential: cert({
        ...serviceAccount,
        privateKey: privateKey
    })
})

const db = getFirestore()

module.exports = { db }