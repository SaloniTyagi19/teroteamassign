import { Sequelize } from "sequelize";
import config from "../config/config";
import mysql from "mysql2/promise";

let database: any = {};
initialize();
async function initialize() {
    try {
        // create db if it doesn't already exist
        const { host, userName, db, port } = config.database;
        const connection = await mysql.createPool({ 'host': host, 'port': port, 'user': userName });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db}\`;`);
        
        // connect to db
        const sequelize = new Sequelize(db, userName, '', { host: host, port: port, dialect: 'mysql' })

        // init models and add them to the exported db object
        database.Customers = require('../models/userModel')(sequelize);
        database.Tokens = require('../models/tokensModel')(sequelize);
        database.Categorys = require('../models/categoryModel')(sequelize);
        database.Items = require('../models/itemModel')(sequelize);

        // Use the foreign key in the db
        database.Tokens.belongsTo(database.Customers, {
            foreignKey: 'user',
            as: 'User_data'
        })

        database.Categorys.belongsTo(database.Customers, {
            foreignKey: 'user',
            as: 'User_data'
        })

        database.Items.belongsTo(database.Categorys, {
            foreignKey: 'category_refer',
            as: 'category_data'
        })

        // sync all models with database
        await sequelize.sync();
    } catch (err: any) {
        console.log('Error while connecting to db ', err.message);

    }
}
export default database;