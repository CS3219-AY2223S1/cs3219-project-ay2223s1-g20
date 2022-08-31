import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createMatch } from './controller/match-controller.js';

import { Sequelize, DataTypes } from "sequelize";

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


io.on('connection', (socket) => {
    console.log(socket.id);
    
    socket.on("message", (data) => {
        console.log(data)
    });

    socket.on("match", (matchReq) => {
        createMatch(matchReq);
    })

})

httpServer.listen(8001);
