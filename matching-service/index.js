import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { closeMatchHandler, matchHandler } from './controller/match-controller.js';

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


io.on('connection', (socket) => {
    const userID = socket.id;
    console.log("[socketIO] Connection established, socketID: ", socket.id);

    socket.on("match", (req, callback) => {
        console.log("[socketIO] Event received, event=match, req=", req);
        matchHandler(req, userID)
            .then((resp) => {
                if (resp.event == "matchSuccess") {
                    socket.join(resp.matchID);
                    io.sockets.sockets.get(resp.matchedUserID).join(resp.matchID);
                    io.to(resp.matchID).emit(resp.event, resp.message);
                    console.log("[matchSuccess] username1=", resp.username, " username2=", resp.matchedUsername, " have joined roomID= ", resp.matchID)
                } else {
                    console.log('Match Result: ' + JSON.stringify(resp));
                    // socket.emit(resp.event, resp.message);
                    callback(resp);
                }
            })
    });

    socket.on("leaveRoom", () => {
        console.log("[socketIO] Event received, event=leaveRoom");
        closeMatchHandler(socket.rooms);
        for (roomID in socket.rooms) {
            if (roomID != socket.id) {
                io.socketsLeave(roomID);
                // emit sth to tell them they have left
            }
        }
        console.log(`[socketIO] All rooms of ${socket.id} have been closed.`);
    })

    socket.on("disconnecting", () => {
        
        console.log("[socketIO] Event received, event=leaveRoom");
        closeMatchHandler(socket.rooms);
        for (roomID in socket.rooms) {
            if (roomID != socket.id) {
                io.socketsLeave(roomID);
            }
        }
        console.log(`[] All rooms of ${socket.id} have been closed.`);
    })

    socket.on("disconnect", () => {
        console.log(`[disconnect] ${socket.id} has disconnected.`);
    })
})

httpServer.listen(8001);
