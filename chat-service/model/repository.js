import { createClient } from 'redis';

// online redis server
const client = createClient({
    url: 'redis://localhost:6379'
})
client.on('error', (err) => console.log('chat-service: redis client error', err));
client.connect().then(() => console.log('chat-service: redis connection established'))
    .catch(() => console.log('chat-service: redis connection failed'))
client.flushAll()

export async function saveChatRequest(roomId, socketId, username) {
    await client.hSet(`RoomId:${roomId}`, {socketId, username})
}

export async function getChatRequest(roomId) {
    const isChatReqExist = await client.exists(`RoomId:${roomId}`)
    if (isChatReqExist == 1) {
        return await client.hGetAll(`RoomId:${roomId}`)
    } else {
        return null
    }
}

export async function deleteChatRequest(roomId) {
    await client.del(`RoomId:${roomId}`)
}

export async function checkChatReqExists(roomId) {
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

export async function saveChat(chatId, socketId1, socketId2) {
    await client.hSet(chatId, {socketId1, socketId2})
}

export async function getChat(chatId) {
    const isChatExist = await client.exists(chatId)
    if (isChatExist == 1) {
        return await client.hGetAll(chatId)
    } else {
        return null
    }  
}

export async function deleteChat(chatId) {
    await client.del(chatId)
}

export async function checkChatExists(chatId) {
    const res = await client.exists(chatId)
    if (res == 1) {
        return true
    } else {
        return false
    }
}