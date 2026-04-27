const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// Role-based authorization
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to access this resource' 
      });
    }
    next();
  };
};

// Check if user is active
const checkUserStatus = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT status, locked_until FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is temporarily locked. Please try again later.' 
      });
    }

    next();
  } catch (error) {
    console.error('Error checking user status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Audit logging middleware
const auditLog = (action) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      // Log successful actions
      if (data.success !== false && req.user) {
        pool.query(
          'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
          [
            req.user.id,
            action,
            JSON.stringify({ body: req.body, params: req.params, query: req.query }),
            req.ip
          ]
        ).catch(err => console.error('Audit log error:', err));
      }
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkUserStatus,
  auditLog
};
