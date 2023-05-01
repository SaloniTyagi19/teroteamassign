import { DataTypes } from "sequelize";

module.exports = model;

function model(sequelize: any) {
    const attributes = {
        item_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        image_data: {
            type: DataTypes.BLOB,
            allowNull: true
        },
        category_refer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'category_id',
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
    return sequelize.define('item', attributes, {timestamps: true});
}