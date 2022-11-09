import * as assert from 'assert'
import * as db from '../model/repository.js'
import * as model from '../model/collaboration-model.js'

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
const DIFFICULTY = "Medium"

describe("Testing session features", () => {
    
    it("Init Session by user1", () => {
        return model.initSession(SOCKET_ID_1, ROOM_ID, USERNAME_1, DIFFICULTY).then(() => {
            return db.checkSessionReqExists(ROOM_ID).then((res) => {
                assert.equal(res, true)
            })
        })
    })

    it("Init Session by user2 -> session created", () => {
        return model.initSession(SOCKET_ID_2, ROOM_ID, USERNAME_2, DIFFICULTY).then(() => {
            const SESSION_ID = model.generateSessionId(SOCKET_ID_2, SOCKET_ID_1)
            return db.checkSessionExists(SESSION_ID).then((res) => {
                assert.equal(res, true)
            })
        })
    })

    it("Session created: check relevant data stored correctly", async () => {
        const SESSION_ID = model.generateSessionId(SOCKET_ID_2, SOCKET_ID_1)

        const isUser1Exist = await db.checkUserExists(SOCKET_ID_1)
        const isUser2Exist = await db.checkUserExists(SOCKET_ID_2)
        assert.equal(isUser1Exist, true)
        assert.equal(isUser2Exist, true)

        const isSessionReqExist = await db.checkSessionReqExists(ROOM_ID)
        assert.equal(isSessionReqExist, false)

        const matchSocketIdOfUser1 = await model.getMatchSocketId(SOCKET_ID_1)
        const matchSocketIdOfUser2 = await model.getMatchSocketId(SOCKET_ID_2)
        assert.equal(matchSocketIdOfUser1, SOCKET_ID_2)
        assert.equal(matchSocketIdOfUser2, SOCKET_ID_1)

        const sessionIdOfUser = await model.getSessionId(SOCKET_ID_1)
        assert.equal(sessionIdOfUser, SESSION_ID)

        const difficultyLvOfUser = await model.getDifficultyLevelForUser(SOCKET_ID_2)
        assert.equal(difficultyLvOfUser, DIFFICULTY)
    })

})