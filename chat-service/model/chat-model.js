import {Mutex} from "async-mutex"
import { deleteChatRequest, getChat, getChatRequest, getUser, saveChat, saveChatRequest, saveUser } from "./repository.js"

const mutex = new Mutex()

export async function initChat(socketId, roomId, username) {
    const release = await mutex.acquire()
    var res = {}
    const chatReq = await getChatRequest(roomId)
    console.log("[initChat] chatReq=", chatReq)
    if (chatReq != null) {
        const chatId = generateChatId(socketId, chatReq.socketId)
        await saveUser(socketId, chatId, username)
        await saveUser(chatReq.socketId, chatId, chatReq.username)
        await saveChat(chatId, socketId, chatReq.socketId)
        await deleteChatRequest(roomId)
        res.matchSocketId = chatReq.socketId
        res.chatId = chatId
        res.isChatReqExist = true
    } else {
        await saveChatRequest(roomId, socketId, username)
        res.isChatReqExist = false
    }
    release()
    return res
}

export async function getChatId(socketId) {
    const userInfo = await getUser(socketId)
    if (userInfo != null) {
        return userInfo.chatId
    } else {
        console.log(`[getChatId] ERR: User does not exist for socketId=${socketId}`)
        return null
    }
}

export async function getMatchSocketId(socketId) {
    const userInfo = await getUser(socketId)
    if (userInfo == null) {
        console.log(`[getMatchSocketId] ERR: User does not exist for socketId=${socketId}`)
        return null
    }
    const chatId = userInfo.chatId
    const chatInfo = await getChat(chatId)
    if (chatInfo == null) {
        console.log(`[getMatchSocketId] ERR: Session does not exist for chatId=${chatId}`)
        return null
    }
    const socketId1 = chatInfo.socketId1
    const socketId2 = chatInfo.socketId2
    if (socketId == socketId1) {
        return socketId2
    } else {
        return socketId1
    }
}

export function generateChatId(socketId1, socketId2) {
    return "ChatId_" + socketId1 + "_" + socketId2
}