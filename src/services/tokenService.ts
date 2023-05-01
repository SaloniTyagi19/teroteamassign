import moment from "moment";
import jwt from "jsonwebtoken";
import constants from "./../config/constants"
import config from './../config/config';
import database from "../utils/mysqlConnector";
import AppError from '../utils/appError';
import httpStatus from 'http-status';
const generateToken = (user: any, role: any, expires: { unix: () => any; }, secret = config.jwt.secret) => {
    const payload = {
        sub: { user, role },
        iat: moment().unix(),
        exp: expires.unix()
    };
    return jwt.sign(payload, secret);
};
const saveToken = async (token: any, userId: any, expires: moment.Moment, type: any, blacklisted = false) => {
    const alreadyToken = await database.Tokens.findOne({ where: { user: userId, type: type } })
    if(alreadyToken){
        await alreadyToken.destroy();
    }
    const tokenDoc = await database.Tokens.create({
        token: token,
        user: userId,
        expiresAt: expires.toDate(),
        type: type,
    })
    return tokenDoc;
};
const generateAuthTokens = async (userId: any, role: any) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(userId, role, accessTokenExpires);
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(userId, role, refreshTokenExpires);
    await saveToken(refreshToken, userId, refreshTokenExpires, constants.TOKEN_TYPE.REFRESH_TOKEN);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};


const refreshVerifyToken = async (token: any, type: any) => {
    const payload: any = jwt.verify(token, config.jwt.secret);
    const tokenDoc: any = await database.Tokens.findOne({ where: { token, type, user: payload.sub.user } });
    if (!tokenDoc) {
        throw new AppError(httpStatus.NOT_FOUND, 'The link has been expired!');
    }
    return payload;
};
export default {
    generateAuthTokens,
    refreshVerifyToken
}