import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  getUserHoldings 
} from '../controllers/orderController.js';
import { protect, adminProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createOrder);
router.get('/user-orders', protect, getUserOrders);
router.get('/all-orders', protect, adminProtect, getAllOrders);
router.get('/holdings', protect, getUserHoldings);

export default router;
