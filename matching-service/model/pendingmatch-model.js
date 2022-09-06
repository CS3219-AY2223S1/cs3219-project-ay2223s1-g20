import { DataTypes } from "sequelize";

export function createPendingMatchModel(sequelize) {
    const PendingMatch = sequelize.define('PendingMatches', {
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        difficulty: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return PendingMatch;
}