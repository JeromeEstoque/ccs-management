const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for testing
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API test endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const pool = require('./config/database');
    const connection = await pool.getConnection();
    
    if (connection) {
      await connection.ping();
      connection.release();
      
      res.json({
        success: true,
        message: 'Database connection successful',
        database: process.env.DB_NAME,
        host: process.env.DB_HOST
      });
    } else {
      throw new Error('Failed to get database connection');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log(`📡 Test endpoints available at http://localhost:${PORT}`);
});

module.exports = app;
