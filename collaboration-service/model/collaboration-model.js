import { checkSessionReqExists, getSession, getUser, popSessionRequest, saveSession, saveSessionRequest, saveUser } from "./repository.js";

export async function initSession(socketId, roomId, username, difficulty) {
    var res = {}
    const isSessionReqExist = await checkSessionReqExists(roomId)
    if (isSessionReqExist == true) {
        const sessionReq = await popSessionRequest(roomId)
        const sessionId = generateSessionId(socketId, sessionReq.socketId)
        await saveUser(socketId, sessionId, username)
        await saveUser(sessionReq.socketId, sessionId, sessionReq.username)
        await saveSession(sessionId, socketId, sessionReq.socketId, difficulty)
        res.matchSocketId = sessionReq.socketId
        res.sessionId = sessionId

        console.log(`[initSession] Session created for sessionId=${sessionId}, socketId1=${socketId}, socketId2=${sessionReq.socketId}, diffculty=${difficulty}`)
    } else {
        await saveSessionRequest(socketId, roomId, username)
        console.log(`[initSession] SessionReq save for socketId=${socketId}, roomId=${roomId}, username=${username}`)
    }
    res.isSessionReqExist = isSessionReqExist
    return res
}

export async function getSessionId(socketId) {
    const { sessionId, username } = await getUser(socketId)
    return sessionId
}

export async function getMatchSocketId(socketId) {
    const {sessionId, username} = await getUser(socketId)
    const { socketId1, socketId2, difficulty } = await getSession(sessionId)
    if (socketId1 == socketId) {
        return socketId1
    } else {
        return socketId2
    }
}

export async function getDifficultyLevelForUser(socketId) {
    const {sessionId, username} = await getUser(socketId)
    const { socketId1, socketId2, difficulty } = await getSession(sessionId)
    return difficulty
}

function generateSessionId(socketId1, socketId2) {
    return "CollaborationSession_" + socketId1 + "_" + socketId2
}