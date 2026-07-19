import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  type: { type: String, required: true }, // 'Deposit', 'Withdraw', etc.
  paymentMode: { type: String, required: true }, // 'net banking', 'IMPS', etc.
  amount: { type: Number, required: true },
  time: { type: String } // String timestamp as shown in screenshots
});

export const Transaction = mongoose.model('transactions', transactionSchema);
