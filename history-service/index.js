const express = require("express");
const cors = require('cors');
const { FieldValue } = require('firebase-admin/firestore');
const { db } = require('./firebase-config.js');

const app = express()
app.use(express.json())
app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World history-service');
});

app.post('/history', async (req, res) => {
    const data = req.body
    const username = data.username
    const questionID = data.questionId
    console.log('[Post by username] ', username)
    const userRef = db.collection('history').doc(username)
    const res2 = await userRef.set({
        "questionID" : FieldValue.arrayUnion(questionID)
    }, { merge: true });

    return res.sendStatus(200)
})

// get questions history for a particular username
app.get('/history/:username', async (req, res) => {
    const { username } = req.params
    console.log('[Retrieve by username] ', username)
    const docRef = db.collection('history').doc(username);
    const snapshot = await docRef.get();

    if (!username || !snapshot.data()) {
        return res.sendStatus(404)
    }

    questionIdHistory = snapshot.data().questionID;

    var qnsArray = [];

    for (const id of questionIdHistory) {
        const questionsRef = db.collection('questions').doc(id);
        const snapshot2 = await questionsRef.get();

        if (snapshot2.data() != undefined) {
            qnsArray.push([snapshot2.data()?.questionTitle, snapshot2.data()?.difficulty]);
        }
    }
    return res.status(200).send(qnsArray);

})

const port = process.env.PORT || 8005

app.listen(port, () => console.log(`Server has started on port: ${port}`));