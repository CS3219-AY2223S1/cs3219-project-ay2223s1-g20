const { credential } = require('firebase-admin')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { readFileSync } = require('fs')

const serviceAccount = require('./creds.json')

let privateKey

if (process.env.ENV === "PROD") {
    privateKey = process.env.FIREBASE_KEY.replace(/\\n/g, 'n')
} else {
    privateKey = readFileSync('./firebase.key').toString()
}

initializeApp({
    credential: credential.cert({ ...serviceAccount, "private_key": privateKey })
})

const db = getFirestore()

module.exports = { db }