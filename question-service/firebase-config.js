const { credential } = require('firebase-admin')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

require('dotenv').config()

const serviceAccount = require('./creds.json')
const privateKey = process.env.FIREBASE_KEY.replace(/\\n/g, '\n')

initializeApp({ credential: credential.cert({ ...serviceAccount, "private_key": privateKey }) })

const db = getFirestore()

module.exports = { db }