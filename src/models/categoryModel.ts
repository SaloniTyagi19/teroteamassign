import { DataTypes } from "sequelize";

module.exports = model;

function model(sequelize: any) {
    const attributes = {
        category_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: { 
            type: DataTypes.STRING, 
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
    return sequelize.define('category', attributes, {timestamps: true});
}