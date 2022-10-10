import { getDifficultyLevelForUser, getMatchSocketId, getSessionId, initSession } from "../model/collaboration-model";
import { Server } from 'socket.io'
import { deleteSession, deleteUser, getSession } from "../model/repository";

export async function handleCollaborationEvents(io) {
    io.on('connection', (socket) => {
        console.log("[socketIO] Connection established, socketId=", socket.id)

        socket.on('startSession', async (roomId, username, difficulty) => {
            console.log(`[socketIO] socketId=${socket.id} requesting to start session`)
            const res = await initSession(socket.id, roomId, username, difficulty)
            // res = {isSessionReqExist: true, otherSocketId: 123, sessionId: 123, questionNumber: 1}
            if (res.isSessionReqExist == true) {
                const questionNumber = selectQuestion(difficulty) // change to async after API is done
                socket.join(res.sessionId)
                io.sockets.sockets.get(res.otherSocketId).join(res.sessionId);
                const resp = {sessionId: res.sessionId, questionNumber: questionNumber}
                io.to(res.sessionId).emit('sessionSuccess', resp)
            }
        })

        socket.on('sendChanges', async (code) => {
            console.log(`[socketIO] socketId=${socket.id} sending changes`)
            const sessionId = await getSessionId(socket.id)
            io.to(sessionId).emit('updateChanges', code)
        })

        socket.on('changeQuestion', async () => {
            console.log(`[socketIO] socketId=${socket.id} requesting to change question`)
            const matchSocketId = await getMatchSocketId(socket.id)
            io.sockets.sockets.get(matchSocketId).emit('changeQuestionReq')
        })

        socket.on('changeQuestionRsp', async (result) => {
            console.log(`[socketIO] socketId=${socket.id} responding to change question`)
            socket.emit('changeQuestionRes', result)
            if (result == true) {
                // 1. Select new question with difficulty level
                const difficulty = await getDifficultyLevelForUser(socket.id)
                const newQnNum = selectQuestion(difficulty)
                // 2. Emit new question to both users
                const sessionId = await getSessionId(socket.id)
                io.to(sessionId).emit('newQuestion', newQnNum)
            }
        })

        socket.on('leaveRoom', async () => {
            console.log(`[socketIO] socketId=${socket.id} requesting to leave`)
            // 1. get sessionId, close room for socket
            const sessionId = await getSessionId(socket.id)
            io.socketsLeave(sessionId)
            // 2. get userInfo for both users, remove both users from redis
            const {socketId1, socketId2, difficulty} = await getSession(sessionId)
            deleteUser(socketId1)
            deleteUser(socketId2)
            // 3. get sessionInfo, remove session from redis
            deleteSession(sessionId)
        })

        socket.on('disconnecting', async () => {
            console.log(`[socketIO] socketId=${socket.id} disconnecting`)
            // 1. get sessionId, close room for socket
            const sessionId = await getSessionId(socket.id)
            io.socketsLeave(sessionId)
            // 2. get userInfo for both users, remove both users from redis
            const {socketId1, socketId2, difficulty} = await getSession(sessionId)
            deleteUser(socketId1)
            deleteUser(socketId2)
            // 3. get sessionInfo, remove session from redis
            deleteSession(sessionId)
        })

        socket.on('disconnect', () => {
            console.log(`[socketIO] socketId=${socket.id} disconnected`)
        })
    })
}

function selectQuestion(difficulty) { //TODO: wait for implementation from Question Service
    return 1
}