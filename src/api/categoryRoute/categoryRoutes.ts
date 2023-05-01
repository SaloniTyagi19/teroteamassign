import express from 'express';
import validate from '../../middlewares/validate';
import menuValidation from './categoryValidation';
import menuController from './categoryDbServices';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/addCategory',auth('addCategory'), validate(menuValidation.addCategory), menuController.addCategory);
router.get('/getCategory',auth('getCategory'), validate(menuValidation.getCategoryList), menuController.getCategoryList);
router.get('/getCategoryId',auth('getCategory'), validate(menuValidation.getCategoryList), menuController.getCategoryIdList);
export = router;