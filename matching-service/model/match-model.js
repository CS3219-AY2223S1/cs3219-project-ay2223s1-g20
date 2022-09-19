import { DataTypes } from "sequelize";

export function createMatchModel(sequelize) {
    const Match = sequelize.define('Matches', {
        matchID: {
            type: DataTypes.STRING,
            allowNull: false,
            primarykey: true
        },
        username1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userID1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userID2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        difficulty: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    console.log("[Database] Match Model initialized");
    return Match;
}