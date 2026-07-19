import express from 'express';
import { 
  getTrendingStocks, 
  getStocksList, 
  getStockChart 
} from '../controllers/stockController.js';

const router = express.Router();

router.get('/trending', getTrendingStocks);
router.get('/list', getStocksList);
router.get('/chart/:symbol', getStockChart);

export default router;
