const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

let credentials

if (process.env.FIREBASE_CONFIG != undefined) {
    credentials = JSON.parse(process.env.FIREBASE_CONFIG)
} else {
    credentials = require('./creds.json')
}

initializeApp(credentials)

const db = getFirestore()

module.exports = { db }