import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../utils/response';
import appError from '../../utils/appError';
import message from '../../utils/messages';
import constants from '../../config/constants';
import database from '../../utils/mysqlConnector';
import { Op } from 'sequelize';
import { getQueryOptions } from '../../utils/getQueryParams';
import fs from 'fs';

const checkName = async (name: String, categoryId: any) => {
    let lowername = name.toLowerCase();
    let category = await database.Items.findOne({ where: { name: lowername, category_refer: categoryId } })
    return category;
};
const appendBlob = (path: any) => {
    try {
        // read binary data from file
        const bitmap = fs.readFileSync(path);
        // convert the binary data to base64 encoded string
        return bitmap.toString('base64');
    } catch (err: any) {
        throw new appError(httpStatus.UNPROCESSABLE_ENTITY, 'Image error');
    }

};
const addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        process.env.insertData = "true"
        const itemAlready = await checkName(req.body.name.trim(), req.body.category);
        if (itemAlready) {
            throw new appError(httpStatus.UNPROCESSABLE_ENTITY, message.ITEM_ALREADY_PRESENT);
        }
        const file: any = req.file;
        let blob = '';
        if(file){
            blob = appendBlob(file.path);
            blob = `data:${file.mimetype};base64,${blob}`;
        }
        
        let lowername = req.body.name.trim().toLowerCase();
        let createItem = {
            name: lowername,
            category_refer: req.body.category,
            image_data: blob
        };
        const newItem: any = await database.Items.create(createItem);
        const response = { item: newItem };
        createResponse(res, httpStatus.CREATED, message.ITEM_CREATED, response);
        process.env.insertData = "false"
    } catch (error: any) {
        createResponse(res, httpStatus.CONFLICT, error.message, {});
        process.env.insertData = "false"
    }
}

const getItemList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { page, limit, sort, skip } = getQueryOptions(req.query);
        let searchFilter: any = {};
        var totalCount = 0;
        const searchFields = ["name", "category"];
        if (req.query.search) {
            searchFilter["[Op.or]"] = searchFields.map((field) => ({
                [field]: { [Op.like]: '%' + req.query.search + '%' },
            }));
        } else {
            searchFilter["[Op.or]"] = { ["name"]: { [Op.not]: '' } };
        }
        const itemList: any = await database.Items.findAll({
            where: {
                category_refer: {
                    [Op.eq]: req.params.categoryId
                },
                [Op.or]: searchFilter["[Op.or]"]
            },
            order: sort,
            offset: skip,
            limit: limit
        });
        totalCount = itemList.length;
        const item: any = { aggregate: itemList, totalCount: totalCount };
        if (totalCount != 0) {
            createResponse(res, httpStatus.OK, message.LIST.replace('#', item.totalCount), item.aggregate);
        } else {
            createResponse(res, httpStatus.OK, message.NO_MENU, {});
        }
    } catch (error: any) {
        createResponse(res, httpStatus.NOT_FOUND, error.message, {});
    }
}

export default {
    addItem,
    getItemList
}