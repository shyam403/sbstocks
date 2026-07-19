import express from 'express';
import { 
  getUserTransactions, 
  getAllTransactions 
} from '../controllers/transactionController.js';
import { protect, adminProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/user-transactions', protect, getUserTransactions);
router.get('/all-transactions', protect, adminProtect, getAllTransactions);

export default router;
