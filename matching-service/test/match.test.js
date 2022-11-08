import * as assert from 'assert'
import * as util from '../utils.js'
import * as db from '../model/repository.js'
import * as orm from '../model/match-orm.js'

after((done) => {
    db.clearAllTables()
    db.closeConnection()
    done()
})

const USERNAME1 = "username1"
const USERNAME2 = "username2"
const USERID1 = "userid1"
const USERID2 = "userid2"
const DIFFICULTY = "Easy"

describe("init", () => {
    it("Create Match: check is matched", () => {
        return db.createMatch(USERNAME1, USERNAME2, USERID1, USERID2, DIFFICULTY).then(() => {
            return db.checkIsMatched(USERNAME1).then((res) => {
                assert.equal(res, true)
            })
        })
    })

    it("remove match", async () => {
        const matchId = util.genMatchId(USERID1, USERID2, DIFFICULTY)
        await db.removeMatch(matchId)
        return db.checkIsMatched(USERNAME1).then((res) => {
            assert.equal(res, false)
        })
    })

    it("Create pending match: check is pending", () => {
        return db.createPendingMatch(USERID2, USERNAME2, DIFFICULTY).then(() => {
            return db.checkIsPending(USERNAME2).then((res) => {
                assert.equal(res, true)
            })
        })
    })

    it("remove pending", async () => {
        await db.removePendingMatch(USERID2)
        return db.checkIsPending(USERNAME2).then((res) => {
            console.log(res)
            assert.equal(res, false)
        })
    })
})

describe("test orm", () => {
    it("first user requests to match", () => {
        return orm.ormCreateMatch(USERNAME1, USERID1, DIFFICULTY).then(() => {
            return db.checkIsMatched(USERNAME1).then((res) => {
                assert.equal(res, false)
                return db.checkIsPending(USERNAME1).then((res) => {
                    assert.equal(res, true)
                })
            })
        })
    })
    it("second user requests to match", async () => {
        await orm.ormCreateMatch(USERNAME2, USERID2, DIFFICULTY)
        const isUser1Matched = await db.checkIsMatched(USERNAME1)
        const isUser2Matched = await db.checkIsMatched(USERNAME2)
        assert.equal(isUser1Matched, true)
        assert.equal(isUser2Matched, true)

        const isUser1Pending = await db.checkIsPending(USERNAME1)
        const isUser2Pending = await db.checkIsPending(USERNAME2)
        assert.equal(isUser1Pending, false)
        assert.equal(isUser2Pending, false)
    })

    it("close match", async () => {
        const matchId = util.genMatchId(USERID2, USERID1, DIFFICULTY)
        await orm.ormCloseMatch(matchId)
  
        const isUser1Matched = await db.checkIsMatched(USERNAME1)
        const isUser2Matched = await db.checkIsMatched(USERNAME2)
        assert.equal(isUser1Matched, false)
        assert.equal(isUser2Matched, false)
    })
})