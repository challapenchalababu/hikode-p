const { body, param } = require('express-validator');

// Create user validation
const createUserValidation = [
  body('firstName')
    .trim()
    .escape()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot be more than 50 characters'),

  body('lastName')
    .trim()
    .escape()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name cannot be more than 50 characters'),

  body('email')
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('roleId')
    .notEmpty().withMessage('Role ID is required')
    .isMongoId().withMessage('Invalid Role ID'),

  body('phoneNumber')
    .trim()
    .optional()
    .isLength({ max: 20 }).withMessage('Phone number cannot be more than 20 characters')
];

// Update user validation
const updateUserValidation = [
  param('id')
    .isMongoId().withMessage('Invalid User ID'),

  body('firstName')
    .trim()
    .escape()
    .optional()
    .isLength({ max: 50 }).withMessage('First name cannot be more than 50 characters'),

  body('lastName')
    .trim()
    .escape()
    .optional()
    .isLength({ max: 50 }).withMessage('Last name cannot be more than 50 characters'),

  body('email')
    .trim()
    .normalizeEmail()
    .optional()
    .isEmail().withMessage('Please enter a valid email address'),

  body('roleId')
    .optional()
    .isMongoId().withMessage('Invalid Role ID'),

  body('phoneNumber')
    .trim()
    .optional()
    .isLength({ max: 20 }).withMessage('Phone number cannot be more than 20 characters'),
    
  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean value')
];

// Change password validation
const changePasswordValidation = [
  param('id')
    .isMongoId().withMessage('Invalid User ID'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  changePasswordValidation
}; 