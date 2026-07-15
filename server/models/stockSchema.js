import mongoose from 'mongoose';

const stocksSchema = new mongoose.Schema({
  user: { type: String }, // user ID who owns the stocks
  symbol: { type: String },
  name: { type: String },
  price: { type: Number }, // current price or average buy price
  count: { type: Number }, // number of shares
  totalPrice: { type: Number }, // price * count
  stockExchange: { type: String }
});

export const Stock = mongoose.model('stocks', stocksSchema);
