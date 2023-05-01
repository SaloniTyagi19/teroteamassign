import express from 'express';
import authRoutes from '../api/authRoute/authRoutes';
import categoryRoutes from '../api/categoryRoute/categoryRoutes';
import itemRoutes from '../api/itemRoute/itemRoutes'; 
const router = express.Router();
router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/menuItem', itemRoutes);
export = router;