const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Role = require('../models/Role');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Extract token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ErrorResponse('User role not found', 403));
    }

    const userRole = await Role.findById(req.user.role);
    
    if (!userRole) {
      return next(new ErrorResponse('User role not found', 403));
    }
    
    if (!roles.includes(userRole.name)) {
      return next(
        new ErrorResponse(
          `User role ${userRole.name} is not authorized to access this route`,
          403
        )
      );
    }
    
    next();
  };
};

// Check permission for a specific resource action
exports.checkPermission = (resource, action) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ErrorResponse('User role not found', 403));
    }

    const userRole = await Role.findById(req.user.role).populate('permissions');
    
    if (!userRole) {
      return next(new ErrorResponse('User role not found', 403));
    }

    // Super admin has all permissions
    if (userRole.name === 'superadmin') {
      return next();
    }

    // Check if role has the specific permission
    const hasPermission = userRole.permissions.some(
      permission => permission.resource === resource && permission.actions.includes(action)
    );

    if (!hasPermission) {
      return next(
        new ErrorResponse(
          `Not authorized to ${action} ${resource}`,
          403
        )
      );
    }

    next();
  };
}; 