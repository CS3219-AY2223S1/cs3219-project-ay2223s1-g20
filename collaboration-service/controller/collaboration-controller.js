import { getSessionId, initSession } from "../model/collaboration-model";
import { Server } from 'socket.io'

export async function handleCollaborationEvents(io) {
    io.on('connection', (socket) => {
        console.log("[socketIO] Connection established, socketId=", socket.id)

        socket.on('startSession', (roomId, username, difficulty) => {
            console.log(`[socketIO] socketId=${socket.id} requesting to start session`)
            const res = initSession(socket.id, roomId, username, difficulty)
            // res = {isSessionReqExist: true, otherSocketId: 123, sessionId: 123, questionNumber: 1}
            if (res.isSessionReqExist == true) {
                const questionNumber = selectQuestion(difficulty)
                socket.join(res.sessionId)
                io.sockets.sockets.get(res.otherSocketId).join(res.sessionId);
                const resp = {sessionId: res.sessionId, questionNumber: questionNumber}
                io.to(res.sessionId).emit('sessionSuccess', resp)
            }
        })

        socket.on('sendChanges', (code) => {
            const sessionId = getSessionId(socket.id)
            io.to(sessionId).emit('updateChanges', code)
        })

        socket.on('changeQuestion', () => {})

        socket.on('leaveRoom', () => {

        })

        socket.on('disconnect', () => {

        })
    })
}

function selectQuestion(difficulty) {
    return 1
}