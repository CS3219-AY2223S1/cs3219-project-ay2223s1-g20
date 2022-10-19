import { Mutex } from "async-mutex";
import { deleteSessionRequest, getSession, getSessionRequest, getUser, saveSession, saveSessionRequest, saveUser } from "./repository.js";

const mutex = new Mutex()

export async function initSession(socketId, roomId, username, difficulty) {
    const release = await mutex.acquire()
    var res = {}
    const sessionReq = await getSessionRequest(roomId)
    console.log(`[initSession] sessionReq=`, sessionReq)
    if (sessionReq != null) {
        const sessionId = generateSessionId(socketId, sessionReq.socketId)
        await saveUser(socketId, sessionId, username)
        await saveUser(sessionReq.socketId, sessionId, sessionReq.username)
        await saveSession(sessionId, socketId, sessionReq.socketId, difficulty)
        await deleteSessionRequest(roomId)
        res.matchSocketId = sessionReq.socketId
        res.sessionId = sessionId
        res.isSessionReqExist = true

        console.log(`[initSession] Session created for sessionId=${sessionId}, socketId1=${socketId}, socketId2=${sessionReq.socketId}, diffculty=${difficulty}`)
    } else {
        console.log(`[initSession] Saving sessionReq, roomId=${roomId}, socketId=${socketId}, username=${username}`)
        await saveSessionRequest(roomId, socketId, username)
        res.isSessionReqExist = false
        console.log(`[initSession] SessionReq saved for socketId=${socketId}, roomId=${roomId}, username=${username}`)
    }
    release()
    return res
}

export async function getSessionId(socketId) {
    const userInfo = await getUser(socketId)
    if (userInfo != null) {
        return userInfo.sessionId
    } else {
        console.log(`[getSessionId] ERR: User does not exist for socketId=${socketId}`)
        return null
    }
}

export async function getMatchSocketId(socketId) {
    const userInfo = await getUser(socketId)
    if (userInfo == null) {
        console.log(`[getMatchSocketId] ERR: User does not exist for socketId=${socketId}`)
        return null
    }
    const sessionId = userInfo.sessionId
    const sessionInfo = await getSession(sessionId)
    if (sessionInfo == null) {
        console.log(`[getMatchSocketId] ERR: Session does not exist for sessionId=${sessionId}`)
        return null
    }
    const socketId1 = sessionInfo.socketId1
    const socketId2 = sessionInfo.socketId2
    if (socketId == socketId1) {
        return socketId2
    } else {
        return socketId1
    }
}

export async function getDifficultyLevelForUser(socketId) {
    const userInfo = await getUser(socketId)
    if (userInfo == null) {
        console.log(`[getMatchSocketId] ERR: User does not exist for socketId=${socketId}`)
        return null
    }
    const sessionInfo = await getSession(userInfo.sessionId)
    if (sessionInfo == null) {
        console.log(`[getMatchSocketId] ERR: Session does not exist for sessionId=${sessionId}`)
        return null
    }
    return sessionInfo.difficulty
}

export function generateSessionId(socketId1, socketId2) {
    return "CollaborationSession_" + socketId1 + "_" + socketId2
}