const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./config'); // <-- your Mongoose User model
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Load environment variables
require('dotenv').config();

// MongoDB connection (remove deprecated options if using mongoose v6+)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finance-tracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.error('No token provided in request headers');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Verifying token:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Token decoded successfully:', decoded);

    const user = await User.findById(decoded.userId);
    console.log('User found:', user ? user.email : 'No user found');

    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

// Export auth middleware for use in other files
module.exports.auth = auth;

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Auth Routes
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Signup attempt for:', name, email);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const userdata = await newUser.save();
    console.log('User created successfully:', userdata);

    res.status(201).json({
      message: "User created successfully",
      user: { name: userdata.name, email: userdata.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      console.log('Login successful for user:', user.name);

      // Generate JWT for login session
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: "Login successful",
        user: { name: user.name, email: user.email },
        token
      });
    } else {
      console.log('Invalid password for user:', email);
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Finance Routes
const financeController = require('./financeController');

app.get('/api/finance/summary', auth, financeController.getFinancialSummary);
app.post('/api/finance/transactions', auth, financeController.addTransaction);
app.get('/api/finance/transactions/recent', auth, financeController.getRecentTransactions);
app.put('/api/finance/budget', auth, financeController.updateBudget);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
