import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors';
import { createServer } from 'http';
import { instrument } from '@socket.io/admin-ui'
import { handleCollaborationEvents } from './controller/collaboration-controller.js';
import { deleteSession, getSession, saveSession } from './model/repository.js';

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
httpServer.listen(8002);
