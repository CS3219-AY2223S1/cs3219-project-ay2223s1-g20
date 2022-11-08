import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
})
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => console.log('Redis connection established.'))
    .catch(() => console.log('Redis connection failed.'))
client.flushAll()

export async function saveSessionRequest(roomId, socketId, username) {
    await client.hSet(`RoomId:${roomId}`, {socketId, username})
}

export async function getSessionRequest(roomId) {
    const isSessionReqExist = await client.exists(`RoomId:${roomId}`)
    if (isSessionReqExist == 1) {
        return await client.hGetAll(`RoomId:${roomId}`)
    } else {
        return null
    }
}

export async function deleteSessionRequest(roomId) {
    await client.del(`RoomId:${roomId}`)
}

export async function checkSessionReqExists(roomId) {
    const res = await client.exists(`RoomId:${roomId}`)
    if (res == 1) {
        return true
    } else {
        return false
    }
}

export async function saveUser(socketId, sessionId, username) {
    await client.hSet(`SocketId:${socketId}`, {sessionId, username})
}

export async function getUser(socketId) {
    const isUserExist = await client.exists(`SocketId:${socketId}`)
    if (isUserExist == 1) {
        return await client.hGetAll(`SocketId:${socketId}`)
    } else {
        return null
    }
}

export async function deleteUser(socketId) {
    await client.del(`SocketId:${socketId}`)
}

export async function checkUserExists(socketId) {
    const res = await client.exists(`SocketId:${socketId}`)
    if (res == 1) {
        return true
    } else {
        return false
    }
}

export async function saveSession(sessionId, socketId1, socketId2, difficulty) {
    await client.hSet(sessionId, {socketId1, socketId2, difficulty})
}

export async function getSession(sessionId) {
    const isSessionExist = await client.exists(sessionId)
    if (isSessionExist == 1) {
        return await client.hGetAll(sessionId)
    } else {
        return null
    }  
}

export async function deleteSession(sessionId) {
    await client.del(sessionId)
}

export async function checkSessionExists(sessionId) {
    const res = await client.exists(sessionId)
    if (res == 1) {
        return true
    } else {
        return false
    }
}

export function clearCache() {
    client.flushAll().then(() => console.log('collaboration-service: redis cache cleared'))
}

export function closeCacheConnection() {
    client.quit().then(() => console.log('collaboration-service: redis connection closed'))
}