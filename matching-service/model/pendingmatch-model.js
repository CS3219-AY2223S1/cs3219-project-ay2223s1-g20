import { DataTypes } from "sequelize";

export function createPendingMatchModel(sequelize) {
    const PendingMatch = sequelize.define('PendingMatches', {
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        difficulty: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    console.log("SUCCESS: PendingMatch Model initialized");
    return PendingMatch;
}