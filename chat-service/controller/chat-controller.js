import { getChatId, initChat } from "../model/chat-model.js"
import { checkChatExists, deleteChat, deleteUser, getChat } from "../model/repository.js"

export async function handleChatEvents(io) {
    io.on('connection', (socket) => {
        console.log("[socketIO] Connection established, socketId=", socket.id)

        socket.on('startChat', async (req) => {
            const roomId = req.roomId
            const username = req.username
            const res = await initChat(socket.id, roomId, username)
            if (res.isChatReqExist == true) {
                socket.join(res.chatId)
                io.sockets.sockets.get(res.matchSocketId).join(res.chatId)
                io.to(res.chatId).emit('chatCreated')
            }
        })

        socket.on('sendMessage', async (req) => {
            console.log(`[socketIO, sendMessage] socketId=${socket.id}`)
            console.log(req)
            const chatId = await getChatId(socket.id)
            console.log('chatId: ', chatId)
            io.to(chatId).emit('newMessage', req)
        })

        socket.on('leaveRoom', async () => {
            console.log(`[socketIO, leaveRoom] socketId=${socket.id} requesting to leave`)
            await chatTearDown(io, socket.id)
        })

        socket.on('disconnecting', async () => {
            console.log(`[socketIO, disconnecting] socketId=${socket.id} disconnecting`)
            await chatTearDown(io, socket.id)
        })

        socket.on('disconnect', () => {
            console.log(`[socketIO] socketId=${socket.id} disconnected`)
        })
    })
}

async function chatTearDown(io, socketId) {
    const chatId = await getChatId(socketId)
    if (chatId != null) {
        io.socketsLeave(chatId)
        const chatInfo = await getChat(chatId)
        await deleteUser(chatInfo.socketId1)
        await deleteUser(chatInfo.socketId2)
        await deleteChat(chatId)

        const isChatClosed = await verifyChatClosed(chatId, chatInfo.socketId1, chatInfo.socketId2)
        if (isSessinClosed == true) {
            console.log(`[chatTearDown] Chat closed successfully for sid=${chatId}`)
        } else {
            console.log(`[chatTearDown] ERR: Chat close failed for sid=${chatId}`)
        }
    } else {
        await deleteUser(socketId)
    }
}

async function verifyChatClosed(chatId, socketId1, socketId2) {
    const isChatExists = await checkChatExists(chatId)
    const isUser1Exists = await checkUserExists(socketId1)
    const isUser2Exists = await checkUserExists(socketId2)
    return !isChatExists && !isUser1Exists && !isUser2Exists
}