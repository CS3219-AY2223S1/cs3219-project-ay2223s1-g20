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
export async function removeMatch(matchID) {

}

// INPUT: username and difficulty level of current user
// DO: create new PendingMatch in database
export async function createPendingMatch(userID, username, difficulty) {

}

// INPUT: difficulty level
// DO: check if there exists an entry in PendingMatch table that has the input difficulty
export async function checkIsMatchAvailable(difficulty) {

}

// INPUT: difficulty level
// DO: return the pendingMatch entry where the difficulty level matches the input
export async function findPendingMatch(difficulty) {
    
}

// INPUT: username of the pendingMatch to be removed
// DO: remove the entry from PendingMatch table
export async function removePendingMatch(username) {

}

// INPUT: current user's username
// DO: check if the username exists in any row of the Match table
export async function checkIsMatched(username) {

}


// INPUT: matchID
// DO: check if the matchID exists for any entry of the Match table
export async function checkMatchExist(matchID) {

}