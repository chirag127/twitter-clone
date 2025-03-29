const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/twitter-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Twitter Clone API');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});