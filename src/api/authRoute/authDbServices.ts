import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../utils/response';
import appError from '../../utils/appError';
import message from '../../utils/messages';
import constants from '../../config/constants';
import bcrypt from 'bcryptjs';
import tokenService from '../../services/tokenService';
import database from '../../utils/mysqlConnector';
import { Op } from 'sequelize';

const checkPassword = async (password: any, correctPassword: any) => {
    const isPasswordMatch = await bcrypt.compare(password, correctPassword);
    if (!isPasswordMatch) {
        throw new appError(httpStatus.UNPROCESSABLE_ENTITY, message.INVALID_INPUT.replace('#', 'password'))
    }
}
const checkEmail = async (email: String, userRole: String) => {
    let lowerEmail = email.toLowerCase();
    let user = await database.Customers.findOne({ where: { email: lowerEmail, status: { [Op.ne]: constants.STATUS.DELETE }, userRole: userRole } })
    return user;
};
const checkNumber = async (mobileNumber: Number, userRole: String) => {
    let user = await database.Customers.findOne({ where: { mobileNumber: mobileNumber, status: { [Op.ne]: constants.STATUS.DELETE }, userRole: userRole } })
    if (user) {
        throw new appError(httpStatus.UNPROCESSABLE_ENTITY, message.MOBILE_ALREADY_PRESENT);
    }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        process.env.insertData = "true"
        const userRole = req.body.userRole ? req.body.userRole : 'User';
        const emailAlready = await checkEmail(req.body.email, userRole);
        if (emailAlready) {
            throw new appError(httpStatus.UNPROCESSABLE_ENTITY, message.EMAIL_ALREADY_PRESENT);
        }
        if (req.body.mobileNumber) {
            await checkNumber(req.body.mobileNumber, userRole)
        }
        let lowerEmail = req.body.email.toLowerCase();
        const passwordToken = await bcrypt.hash(req.body.password, 8)
        let createUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: lowerEmail,
            password: passwordToken,
            mobileNumber: req.body.mobileNumber ? req.body.mobileNumber : null,
            userRole: userRole,
            status: constants.STATUS.ACTIVE
        };
        const newUser: any = await database.Customers.create(createUser);
        const response = { user: newUser };
        createResponse(res, httpStatus.CREATED, message.USER_CREATED, response);
        process.env.insertData = "false"
    } catch (error: any) {
        createResponse(res, httpStatus.CONFLICT, error.message, {});
        process.env.insertData = "false"
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let newUser: any;
        let emailAlready = await checkEmail(req.body.email, req.body.userRole);
        if (emailAlready) {
            await checkPassword(req.body.password, emailAlready.password);
            newUser = emailAlready;
        } else {
            throw new appError(httpStatus.NOT_FOUND, message.INVALID_INPUT.replace('#', 'email'))
        }
        const tokens = await tokenService.generateAuthTokens(newUser.user_id, newUser.userRole);
        const response = { user: newUser, tokens };
        createResponse(res, httpStatus.OK, message.LOGIN, response);
    } catch (error: any) {
        createResponse(res, httpStatus.CONFLICT, error.message, {});
    }
}

export default {
    register,
    login
}