import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { matchHandler } from './controller/match-controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
    //res.sendFile(__dirname + '/index.html');
});

const httpServer = createServer(app)
const io = new Server(httpServer)

var sockets = {}

io.on('connection', (socket) => {
    const userID = socket.id;
    sockets[userID] = socket;
    console.log("Connection established, socketID: ", socket.id);

    socket.on("match", (req, callback) => {
        console.log("received event");
        socket.emit("connected");
        matchHandler(req, userID)
            .then((resp) => {
                if (resp.event == "matchSuccess") {
                    socket.join(resp.matchID);
                    sockets[resp.matchedUserID].join(resp.matchID);
                    io.to(resp.matchID).emit(resp.event, resp.message);
                } else {
                    console.log('Match Result: ' + JSON.stringify(resp));
                    // socket.emit(resp.event, resp.message);
                    callback(resp);
                }
            })
    })
})

httpServer.listen(8001);
