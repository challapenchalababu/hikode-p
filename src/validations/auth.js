const { body } = require('express-validator');

// Register validation
const registerValidation = [
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

  body('phoneNumber')
    .trim()
    .optional()
    .isLength({ max: 20 }).withMessage('Phone number cannot be more than 20 characters'),

  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

// Update details validation
const updateDetailsValidation = [
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

  body('phoneNumber')
    .trim()
    .optional()
    .isLength({ max: 20 }).withMessage('Phone number cannot be more than 20 characters')
];

// Update password validation
const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

// Forgot password validation
const forgotPasswordValidation = [
  body('email')
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
];

// Reset password validation
const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

module.exports = {
  registerValidation,
  loginValidation,
  updateDetailsValidation,
  updatePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation
}; 