import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoute from './Routes/userRoute.js';
import stockRoute from './Routes/stockRoute.js';
import orderRoute from './Routes/orderRoute.js';
import transactionRoute from './Routes/transactionRoute.js';
import { startStockSimulation } from './controllers/stockController.js';

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Start stock price fluctuation loop
startStockSimulation();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/users', userRoute);
app.use('/api/stocks', stockRoute);
app.use('/api/orders', orderRoute);
app.use('/api/transactions', transactionRoute);

// Basic health check route
app.get('/', (req, res) => {
  res.send('SB Stocks REST API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
