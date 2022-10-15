const express = require("express");
const { FieldValue } = require('firebase-admin/firestore');

const app = express()
const port = 8383
const { db } = require('./firebase-config.js');
const { application } = require("express");

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World question-service');
});

app.get('/questions', async (req, res) => {
    const qnsRef = db.collection('questions');
    const snapshot = await qnsRef.get();

    var qnsArray = [];
    if (snapshot.empty) {
        console.log('No matching documents.');
        return res.sendStatus(400);
    }
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        // qnsArray.push(doc.data());
        qnsArray.push(doc.id);
    });
    
    res.status(200).send(qnsArray);
})

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

app.get('/questions/:id', async (req, res) => {
    const { id } = req.params
    const docRef = db.collection('questions').doc(id);
    const snapshot = await docRef.get();

    if (!id || snapshot.empty) { 
        return res.sendStatus(404)
    }

    res.status(200).send(snapshot.data());
})

app.listen(port, () => console.log(`Server has started on port: ${port}`));