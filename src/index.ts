import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from '../src/routes/indexRoutes';
import logger from './config/logger';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from '../src/utils/mysqlConnector';
import * as cronJobData from '../src/utils/mysqltoMongodb';
import cron from 'node-cron';

const router: Express = express();

// Logging
router.use(morgan('dev'));

// Parse the request
router.use(bodyParser.urlencoded({ limit: '1024mb', extended: false }));

// Json Data processing
router.use(express.json());

// Multi platform
router.use(cors());

// Routing
router.use('/', routes);

// Error Handling
router.use((req, res, next) => {
    const error = new Error("Not found");
    return res.status(404).json({
        message: error.message
    });
});


// Server
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT || 4000;
let server: any = httpServer.listen(PORT, () => {
    console.log(`Connected to host at port ${PORT}`);
});

// Schedule tasks to be run on the server.
cron.schedule('*/1 * * * *', function () {
    if(process.env.insertData === "false"){
        cronJobData.getData();
    }else{
        console.log('Data insertion going on try again')
    }
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info("Server closed successfully");
        });
    }
    process.exit(1);
};

const unExpectedErrorHandler = (error: any) => {
    logger.error(error);
    exitHandler();
}
process.on('uncaughtException', unExpectedErrorHandler);
process.on('unhandledRejection', unExpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
