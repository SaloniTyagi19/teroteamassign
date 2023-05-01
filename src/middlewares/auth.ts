import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import httpStatus from "http-status";
import { roleRights } from "../config/roles";
import createResponse from "../utils/response";
import message from "../utils/messages";

const auth = (...requiredRights: any) => async (req: any, res: any, next: any) => {
    try {
        const secretKey: string = "1ba_pmpV(2T|$%921";
        const token: any = req.header('Authorization');
        if (!token) {
            createResponse(res, httpStatus.UNAUTHORIZED, "Please authenticate", {});
        } else {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded.sub;
            if (requiredRights.length) {
                const userRights = roleRights.get(req.user?.role);
                if (userRights) {
                    const hasRequiredRights = requiredRights.every((requiredRight: any) => userRights.includes(requiredRight));
                    if (hasRequiredRights === false) {
                        createResponse(res, httpStatus.FORBIDDEN, message.UNAUTHORIZED_ACTION, {});
                    } else{
                        next()
                    }
                }
                else {
                    createResponse(res, httpStatus.FORBIDDEN, message.UNAUTHORIZED_ACTION, {});
                }
            } else {

                next()
            }
        }
    } catch (error) {
        createResponse(res, httpStatus.UNAUTHORIZED, "Please authenticate", {});
    }
};
export default auth
