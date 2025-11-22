const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    color: {
        type: String,
        required: true
    }
});

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number, // 0-11 (0 = January, 11 = December)
        required: true,
        min: 0,
        max: 11
    },
    year: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    categories: [categorySchema]
}, {
    timestamps: true
});

// Ensure one budget per user per month
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
