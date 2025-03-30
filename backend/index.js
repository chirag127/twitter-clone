const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // No longer needed directly here
// const User = require('./models/User'); // No longer needed directly here
const authRoutes = require('./routes/auth'); // Import auth routes
const tweetRoutes = require('./routes/tweets'); // Import tweet routes

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/twitter-clone') // Removed deprecated options
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// JWT Secret (Can be kept here or moved to a config file)
// const JWT_SECRET = process.env.JWT_SECRET || 'twitter-clone-secret';
// Note: JWT_SECRET is used within auth middleware and routes now

// Define Routes
app.get('/', (req, res) => {
  res.send('Twitter Clone API is running!');
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);


// Start Server
const PORT = process.env.PORT || 5001; // Changed default port to 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});