import { Transaction } from '../models/transactionModel.js';

// @desc    Get current user's wallet transaction history
// @route   GET /api/transactions/user-transactions
// @access  Private
export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ _id: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
};

// @desc    Get all wallet transactions (Admin only)
// @route   GET /api/transactions/all-transactions
// @access  Private/Admin
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ _id: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all transactions' });
  }
};
