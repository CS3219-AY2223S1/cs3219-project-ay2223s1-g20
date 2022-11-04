import { Sequelize } from "sequelize";
import { createMatchModel } from "./match-model.js";
import { genMatchId } from "../utils.js";
import { createPendingMatchModel } from "./pendingmatch-model.js";
import { Op } from "sequelize";

const sequelize = new Sequelize('sqlite::memory:');

try {
    await sequelize.authenticate();
    console.log('[Database] Sequelize connection has been established successfully.');
} catch (error) {
    console.error('[Database] Unable to connect to sequelize:', error);
}

const Match = createMatchModel(sequelize);
const PendingMatch = createPendingMatchModel(sequelize);

await sequelize.sync({force: true}).then((result) => console.log("[Database] Database successfully initialized"));

export async function createMatch(username1, username2, userID1, userID2, difficulty) {
    var newMatch;
    try {
        newMatch = await Match.create({
            matchID: genMatchId(userID1, userID2, difficulty),
            username1: username1,
            username2: username2,
            userID1: userID1,
            userID2: userID2,
            difficulty: difficulty
        });
    } catch (err) {
        console.log(`[createMatch] Create match failed for username1=${username1}, username2=${username2}, err=`, err)
    } finally {
        return newMatch;
    }
}

// INPUT: matchID of a match (aka roomID for socket)
// DO: remove target match from db
// OUTPUT: return true if removed successfully, false otherwise
export function removeMatch(matchID) {
    try {
        Match.destroy({
            where: { matchID: matchID }
        });
    } catch (err) {
        console.log(`[removeMatch] Removal failed for matchID=${matchID}, err=`, err);
    }
}

// INPUT: username and difficulty level of current user
// DO: create new PendingMatch in database
// OUTPUT: the pendingMatch object being created
export async function createPendingMatch(userID, username, difficulty) {
    var newPendingMatch;
    try {
        newPendingMatch = await PendingMatch.create({
            userID: userID,
            username: username,
            difficulty: difficulty
        });
    } catch (err) {
        console.log(`[createPendingMatch] Create pending match failed for username=${username}, err=`, err);
    }
    return newPendingMatch;
}

// INPUT: difficulty level
// DO: return a pendingMatch with the same difficulty level as the input
// OUTPUT: a pendingMatch instance, return null if such a match does not exist
export async function findPendingMatch(difficulty) {
    const pendingMatch = await PendingMatch.findOne({where: {difficulty: difficulty}});
    return pendingMatch;
}

// INPUT: username of the pendingMatch to be removed
// DO: remove the entry from PendingMatch table
// OUTPUT: return true if removed successfully, false otherwise
export async function removePendingMatch(userID) {
    await PendingMatch.destroy({
        where: { userID: userID }
    });
    return;
}

// INPUT: current user's username
// DO: check if the username exists in any row of the Match table
// OUTPUT: boolen
export async function checkIsMatched(username) {
    const match = await Match.findAll({
        where: {
            [Op.or]: [
                { username1: username },
                { username2: username }
            ]
        }
    });
    if (match.length == 0) {
        return false;
    } else {
        return true;
    }
}
// INPUT: current user's username
// DO: check if the username exists in any row of the PendingMatch table
// OUTPUT: boolean
export async function checkIsPending(username) {
    const pendingMatch = await PendingMatch.findOne({where: {username: username}});
    if (pendingMatch == null) {
        return false;
    } else {
        return true;
    }
}

export async function findMatchFromUserID(userID) {
    const match = await Match.findOne({
        where: {
            [Op.or]: [
                { userID1: userID },
                { userID2: userID }
            ]
        }
    });
    return match;
}

export async function clearAllTables() {
    await Match.destroy({
        where: {},
        truncate: true
    })
    await PendingMatch.destroy({
        where: {},
        truncate: true
    })
}

export async function closeConnection() {
    sequelize.close()
}