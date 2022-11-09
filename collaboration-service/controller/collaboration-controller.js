import { getDifficultyLevelForUser, getMatchSocketId, getSessionId, initSession } from "../model/collaboration-model.js";
import { checkSessionExists, checkUserExists, deleteSession, deleteUser, getPending, getSession, getUpdate, savePending, saveUpdate } from "../model/repository.js";
import fetch from 'node-fetch';
import { ChangeSet } from "@codemirror/state";


export async function handleCollaborationEvents(io) {
    io.on('connection', (socket) => {
        console.log("[socketIO] Connection established, socketId=", socket.id)

        socket.on('startSession', async (req) => {
            const roomId = req.roomId
            const username = req.username
            const difficulty = req.difficulty
            console.log(`[socketIO, startSession] socketId=${socket.id}, roomId=${roomId}, username=${username}, difficulty=${difficulty}`)
            const res = await initSession(socket.id, roomId, username, difficulty)
            // res = {isSessionReqExist: true, matchSocketId: 123, sessionId: 123}
            if (res.isSessionReqExist == true) {
                const questionNumber = await selectQuestion(difficulty)
                socket.join(res.sessionId)
                io.sockets.sockets.get(res.matchSocketId).join(res.sessionId);
                const resp = {sessionId: res.sessionId, questionNumber: questionNumber}
                io.to(res.sessionId).emit('sessionSuccess', resp)
            }
        })

        socket.on('sendChanges', async (payload) => {
            console.log(`[socketIO, sendChanges] socketId=${socket.id}`)
            const sessionId = await getSessionId(socket.id)
            // console.log(sessionId)
            io.to(sessionId).emit('updateChanges', payload)
        })

        socket.on('pullUpdates', async (version) => {
            const sessionId = await getSessionId(socket.id)
            var updates = getUpdate(sessionId)
            if (version < updates.length) {
                socket.emit("pullUpdateResponse", JSON.stringify(updates.slice(version)))
            } else {
                var pending = getPending(sessionId)
                pending.push((updates, ver, skt) => {
                    skt.emit("pullUpdateResponse", JSON.stringify(updates.slice(ver)))
                })
                savePending(sessionId, pending)
            }
        })

        socket.on('pushUpdates', async (version, docUpdates) => {
            const sessionId = await getSessionId(socket.id)
            var pending = getPending(sessionId)
            var updates = getUpdate(sessionId)
            var docUpdates = JSON.parse(docUpdates)

            if (version != updates.length) {
                socket.emit('pushUpdateResponse', false)
            } else {
                for (let update of docUpdates) {
                    let changes = ChangeSet.fromJSON(update.changes)
                    updates.push({changes, clientID: update.clientID})
                    saveUpdate(sessionId, updates)
                }
                socket.emit('pushUpdateResponse', true)

                while (pending.length > 0) {p
                    const f = pending.shift()
                    f(updates, version, socket)
                    savePending(sessionId, pending)
                }
            }
        })

        socket.on('changeQuestion', async () => {
            console.log(`[socketIO, changeQuestion] socketId=${socket.id} requesting to change question`)
            const matchSocketId = await getMatchSocketId(socket.id)
            io.sockets.sockets.get(matchSocketId).emit('changeQuestionReq')
        })

        socket.on('changeQuestionRsp', async (result) => {
            console.log(`[socketIO, changeQuestionRsp] socketId=${socket.id} responding to change question`)
            const matchSocketId = await getMatchSocketId(socket.id)
            io.sockets.sockets.get(matchSocketId).emit('changeQuestionRes', result)

            if (result == true) {
                // 1. Select new question with difficulty level
                const difficulty = await getDifficultyLevelForUser(socket.id)
                const newQnNum = await selectQuestion(difficulty)
                // 2. Emit new question to both users
                const sessionId = await getSessionId(socket.id)
                io.to(sessionId).emit('newQuestion', newQnNum)
            }
        })

        socket.on('leaveRoom', async () => {
            console.log(`[socketIO, leaveRoom] socketId=${socket.id} requesting to leave`)
            const sessionId = await getSessionId(socket.id)
            if (sessionId != null) {
                io.socketsLeave(sessionId)
                // 2. get userInfo for both users, remove both users from redis
                const sessionInfo = await getSession(sessionId)
                await deleteUser(sessionInfo.socketId1)
                await deleteUser(sessionInfo.socketId2)
                io.sockets.sockets.get(sessionInfo.socketId1).disconnect
                io.sockets.sockets.get(sessionInfo.socketId2).disconnect
                // 3. get sessionInfo, remove session from redis
                await deleteSession(sessionId)

                const isSessinClosed = await verifySessionClosed(sessionId, sessionInfo.socketId1, sessionInfo.socketId2)
                if (isSessinClosed == true) {
                    console.log(`[socketIO, leaveRoom] Session closed successfully for sid=${sessionId}`)
                } else {
                    console.log(`[socketIO, leaveRoom] ERR: Session close failed for sid=${sessionId}`)
                }
            } else {
                console.log(`[socketIO, leaveRoom] ERR: Cannot find valid session for socketId=${socket.id}`)
            }
        })

        socket.on('disconnecting', async () => {
            console.log(`[socketIO, disconnecting] socketId=${socket.id} disconnecting`)
            const sessionId = await getSessionId(socket.id)
            if (sessionId != null) {
                io.socketsLeave(sessionId)
                // 2. get userInfo for both users, remove both users from redis
                const sessionInfo = await getSession(sessionId)
                await deleteUser(sessionInfo.socketId1)
                await deleteUser(sessionInfo.socketId2)
                // 3. get sessionInfo, remove session from redis
                await deleteSession(sessionId)

                const isSessinClosed = await verifySessionClosed(sessionId, sessionInfo.socketId1, sessionInfo.socketId2)
                if (isSessinClosed == true) {
                    console.log(`[socketIO, disconnecting] Session closed successfully for sid=${sessionId}`)
                } else {
                    console.log(`[socketIO, disconnecting] ERR: Session close failed for sid=${sessionId}`)
                }
            } else {
                await deleteUser(socket.id)
                console.log(`[socketIO, disconnecting] UserInfo removed for socketId=${socket.id}`)
            }
        })

        socket.on('disconnect', () => {
            console.log(`[socketIO] socketId=${socket.id} disconnected`)
        })
    })
}

async function selectQuestion(difficulty) {
    const uri_question_svc = process.env.URI_QUESTION_SVC || 'http://localhost:8003';

    return fetch(uri_question_svc + '/question/difficulty/' + difficulty, {
        method: 'get',
        headers: { 'Content-Type': 'text/plain' },
    }).then(res => res.text())
        .then((response)=>{
            return {
                data: response
            }
        }).catch((error) => {
            // throw new Error("Unable to retrieve question")
            return {
                data: 'help'
            }
        })
}

async function verifySessionClosed(sessionId, socketId1, socketId2) {
    const isSessionExists = await checkSessionExists(sessionId)
    const isUser1Exists = await checkUserExists(socketId1)
    const isUser2Exists = await checkUserExists(socketId2)
    return !isSessionExists && !isUser1Exists && !isUser2Exists
}