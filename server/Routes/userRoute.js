import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateWallet, 
  getAllUsers 
} from '../controllers/userController.js';
import { protect, adminProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/wallet', protect, updateWallet);
router.get('/all-users', protect, adminProtect, getAllUsers);

export default router;
