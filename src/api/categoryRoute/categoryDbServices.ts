import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../utils/response';
import appError from '../../utils/appError';
import message from '../../utils/messages';
import constants from '../../config/constants';
import database from '../../utils/mysqlConnector';
import { Op } from 'sequelize';
import { getQueryOptions } from '../../utils/getQueryParams';

const checkName = async (name: String, userId: any) => {
    let lowername = name.toLowerCase();
    let category = await database.Categorys.findOne({ where: { name: lowername } })
    return category;
};

const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        process.env.insertData = "true";
        const user: any = req.user
        const userId = user.user
        const categoryAlready = await checkName(req.body.name.trim(), userId);
        if (categoryAlready) {
            throw new appError(httpStatus.UNPROCESSABLE_ENTITY, message.CATEGORY_ALREADY_PRESENT);
        }
        let lowername = req.body.name.trim().toLowerCase();
        let createCategory = {
            name: lowername,
            user: userId
        };
        const newCategory: any = await database.Categorys.create(createCategory);
        const response = { category: newCategory };
        createResponse(res, httpStatus.CREATED, message.CATEGORY_CREATED, response);
        process.env.insertData = "false"
    } catch (error: any) {
        createResponse(res, httpStatus.CONFLICT, error.message, {});
        process.env.insertData = "false"
    }
}

const getCategoryList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { page, limit, sort, skip } = getQueryOptions(req.query);
        let searchFilter: any = {};
        var totalCount = 0;
        const searchFields = ["name"];
        if (req.query.search) {
            searchFilter["[Op.or]"] = searchFields.map((field) => ({
                [field]: { [Op.like]: '%' + req.query.search + '%' },
            }));
        } else {
            searchFilter["[Op.or]"] = { ["name"]: { [Op.not]: '' } };
        }
        const categoryList: any = await database.Categorys.findAll({
            where: {
                [Op.or]: searchFilter["[Op.or]"]
            },
            order: sort,
            offset: skip,
            limit: limit
        });
        totalCount = categoryList.length;
        const category: any = { aggregate: categoryList, totalCount: totalCount };
        if (totalCount != 0) {
            createResponse(res, httpStatus.OK, message.LIST.replace('#', category.totalCount), category.aggregate);
        } else {
            createResponse(res, httpStatus.OK, message.NO_CATEGORY, {});
        }
    } catch (error: any) {
        createResponse(res, httpStatus.NOT_FOUND, error.message, {});
    }
}

const getCategoryIdList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const userId = user.user;
        let { page, limit, sort, skip } = getQueryOptions(req.query);
        let searchFilter: any = {};
        var totalCount = 0;
        const searchFields = ["name"];
        if (req.query.search) {
            searchFilter["[Op.or]"] = searchFields.map((field) => ({
                [field]: { [Op.like]: '%' + req.query.search + '%' },
            }));
        } else {
            searchFilter["[Op.or]"] = { ["name"]: { [Op.not]: '' } };
        }
        const categoryList: any = await database.Categorys.findAll({
            where: {
                user: {
                    [Op.eq]: userId
                },
                [Op.or]: searchFilter["[Op.or]"]
            },
            order: sort,
            offset: skip,
            limit: limit
        });
        totalCount = categoryList.length;
        const category: any = { aggregate: categoryList, totalCount: totalCount };
        if (totalCount != 0) {
            createResponse(res, httpStatus.OK, message.LIST.replace('#', category.totalCount), category.aggregate);
        } else {
            createResponse(res, httpStatus.OK, message.NO_CATEGORY, {});
        }
    } catch (error: any) {
        createResponse(res, httpStatus.NOT_FOUND, error.message, {});
    }
}
export default {
    addCategory,
    getCategoryList,
    getCategoryIdList
}