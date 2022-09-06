import { Sequelize, DataTypes } from "sequelize";
import { createMatchModel } from "./match-model.js";
import { genMatchId } from "../utils.js";
import { createPendingMatchModel } from "./pendingmatch-model.js";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to sequelize:', error);
}

const Match = createMatchModel(sequelize);
const PendingMatch = createPendingMatchModel(sequelize);

await sequelize.sync({force: true}).then((result) => console.log("Database successfully initialized"));

export async function createMatch(username1, username2, userID1, userID2, difficulty) {
    const newMatch = await Match.create({
        matchID: genMatchId(userID1, userID2, difficulty),
        username1: username1,
        username2: username2,
        userID1: userID1,
        userID2: userID2,
        difficulty: difficulty
    });
    return newMatch
}

// INPUT: matchID of a match (aka roomID for socket)
// DO: remove target match from db
// OUTPUT: return true if removed successfully, false otherwise
export async function removeMatch(matchID) {

}

// INPUT: username and difficulty level of current user
// DO: create new PendingMatch in database
// OUTPUT: the pendingMatch object being created
export async function createPendingMatch(userID, username, difficulty) {

}

// INPUT: difficulty level
// DO: return a pendingMatch with the same difficulty level as the input
// OUTPUT: a pendingMatch instance, return null if such a match does not exist
export async function findPendingMatch(difficulty) {
    
}

// INPUT: username of the pendingMatch to be removed
// DO: remove the entry from PendingMatch table
// OUTPUT: return true if removed successfully, false otherwise
export async function removePendingMatch(username) {

}

// INPUT: current user's username
// DO: check if the username exists in any row of the Match table
// OUTPUT: boolen
export async function checkIsMatched(username) {

}

// INPUT: current user's username
// DO: check if the username exists in any row of the PendingMatch table
// OUTPUT: boolean
export async function checkIsPending(username) {

}