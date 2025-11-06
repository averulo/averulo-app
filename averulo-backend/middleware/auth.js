const { verifyJwt } = require('../lib/jwt');

/**
 * Middleware to verify JWT token and attach user to request
 */
function verifyToken(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required. Please provide a valid token.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify and decode token
    const decoded = verifyJwt(token);

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired. Please login again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token. Please login again.'
      });
    }

    return res.status(401).json({
      error: 'Authentication failed.'
    });
  }
}

/**
 * Middleware to check if user has required role(s)
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ['USER', 'HOST', 'ADMIN'])
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions. This action requires specific roles.'
      });
    }

    next();
  };
}

module.exports = { verifyToken, requireRole };
