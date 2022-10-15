import express from 'express';
import { Server } from 'socket.io'
import cors from 'cors';
import { createServer } from 'http';
import { instrument } from '@socket.io/admin-ui'
<<<<<<< HEAD
import { handleCollaborationEvents } from './controller/collaboration-controller.js';
import { deleteSession, getSession, saveSession } from './model/repository.js';
=======
//import { handleCollaborationEvents } from './controller/collaboration-controller';
import { checkSessionExists, checkSessionReqExists, checkUserExists, deleteSession, deleteUser, getSession, getSessionRequest, getUser, saveSession, saveSessionRequest, saveUser } from './model/repository.js';
import { generateSessionId, getDifficultyLevelForUser, getMatchSocketId, getSessionId, initSession } from './model/collaboration-model.js';
import assert from 'assert';
import { handleCollaborationEvents } from './controller/collaboration-controller.js';
>>>>>>> origin/collab/backend

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from collaboration-service');
});

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
})

instrument(io, {
    auth: false
})

handleCollaborationEvents(io)
<<<<<<< HEAD
// await saveSession("room1", "xuanqi1", "xuanqi2", "tough")
// const res = await getSession("room1")
// console.log("Result from redis: ", res)
// deleteSession("room1")
=======

>>>>>>> origin/collab/backend
httpServer.listen(8002);

// // Test for session functionalities
// const SOCKETID1 = "xuanqi123243243"
// const SOCKETID2 = "xuanqi099999999"
// const ROOM_ID = "Room121112"
// const SESSION_ID = generateSessionId(SOCKETID2, SOCKETID1)
// const USERNAME1 = "xuanqi1"
// const USERNAME2 = "xuanqi2"
// const DIFFICULTY = "Easy"

// const delay = ms => new Promise(res => setTimeout(res, ms));

// const res1 = await initSession(SOCKETID1, ROOM_ID, USERNAME1, DIFFICULTY)
// console.log("SessionReq1=", res1)
// const res2 = await initSession(SOCKETID2, ROOM_ID, USERNAME2, DIFFICULTY)
// console.log("SessionReq2=", res2)

// // ===== SEND_CHANGES =====
// const sessionId1 = await getSessionId(SOCKETID1)
// const sessionId2 = await getSessionId(SOCKETID2)
// console.log(sessionId1)
// console.log(SESSION_ID)
// console.log("[sendChanges] assertion1=", myAssert(sessionId1, SESSION_ID))
// console.log("[sendChanges] assertion2=", myAssert(sessionId2, SESSION_ID))

// // ====== CHANGE_QN ====
// const sk1 = await getMatchSocketId(SOCKETID1)
// const sk2 = await getMatchSocketId(SOCKETID2)
// console.log("[changeQn] assertion1=", myAssert(sk1, SOCKETID2))
// console.log("[changeQn] assertion2=", myAssert(sk2, SOCKETID1))

// // ===== LEAVE ======
// const sid = await getSessionId(SOCKETID1)
// const sInfo = await getSession(sid)
// deleteUser(sInfo.socketId1)
// deleteUser(sInfo.socketId2)
// deleteSession(sid)

// const r1 = await checkUserExists(SOCKETID1)
// const r2 = await checkUserExists(SOCKETID2)
// const r3 = await checkSessionExists(SESSION_ID)
// console.log("[leave] assertion1=", myAssert(r1, false))
// console.log("[leave] assertion2=", myAssert(r2, false))
// console.log("[leave] assertion3=", myAssert(r3, false))

// await saveUser(SOCKETID1, SESSION_ID, USERNAME1)
// await saveUser(SOCKETID2, SESSION_ID, USERNAME2)
// await saveSession(SESSION_ID, SOCKETID1, SOCKETID2, DIFFICULTY)

// const sessionId1 = await getSessionId(SOCKETID1)
// const sessionId2 = await getSessionId(SOCKETID2)
// console.log(`SID1=${sessionId1}, SID2=${sessionId2}`)
// const matchID1 = await getMatchSocketId(SOCKETID1)
// const matchID2 = await getMatchSocketId(SOCKETID2)
// console.log(`MID1=${matchID1} expecting=${SOCKETID2}, MID2=${matchID2}`)
// const d1 = await getDifficultyLevelForUser(SOCKETID1)
// const d2 = await getDifficultyLevelForUser(SOCKETID2)
// console.log(`d1=${d1}, d2=${d2}`)
// await saveSession(SESSION_ID, SOCKETID1, SOCKETID2, DIFFICULTY)
// const sessionInfo = await getSession(SESSION_ID)
// console.log(sessionInfo)
// await deleteSession(SESSION_ID)
// const res = await checkSessionRExists(SESSION_ID) // shld return false
// console.log(res)
// const sessionInfo2 = await getSession(SESSION_ID)
// console.log(sessionInfo2==null)

// await saveUser(SOCKETID1, SESSION_ID, USERNAME1)
// const userInfo = await getUser(SOCKETID1)
// console.log(userInfo)
// console.log(`sessionId:${userInfo.sessionId}`)
// console.log(`username:${userInfo['username']}`)
// await deleteUser(SOCKETID1)
// const userInfoNull = await getUser(SOCKETID1)
// console.log(`Expected=null, Actual=${userInfoNull}`)

// function myAssert(a, b) {
//     if (a == b) {
//         return true
//     } else {
//         return false
//     }
// }