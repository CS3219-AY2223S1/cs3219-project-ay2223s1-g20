import { createClient } from 'redis';

const client = createClient()
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => console.log('Redis connection established.'))
    .catch(() => console.log('Redis connection failed.'))

export async function saveSessionRequest(socketId, roomId, username) {
    await client.hSet(`RoomId:${roomId}`, {socketId, username})
}

export async function checkSessionReqExists(roomId) {
    return await client.exists(`RoomId:${roomId}`)
}

export async function popSessionRequest(roomId) {
    const sessionReq = await client.hGetAll(`RoomId:${roomId}`)
    await client.del(`RoomId:${roomId}`)
    return sessionReq
}

export async function saveUser(socketId, sessionId, username) {
    await client.hSet(`SocketId:${socketId}`, {sessionId, username})
}

export async function getUser(socketId) {
    return await client.hGetAll(`SocketId:${socketId}`)
}

export async function deleteUser(socketId) {
    await client.del(`SocketId:${socketId}`)
}

export async function saveSession(sessionId, socketId1, socketId2, difficulty) {
    await client.hSet(sessionId, {socketId1, socketId2, difficulty})
}

export async function getSession(sessionId) {
    return await client.hGetAll(sessionId)
}

export async function deleteSession(sessionId) {
    await client.del(sessionId)
}