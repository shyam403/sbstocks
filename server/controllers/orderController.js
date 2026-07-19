import { User } from '../models/userModel.js';
import { Stock } from '../models/stockSchema.js';
import { Order } from '../models/orderSchema.js';
import { Transaction } from '../models/transactionModel.js';

// @desc    Create a new stock order (Buy / Sell)
// @route   POST /api/orders/create
// @access  Private
export const createOrder = async (req, res) => {
  const { symbol, name, price, count, stockType, orderType } = req.body;

  if (!symbol || !name || !price || !count || !stockType || !orderType) {
    return res.status(400).json({ message: 'All order fields are required' });
  }

  const userId = req.user.id;
  const numCount = Number(count);
  const numPrice = Number(price);
  
  if (numCount <= 0 || numPrice <= 0) {
    return res.status(400).json({ message: 'Count and Price must be positive values' });
  }

  const totalPrice = Number((numPrice * numCount).toFixed(2));

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dateStr = new Date().toString().split(' GMT')[0];

    // --- BUY ORDER LOGIC ---
    if (orderType === 'Buy') {
      if (user.balance < totalPrice) {
        return res.status(400).json({ message: 'Insufficient balance to complete purchase' });
      }

      // Deduct balance
      user.balance = Number((user.balance - totalPrice).toFixed(2));
      await user.save();

      // Update or create Stock holding
      let holding = await Stock.findOne({ user: userId, symbol });
      if (holding) {
        const totalShares = holding.count + numCount;
        const totalCost = holding.totalPrice + totalPrice;
        
        holding.count = totalShares;
        holding.price = Number((totalCost / totalShares).toFixed(2)); // New average price
        holding.totalPrice = Number(totalCost.toFixed(2));
        await holding.save();
      } else {
        await Stock.create({
          user: userId,
          symbol,
          name,
          price: numPrice,
          count: numCount,
          totalPrice,
          stockExchange: 'NASDAQ'
        });
      }

      // Log wallet transaction
      await Transaction.create({
        user: userId,
        type: 'Withdraw', // Buying a stock deducts cash from the wallet
        paymentMode: 'IMPS', // standard payment mode from screens
        amount: totalPrice,
        time: dateStr
      });

      // Log Order
      const newOrder = await Order.create({
        user: userId,
        symbol,
        name,
        price: numPrice,
        count: numCount,
        totalPrice,
        stockType,
        orderType,
        orderStatus: 'Completed'
      });

      return res.status(201).json({
        message: 'Buy order executed successfully',
        order: newOrder,
        balance: user.balance
      });
    }

    // --- SELL ORDER LOGIC ---
    if (orderType === 'Sell') {
      // Find user holdings for the stock
      const holding = await Stock.findOne({ user: userId, symbol });
      if (!holding || holding.count < numCount) {
        return res.status(400).json({ message: 'Insufficient stock holdings to complete sale' });
      }

      // Add to balance
      user.balance = Number((user.balance + totalPrice).toFixed(2));
      await user.save();

      // Update holdings
      if (holding.count === numCount) {
        // Sold all shares
        await Stock.deleteOne({ _id: holding._id });
      } else {
        // Partially sold
        holding.count -= numCount;
        holding.totalPrice = Number((holding.count * holding.price).toFixed(2));
        await holding.save();
      }

      // Log wallet transaction
      await Transaction.create({
        user: userId,
        type: 'Deposit', // Selling a stock deposits cash back into the wallet
        paymentMode: 'IMPS',
        amount: totalPrice,
        time: dateStr
      });

      // Log Order
      const newOrder = await Order.create({
        user: userId,
        symbol,
        name,
        price: numPrice,
        count: numCount,
        totalPrice,
        stockType,
        orderType,
        orderStatus: 'Completed'
      });

      return res.status(201).json({
        message: 'Sell order executed successfully',
        order: newOrder,
        balance: user.balance
      });
    }

    return res.status(400).json({ message: 'Invalid order type' });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error processing order' });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/user-orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all-orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// @desc    Get current user's portfolio holdings
// @route   GET /api/orders/holdings
// @access  Private
export const getUserHoldings = async (req, res) => {
  try {
    const holdings = await Stock.find({ user: req.user.id });
    res.status(200).json(holdings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching holdings' });
  }
};
