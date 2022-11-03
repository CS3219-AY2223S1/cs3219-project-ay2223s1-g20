const express = require("express");
const cors = require('cors');
const { db } = require('./firebase-config.js');

const app = express()
app.use(express.json())
app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World question-service');
});

// get all questions
app.get('/questions', async (req, res) => {
    const qnsRef = db.collection('questions');
    const snapshot = await qnsRef.get();

    var qnsArray = [];
    if (snapshot.empty) {
        console.log('No matching documents.');
        return res.sendStatus(400);
    }
    snapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        // qnsArray.push(doc.data());
        qnsArray.push(doc.id);
    });

    res.status(200).send(qnsArray);
})

// get question with a particular title
// app.get('/questions/:title', async (req, res) => {
//     const { title } = req.params
//     const qnsRef = db.collection('questions');
//     const snapshot = await qnsRef.where('title', '==', title).get();

//     if (!title || snapshot.empty) {
//         return res.sendStatus(404)
//     }

//     snapshot.forEach(doc => {
//         console.log(doc.id, '=>', doc.data());
//         res.status(200).send(doc.data());
//     });
// })

// get all questions of given difficulty
app.get('/questions/difficulty/:difficulty', async (req, res) => {
    const { difficulty } = req.params
    const qnsRef = db.collection('questions');
    const snapshot = await qnsRef.where('difficulty', '==', difficulty).get();

    var qnsArray = [];
    if (snapshot.empty) {
        console.log('No matching documents.');
        return res.sendStatus(400);
    }
    snapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        // qnsArray.push(doc.data());
        qnsArray.push(doc.id);
    });

    res.status(200).send(qnsArray);
})

// get a random question of given difficulty
app.get('/question/difficulty/:difficulty', async (req, res) => {
    const { difficulty } = req.params
    const qnsRef = db.collection('questions');
    const snapshot = await qnsRef.where('difficulty', '==', difficulty).get();

    var qnsArray = [];
    if (snapshot.empty) {
        console.log('No matching documents.');
        return res.sendStatus(400);
    }
    snapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        // qnsArray.push(doc.data());
        qnsArray.push(doc.id);
    });

    const randomQn = qnsArray[Math.floor(Math.random() * qnsArray.length)];

    res.status(200).send(randomQn);
})

// get question with a particular ID
app.get('/question/id/:id', async (req, res) => {
    const { id } = req.params
    console.log('[Retrieve by Id] ', id)
    const docRef = db.collection('questions').doc(id);
    const snapshot = await docRef.get();

    if (!id || snapshot.empty) {
        return res.sendStatus(404)
    }

    res.status(200).send(snapshot.data());
})

const port = process.env.PORT || 8003;

app.listen(port, () => console.log(`Server has started on port: ${port}`));