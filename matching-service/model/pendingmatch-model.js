import { DataTypes } from "sequelize";

export function createPendingMatchModel(sequelize) {
    const PendingMatch = sequelize.define('PendingMatches', {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        difficulty: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return PendingMatch;
}