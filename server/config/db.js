import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Using URI:', process.env.MONGO_URI);

    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sb-stocks'
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Error:', error);
    process.exit(1);
  }
};

export default connectDB;