import { DataTypes } from "sequelize";

module.exports = model;

function model(sequelize: any) {
    const attributes = {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        lastName: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        email: {
            type: DataTypes.STRING, 
            allowNull: false 
        },
        password: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        mobileNumber: {
            type: DataTypes.BIGINT,
            allowNull: true,
            unique: true,
            validate: { len: 10 }
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
        },
        status: {
            type: DataTypes.ENUM('Active', 'Delete'),
            default: 'Active',
            allowNull: true,
        },
        userRole: {
            type: DataTypes.ENUM('User', 'Admin'),
            default: 'User',
            allowNull: true,
        }
    };
    return sequelize.define('users', attributes, {timestamps: true});
}