const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');
const mongoose = require('mongoose');

// Get user's financial summary
exports.getFinancialSummary = async (req, res) => {
    try {
        console.log('📊 GET FINANCIAL SUMMARY REQUEST:', {
            user: req.user?.email,
            userId: req.user?._id
        });

        const userId = req.user._id; // Assuming you have user info in req.user from auth middleware

        if (!userId) {
            console.error('❌ No user ID found in financial summary request');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Get transactions for the current month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        console.log('🔍 Searching for transactions...');
        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: firstDayOfMonth }
        });

        console.log(`📈 Found ${transactions.length} transactions for current month`);

        // Calculate financial metrics
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = totalIncome - totalExpenses;

        console.log('💰 Calculated totals:', { totalIncome, totalExpenses, currentBalance });

        // Get or create budget for the current month
        let budget = await Budget.findOne({
            user: userId,
            month: currentDate.getMonth(),
            year: currentDate.getFullYear()
        });

        if (!budget) {
            console.log('📋 Creating new budget for current month');
            // Create a default budget if none exists
            budget = new Budget({
                user: userId,
                month: currentDate.getMonth(),
                year: currentDate.getFullYear(),
                total: 0,
                categories: [
                    { name: 'Savings', amount: 0, color: '#10B981' },
                    { name: 'Expenses', amount: 0, color: '#6366F1' },
                    { name: 'Left in budget', amount: 0, color: '#F59E0B' }
                ]
            });
            await budget.save();
            console.log('✅ Budget created successfully');
        } else {
            console.log('📋 Found existing budget');
        }

        // Calculate monthly data for the chart (last 6 months)
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);

            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthTransactions = await Transaction.find({
                user: userId,
                date: { $gte: monthStart, $lte: monthEnd }
            });

            const monthIncome = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const monthExpenses = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            monthlyData.push({
                month: date.toLocaleString('default', { month: 'short' }),
                value: monthIncome - monthExpenses
            });
        }

        console.log('📊 Monthly data calculated:', monthlyData);

        // Update budget breakdown
        const savings = Math.max(0, currentBalance * 0.4); // 40% of current balance as savings
        const leftInBudget = Math.max(0, budget.total - totalExpenses);

        budget.categories = [
            { name: 'Savings', amount: savings, color: '#10B981' },
            { name: 'Expenses', amount: totalExpenses, color: '#6366F1' },
            { name: 'Left in budget', amount: leftInBudget, color: '#F59E0B' }
        ];

        await budget.save();

        const response = {
            currentBalance,
            totalIncome,
            totalExpenses,
            monthlyData,
            budgetBreakdown: {
                total: budget.total,
                categories: budget.categories
            }
        };

        console.log('📤 Sending response:', response);
        res.json(response);

    } catch (error) {
        console.error('❌ Error getting financial summary:', error);
        res.status(500).json({ message: 'Error getting financial summary' });
    }
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
    try {
        console.log('🆕 ADD TRANSACTION REQUEST:', {
            body: req.body,
            user: req.user?.email,
            userId: req.user?._id
        });

        const { account, transaction, category, amount, date, type } = req.body;
        const userId = req.user._id;

        if (!userId) {
            console.error('❌ No user ID found in request');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const newTransaction = new Transaction({
            user: userId,
            account,
            transaction,
            category,
            amount: parseFloat(amount),
            date: new Date(date),
            type
        });

        console.log('💾 Saving transaction to database:', newTransaction);
        await newTransaction.save();
        console.log('✅ Transaction saved successfully!');

        res.status(201).json({
            message: 'Transaction added successfully',
            transaction: newTransaction
        });

    } catch (error) {
        console.error('❌ Error adding transaction:', error);
        res.status(500).json({
            message: 'Error adding transaction',
            error: error.message
        });
    }
};

// Update budget
exports.updateBudget = async (req, res) => {
    try {
        const { total } = req.body;
        const userId = req.user._id;
        const currentDate = new Date();
        
        let budget = await Budget.findOneAndUpdate(
            {
                user: userId,
                month: currentDate.getMonth(),
                year: currentDate.getFullYear()
            },
            { $set: { total } },
            { new: true, upsert: true }
        );
        
        res.json({
            message: 'Budget updated successfully',
            budget
        });
        
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ message: 'Error updating budget' });
    }
};

// Get recent transactions
exports.getRecentTransactions = async (req, res) => {
    try {
        const userId = req.user._id;
        const limit = parseInt(req.query.limit) || 10;
        
        const transactions = await Transaction.find({ user: userId })
            .sort({ date: -1 })
            .limit(limit);
            
        res.json(transactions);
        
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({ message: 'Error getting transactions' });
    }
};
