import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  usertype: { type: String, required: true }, // 'user' or 'admin'
  password: { type: String, required: true },
  balance: { type: Number, default: 0 }
});

export const User = mongoose.model('users', userSchema);
