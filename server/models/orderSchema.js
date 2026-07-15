import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema({
  user: { type: String }, // user ID who placed the order
  symbol: { type: String },
  name: { type: String },
  price: { type: Number },
  count: { type: Number },
  totalPrice: { type: Number },
  stockType: { type: String }, // 'Intraday' or 'Delivery'
  orderType: { type: String }, // 'Buy' or 'Sell'
  orderStatus: { type: String } // 'Completed', 'Failed', etc.
});

export const Order = mongoose.model('orders', ordersSchema);
