import { checkSessionReqExists, popSessionRequest, saveSession, saveSessionRequest, saveUser } from "./repository";

export async function initSession(socketId, roomId, username, difficulty) {
    var res = {}
    const isSessionReqExist = await checkSessionReqExists(roomId)
    if (isSessionReqExist == true) {
        const sessionReq = await popSessionRequest(roomId)
        const sessionId = generateSessionId()
        await saveUser(socketId, sessionId, username)
        await saveUser(sessionReq.socketId, sessionId, sessionReq.username)
        await saveSession(sessionId, username, sessionReq.username, difficulty)
        res.matchSocketId = sessionReq.socketId
        res.sessionId = sessionId
    } else {
        await saveSessionRequest(socketId, roomId, username)
    }
    res.isSessionReqExist = isSessionReqExist
    return res
}

export async function getSessionId(socketId) {

}

function startSession(roomId)

function generateSessionId() {
    return "DUMMY_ID"
}