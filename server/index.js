const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://entertainment-orcin-omega.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✅', port: PORT });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Entertainment App Server', version: '1.0.0' });
});

// Database Connection
console.log('Connecting to MongoDB Atlas...');
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainment-app';

mongoose.connect(mongodbUri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  family: 4 // Force IPv4 to avoid IPv6 issues
})
  .then(() => {
    console.log('✅ MongoDB Atlas Connected Successfully!');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Error details:', err.code || 'N/A');
    console.warn('⚠️  Entering Mock Mode (In-memory storage)');
  });

// Start Server regardless of DB connection status
app.listen(PORT, () => {
  console.log('\n✅ ==========================================');
  console.log(`✅ Server is RUNNING on http://localhost:${PORT}`);
  console.log('✅ CORS enabled for http://localhost:5173');
  console.log('✅ Health check: http://localhost:' + PORT + '/api/health');
  console.log('✅ ==========================================\n');
});
