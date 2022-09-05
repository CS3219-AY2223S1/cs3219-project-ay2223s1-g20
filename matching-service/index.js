import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { matchHandler } from './controller/match-controller.js';

import { Sequelize, DataTypes } from "sequelize";
import { MatchStatus } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    //res.send('Hello World from matching-service');
    res.sendFile(__dirname + '/index.html');
});

const httpServer = createServer(app)
const io = new Server(httpServer)

sockets = {}

io.on('connection', (socket) => {
    const userID = socket.id;
    sockets[userID] = socket;
    console.log("Connection established, socketID: ", socket.id);

    socket.on("match", (req) => {
        const matchResult = matchHandler(req, userID);

        if (matchResult.matchStatus == MatchStatus.MatchSuccess) {
            const matchID = matchResult.matchID;
            const matchedUserID = matchResult.matchedUserID;
            const matchedUsername = matchResult.matchedUsername;

            socket.join(matchID);
            sockets[matchedUserID].join(matchID);

            resp = {
                matchedUsername: matchedUsername
            }

            io.to(matchID).emit("matchSuccess", resp);
        } else if (matchResult.matchStatus == MatchStatus.MatchPending) {
            socket.emit("matchPending");
        } else if (matchResult.matchStatus == MatchStatus.MatchExists) {
            socket.emit("matchExists");
        } else {
            socket.emit("pending");
        }
    })

})

httpServer.listen(8001);
