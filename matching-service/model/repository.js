import { Sequelize, DataTypes } from "sequelize";
import { createMatchModel } from "./match-model.js";
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
//const PendingMatch = createPendingMatchModel(sequelize);

await sequelize.sync({force: true}).then((result) => console.log("Database successfully initialized"));

export async function createMatch(username1, username2, difficulty) {
    const newMatch = await Match.create({
        username1: username1,
        username2: username2,
        difficulty: difficulty
    });
    return newMatch
}