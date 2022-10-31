const { credential } = require('firebase-admin')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { readFileSync } = require('fs')

const serviceAccount = require('./creds.json')
const privateKey = readFileSync('./firebase.txt').toString()

initializeApp({ credential: credential.cert({ ...serviceAccount, "private_key": privateKey }) })

const db = getFirestore()

module.exports = { db }