import Joi from "@hapi/joi";
import message from "../../utils/messages";
const register = {
    body: Joi.object().keys({
        firstName: Joi.string().required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'first name')
        }),
        lastName: Joi.string().required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'last name')
        }),
        email: Joi.string().email().required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'email'),
            'string.email': message.INVALID_INPUT.replace('#', 'email')
        }),
        password: Joi.string().min(8).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'password'),
            'string.min': message.MINIMUM.replace('#', '8'),
            'string.pattern.base': message.PASSWORD_REGEX
        }),
        mobileNumber: Joi.number().max(9999999999).messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'mobile number'),
            'string.max': message.PROVIDE_INPUT.replace('#', 'mobile number'),
        }),
        userRole: Joi.string().valid('User', 'Admin').messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'role')
        })
    })
}

const login = {
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'email'),
            'string.email': message.INVALID_INPUT.replace('#', 'email')
        }),
        password: Joi.string().min(8).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'password'),
            'string.min': message.MINIMUM.replace('#', '8'),
            'string.pattern.base': message.PASSWORD_REGEX
        }),
        userRole: Joi.string().required().valid('User', 'Admin').messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'role')
        })
    })
}

export default {
    register,
    login
}