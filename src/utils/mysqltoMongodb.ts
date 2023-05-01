import mongoose, { Schema } from "mongoose";
import database from '../utils/mysqlConnector';
export async function getData() {
    try {
        await mongoose.connect(`${process.env.MY_MONGODB_URL}`).then(async () => {
            console.log('Connected to mongodb');
            mongoose.set('debug', true);
            const getUsersData = await database.Customers.findAll({});
            const gettokenData = await database.Tokens.findAll({});
            const getcateoryData = await database.Categorys.findAll({});
            const getMenuItems = await database.Items.findAll({});

            const usersListSql = { aggregate: getUsersData, totalCount: getUsersData.length }
            const tokenListSql = { aggregate: gettokenData, totalCount: gettokenData.length }
            const categoryListSql = { aggregate: getcateoryData, totalCount: getcateoryData.length }
            const menuListSql = { aggregate: getMenuItems, totalCount: getMenuItems.length }

            if (usersListSql.totalCount > 0) {
                var dynamicSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false });
                const modelUser = mongoose.model('user', dynamicSchema);
                const data = usersListSql.aggregate.map((item: any) => item.dataValues);
                const dataFound = await modelUser.findOne({});
                if(dataFound) {
                    await mongoose.connection.db.dropCollection('users');
                }
                await modelUser.insertMany(data);
            }
            if (tokenListSql.totalCount > 0) {
                var dynamicSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false });
                const modelUser = mongoose.model('token', dynamicSchema);
                const data = tokenListSql.aggregate.map((item: any) => item.dataValues);
                const dataFound = await modelUser.findOne({});
                if(dataFound) {
                    await mongoose.connection.db.dropCollection('tokens');
                }
                await modelUser.insertMany(data);
            }
            if (categoryListSql.totalCount > 0) {
                var dynamicSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false });
                const modelUser = mongoose.model('category', dynamicSchema);
                const data = categoryListSql.aggregate.map((item: any) => item.dataValues);
                const dataFound = await modelUser.findOne({});
                if(dataFound) {
                    await mongoose.connection.db.dropCollection('categories');
                }
                await modelUser.insertMany(data);
            }
            if (menuListSql.totalCount > 0) {
                var dynamicSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false });
                const modelUser = mongoose.model('menu', dynamicSchema);
                const data = menuListSql.aggregate.map((item: any) => item.dataValues);
                const dataFound = await modelUser.findOne({});
                if(dataFound) {
                    await mongoose.connection.db.dropCollection('menus');
                }
                await modelUser.insertMany(data);
            }
            mongoose.disconnect().then((data) => {
                console.log('Data synced')
            });
        });

    } catch (Err: any) {
        console.log("Err ", Err.message)
    }
};