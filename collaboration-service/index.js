import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors';
import { createServer } from 'http';
import { instrument } from '@socket.io/admin-ui'
import { handleCollaborationEvents } from './controller/collaboration-controller.js';
import { deleteSession, getSession, saveSession } from './model/repository.js';
import fetch from 'node-fetch';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from collaboration-service');
});

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
})

instrument(io, {
    auth: false
})

handleCollaborationEvents(io)
// await saveSession("room1", "xuanqi1", "xuanqi2", "tough")
// const res = await getSession("room1")
// console.log("Result from redis: ", res)
// deleteSession("room1")
httpServer.listen(8002, () => console.log(`Express Server has started on port: 8002`));


// app.get("/getquestions", async (req, res) => {
//     try{
//         console.log(req.body);
//         let {data} = await getDataFromQuestionService(req);
//         console.log(data)
//         return res.send(data);
//     }catch(e){
//         res.send({success: false})
//     }
// });

// requests a random question of given difficulty from question service
app.get("/getquestion/:difficulty", async (req, res) => {
    const { difficulty } = req.params
    try{
        console.log(req.params.difficulty);
        let {data} = await getDataFromQuestionService(req);
        return res.send(data);
    }catch(e){
        res.send({success: false})
    }
});

// fetch to access API in question service
function getDataFromQuestionService(req){
    return fetch('http://localhost:8383/question/difficulty/'+req.params.difficulty, { 
        method: 'get',
        headers: { 'Content-Type': 'text/plain' },
    }).then(res => res.text())
        .then((response)=>{
            console.log("fetch from question service")
            console.log(response)
            return {
                data: response
            }
        }).catch((error) => {
            throw new Error("Unable to retrieve question")
        })
}



// function getDataFromQuestionService(req){
//     return fetch('http://localhost:8383/questions/difficulty/'+req.params.difficulty, { 
//         method: 'get',
//         headers: { 'Content-Type': 'application/json' },
//     }).then(res => res.json())
//         .then((response)=>{
//             console.log("fetch from question service")
//             return {
//                 data: response
//             }
//         }).catch((error) => {
//             throw new Error("Unable to retrieve questions")
//         })
// }

