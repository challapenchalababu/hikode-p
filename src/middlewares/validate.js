const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Middleware to validate request
 * @param {Array} validations - Array of validation middleware from express-validator
 * @returns {Function} Express middleware
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validation chains
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => {
      if (err.type === 'field') {
        return { [err.path]: err.msg };
      }
      return { [err.type]: err.msg };
    });

    return next(new ErrorResponse('Validation Error', 400, extractedErrors));
  };
};

module.exports = validate; 