const jwt = require('jsonwebtoken');
const { sendError } = require('../lib/response');
const { supabase } = require('../lib/supabaseClient');

/**
 * Middleware to require authentication for protected routes
 * Attaches user to req.user if authenticated
 */
const requireAuth = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies?.token || 
                 (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return sendError(res, 'Authentication token required', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('id', decoded.sub)
      .single();

    if (error || !user) {
      return sendError(res, 'User not found', 404);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    }
    
    if (err.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token', 401);
    }
    
    sendError(res, 'Authentication failed', 500);
  }
};

/**
 * Middleware to require specific user roles
 * @param {...string} roles - Allowed roles
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

module.exports = { 
  requireAuth, 
  requireRole 
};