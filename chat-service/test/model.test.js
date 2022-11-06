import * as assert from 'assert'
import * as db from '../model/repository.js'
import * as model from '../model/chat-model.js'

after((done) => {
    db.clearCache()
    db.closeCacheConnection()
    done()
})

const ROOM_ID = "ROOM_ID_1234567"
const SOCKET_ID_1 = "SOCKETID_1"
const SOCKET_ID_2 = "SOCKETID_2"
const USERNAME_1 = "USERNAME1"
const USERNAME_2 = "USERNAME2"
var CHAT_ID = "CHATID_1234567"

describe("init chat features", () => {
    
    it("single chat request", (done) => {
        model.initChat(SOCKET_ID_1, ROOM_ID, USERNAME_1).then(() => {
            db.getChatRequest(ROOM_ID).then((res) => {
                assert.equal(res.socketId, SOCKET_ID_1)
                assert.equal(res.username, USERNAME_1)
                done()
            })
        })
    })

    it("new chat: test chat saved", () => {
        return model.initChat(SOCKET_ID_2, ROOM_ID, USERNAME_2).then(() => {
            CHAT_ID = model.generateChatId(SOCKET_ID_2, SOCKET_ID_1)
            return db.getChat(CHAT_ID).then((res) => {
                assert.equal(res.socketId1, SOCKET_ID_2)
                assert.equal(res.socketId2, SOCKET_ID_1)
            })
        })
    })

    it("new chat: test user1 saved", () => {
        return db.getUser(SOCKET_ID_1).then((res) => {
            assert.equal(res.chatId, CHAT_ID)
            assert.equal(res.username, USERNAME_1)
        })
    })

    it("new chat: test user2 saved", () => {
        return db.getUser(SOCKET_ID_1).then((res) => {
            assert.equal(res.chatId, CHAT_ID)
            assert.equal(res.username, USERNAME_1)
        })
    })

    it("new chat: test getChatId", () => {
        return model.getChatId(SOCKET_ID_1).then((res) => {
            assert.equal(res, CHAT_ID)
        })
    })

    it("new chat: test getMatchSocketId", () => {
        return model.getMatchSocketId(SOCKET_ID_1).then((res) => {
            assert.equal(res, SOCKET_ID_2)
        })
    })

})