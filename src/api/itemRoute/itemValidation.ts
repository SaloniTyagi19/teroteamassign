import Joi from "@hapi/joi";
import message from "../../utils/messages";
const addItem = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'item name')
        }),
        category: Joi.number().required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'category id')
        }),
        image_data: Joi.any()
    })
}

const getItemList = {
    query: Joi.object().keys({
        search: Joi.string(),
        sortBy: Joi.string(),
        page: Joi.string(),
        limit: Joi.string()
    }),
    params: Joi.object().keys({
        categoryId: Joi.string().required().messages({
            'string.empty': message.PROVIDE_INPUT.replace('#', 'category id')
        })
    }) 
}

export default {
    addItem,
    getItemList
}