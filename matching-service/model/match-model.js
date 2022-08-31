import { DataTypes } from "sequelize";

export function createMatchModel(sequelize) {
    const Match = sequelize.define('Matches', {
        username1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        difficulty: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Match;
}