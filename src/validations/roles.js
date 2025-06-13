const { body, param } = require('express-validator');

// Create role validation
const createRoleValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Role name is required')
    .isLength({ max: 50 }).withMessage('Role name cannot be more than 50 characters'),

  body('description')
    .trim()
    .escape()
    .optional()
    .isLength({ max: 200 }).withMessage('Description cannot be more than 200 characters'),

  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array')
    .custom(permissions => {
      if (permissions.length > 0) {
        const allValidIds = permissions.every(id => /^[0-9a-fA-F]{24}$/.test(id));
        if (!allValidIds) {
          throw new Error('Invalid permission ID format');
        }
      }
      return true;
    }),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be a boolean value')
];

// Update role validation
const updateRoleValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Role ID'),

  body('name')
    .trim()
    .escape()
    .optional()
    .isLength({ max: 50 }).withMessage('Role name cannot be more than 50 characters'),

  body('description')
    .trim()
    .escape()
    .optional()
    .isLength({ max: 200 }).withMessage('Description cannot be more than 200 characters'),

  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array')
    .custom(permissions => {
      if (permissions && permissions.length > 0) {
        const allValidIds = permissions.every(id => /^[0-9a-fA-F]{24}$/.test(id));
        if (!allValidIds) {
          throw new Error('Invalid permission ID format');
        }
      }
      return true;
    }),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be a boolean value')
];

// Update role permissions validation
const updateRolePermissionsValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Role ID'),

  body('permissions')
    .isArray().withMessage('Permissions must be an array')
    .notEmpty().withMessage('Permissions array cannot be empty')
    .custom(permissions => {
      if (permissions.length > 0) {
        const allValidIds = permissions.every(id => /^[0-9a-fA-F]{24}$/.test(id));
        if (!allValidIds) {
          throw new Error('Invalid permission ID format');
        }
      }
      return true;
    })
];

module.exports = {
  createRoleValidation,
  updateRoleValidation,
  updateRolePermissionsValidation
}; 