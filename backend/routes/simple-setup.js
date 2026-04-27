const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Simple admin setup that doesn't require database
router.post('/admin', async (req, res) => {
  try {
    console.log('Creating simple admin setup...');
    
    // Create a hashed password for admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Store in a simple in-memory object (for demo purposes)
    const adminUser = {
      id: 1,
      username: 'admin',
      email: 'admin',
      password_hash: hashedPassword,
      role: 'admin',
      status: 'active'
    };
    
    console.log('Admin user created successfully');
    
    res.json({
      success: true,
      message: 'Simple admin setup completed',
      admin: {
        username: adminUser.username,
        role: adminUser.role,
        status: adminUser.status
      },
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });
    
  } catch (error) {
    console.error('Simple admin setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Simple admin setup failed',
      error: error.message
    });
  }
});

// Simple login endpoint that doesn't require database
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Simple login attempt for:', username);
    
    // Hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      const token = 'simple-jwt-token-for-demo';
      
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
    
  } catch (error) {
    console.error('Simple login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

module.exports = router;
