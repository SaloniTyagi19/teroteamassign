import * as dotenv from 'dotenv';
import path from 'path';
import Joi from '@hapi/joi';

dotenv.config({ path: path.join(__dirname, './../../.env') });

const envVarSchemas = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('productsion', 'development', 'test').required(),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access token expires'),
        JWT_RESET_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after reset token expires'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which access refresh token expires'),
        MY_SQL_DB_HOST: Joi.string().required().description('db host'),
        MY_SQL_DB_USER: Joi.string().required().description('db username'),
        MY_SQL_DB_PORT: Joi.number().required().description('db port').default(3306)
    })
    .unknown();
const { value: envVars, error } = envVarSchemas.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    console.log(error);
    throw new Error(`Config validation error: ${error.message}`)
}
export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_EXPIRATION_MINUTES,
    },
    database: {
        host: envVars.MY_SQL_DB_HOST,
        userName: envVars.MY_SQL_DB_USER,
        port: envVars.MY_SQL_DB_PORT,
        db: envVars.MY_SQL_DB_DATABASE
    },
};
