const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { readFileSync } = require('fs')

const service_account = require('./creds.json')

let key

if (process.env.FIREBASE_KEY != undefined) {
    key = Buffer.from(process.env.FIREBASE_KEY, 'base64').toString('ascii');
} else {
    key = readFileSync('./firebase.key').toString()
}

initializeApp({
    credential: cert({
        ...service_account,
        privateKey: key,
    })
})

const db = getFirestore()

module.exports = { db }