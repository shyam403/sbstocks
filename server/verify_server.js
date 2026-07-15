import express from 'express';
import { User, Stock, Order, Transaction } from './Schemas.js';
import connectDB from './config/db.js';
import { startStockSimulation } from './controllers/stockController.js';

console.log('--- Verification Script Started ---');

// Test 1: Check imports & compilation
try {
  console.log('Testing model imports...');
  console.log('User Model:', !!User);
  console.log('Stock Model:', !!Stock);
  console.log('Order Model:', !!Order);
  console.log('Transaction Model:', !!Transaction);
  console.log('Model imports: SUCCESS ✅');
} catch (error) {
  console.error('Model imports failed: ❌', error.message);
  process.exit(1);
}

// Test 2: Check controllers
try {
  console.log('Testing stock simulator initialization...');
  startStockSimulation();
  console.log('Stock simulator test: SUCCESS ✅');
} catch (error) {
  console.error('Stock simulator test failed: ❌', error.message);
  process.exit(1);
}

console.log('--- Verification Script Completed: ALL COMPILATION TESTS PASSED ✅ ---');
process.exit(0);
