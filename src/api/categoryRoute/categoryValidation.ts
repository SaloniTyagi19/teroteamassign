import Joi from "@hapi/joi";
import message from "../../utils/messages";
const addCategory = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'category name')
        })
    })
}

const getCategoryList = {
    query: Joi.object().keys({
        search: Joi.string(),
        sortBy: Joi.string(),
        page: Joi.string(),
        limit: Joi.string()
    })
}

export default {
    addCategory,
    getCategoryList
}