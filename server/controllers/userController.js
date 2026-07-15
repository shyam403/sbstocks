import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { Transaction } from '../models/transactionModel.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  const { username, email, usertype, password } = req.body;

  if (!username || !email || !usertype || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    usertype,
    password: hashedPassword,
    balance: 0 // Default starting balance is 0
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      usertype: user.usertype,
      balance: user.balance,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      usertype: user.usertype,
      balance: user.balance,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

// @desc    Get user data
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  res.status(200).json({
    _id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    usertype: req.user.usertype,
    balance: req.user.balance,
  });
};

// @desc    Deposit or withdraw funds from wallet
// @route   POST /api/users/wallet
// @access  Private
export const updateWallet = async (req, res) => {
  const { type, paymentMode, amount } = req.body;

  if (!type || !paymentMode || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid transaction parameters' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const numericAmount = Number(amount);

  if (type === 'Withdraw') {
    if (user.balance < numericAmount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    user.balance -= numericAmount;
  } else if (type === 'Deposit') {
    user.balance += numericAmount;
  } else {
    return res.status(400).json({ message: 'Invalid transaction type (must be Deposit or Withdraw)' });
  }

  await user.save();

  // Create Transaction record
  // Date format matches: Wed Aug 16 2023 02:16:34 GMT... or local string
  const dateStr = new Date().toString().split(' GMT')[0]; // Simple format: "Wed Jun 24 2026 12:15:30"
  
  await Transaction.create({
    user: user.id,
    type,
    paymentMode,
    amount: numericAmount,
    time: dateStr
  });

  res.status(200).json({
    message: `${type} successful`,
    balance: user.balance
  });
};

// @desc    Get all users (Admin only)
// @route   GET /api/users/all-users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
};
