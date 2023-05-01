import { DataTypes } from "sequelize";

module.exports = model;

function model(sequelize: any) {
    const attributes = {
        token_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        type: {
            type: DataTypes.ENUM('1','2','3','4'),
            allowNull: false 
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false 
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id',
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            default: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            default: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
    };
    return sequelize.define('token', attributes, {timestamps: true});
}