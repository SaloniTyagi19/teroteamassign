import express from 'express';
import validate from '../../middlewares/validate';
import authValidation from './authValidation';
import authController from './authDbServices';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
export = router;