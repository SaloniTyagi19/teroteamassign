import express from 'express';
import validate from '../../middlewares/validate';
import menuValidation from './itemValidation';
import menuController from './itemDbServices';
import auth from '../../middlewares/auth';
import multer  from 'multer';
  
const router = express.Router();

const storage = multer.diskStorage({  
    destination: process.env.localPath, 
      filename: (req:any, file: any, cb: any) => {
          cb(null, file.originalname)
    }
  });
  const upload = multer({ 
    storage: storage
  });

// router.post('/addItem',auth('addMenu'), validate(menuValidation.addItem), menuController.addItem);
router.post('/addItem',auth('addMenu'),upload.single('file'),validate(menuValidation.addItem), menuController.addItem);
router.get('/getMenu/:categoryId',auth('getMenu'), validate(menuValidation.getItemList), menuController.getItemList);
export = router;