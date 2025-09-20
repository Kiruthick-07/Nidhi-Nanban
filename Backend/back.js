const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000', // Allow React frontend
  credentials: true
}));

// MongoDB connection
require('./config');

// Routes
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Signup attempt for:', name, email);

    // Check if user already exists
    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      name,
      email,
      password: hashedPassword,
    };

    const userdata = await collection.create(data);
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

    const user = await collection.findOne({ email: email });

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      console.log('Login successful for user:', user.name);
      res.status(200).json({
        message: "Login successful",
        user: { name: user.name, email: user.email }
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});