const express = require('express');
const router = express.Router();
const financeController = require('../financeController');
const { auth } = require('../back'); // Import auth middleware from back.js

// Apply auth middleware to all routes
router.use(auth);

// Get financial summary (balance, income, expenses, budget)
router.get('/summary', financeController.getFinancialSummary);

// Add a new transaction
router.post('/transactions', financeController.addTransaction);

// Get recent transactions
router.get('/transactions/recent', financeController.getRecentTransactions);

// Update budget
router.put('/budget', financeController.updateBudget);

module.exports = router;
