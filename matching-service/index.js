import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors';
import { createServer } from 'http';
import { matchHandler } from './controller/match-controller.js';
import { instrument } from '@socket.io/admin-ui'
import { handleLeaveEvent } from './controller/socket-controller.js';

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
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
})


io.on('connection', (socket) => {
    const userID = socket.id;
    console.log("[socketIO] Connection established, userID=", socket.id);

    socket.on("match", (req, callback) => {
        console.log(`[socketIO] userID=${socket.id} requesting to match`);
        matchHandler(req, userID)
            .then((resp) => {
                if (resp.event == "matchSuccess") {
                    socket.join(resp.matchID);
                    io.sockets.sockets.get(resp.matchedUserID).join(resp.matchID);
                    io.to(resp.matchID).emit(resp.event, resp.message);
                    console.log(`[socketIO] MATCHSUCCESS, matchID=${resp.matchID}`)
                } else {
                    socket.emit(resp.event, resp.message);
                }
                console.log(`[socketIO] matchResult=${resp.event}, resp=`, resp)
            })
    });

    socket.on("leave", () => {
        console.log(`[socketIO] userID=${socket.id} requesting to leave, roomInfo=`, socket.rooms);
        handleLeaveEvent(io, socket);
        console.log(`[socketIO] Rooms of ${socket.id} have been closed.`);
    })

    socket.on("disconnecting", () => {
        console.log(`[socketIO] userID=${socket.id} disconnecting, roomInfo=`, socket.rooms);
        handleLeaveEvent(io, socket);
        console.log(`[socketIO] userID=${socket.id} disconnecting, all relevant rooms closed`);
    })

    socket.on("disconnect", () => {
        console.log(`[socketIO] userID=${socket.id} disconnected.`);
    })
})

instrument(io, {
    auth: false
})

httpServer.listen(8001);
