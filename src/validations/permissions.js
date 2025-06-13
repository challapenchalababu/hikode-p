const { body, param } = require('express-validator');

// Valid actions for permissions
const VALID_ACTIONS = ['create', 'read', 'update', 'delete', 'list'];

// Create permission validation
const createPermissionValidation = [
  body('resource')
    .trim()
    .escape()
    .notEmpty().withMessage('Resource name is required'),

  body('description')
    .trim()
    .escape()
    .optional()
    .isLength({ max: 200 }).withMessage('Description cannot be more than 200 characters'),

  body('actions')
    .isArray().withMessage('Actions must be an array')
    .notEmpty().withMessage('At least one action is required')
    .custom(actions => {
      const invalidActions = actions.filter(action => !VALID_ACTIONS.includes(action));
      if (invalidActions.length > 0) {
        throw new Error(`Invalid actions: ${invalidActions.join(', ')}`);
      }
      return true;
    }),

  body('isSystem')
    .optional()
    .isBoolean().withMessage('isSystem must be a boolean value')
];

// Update permission validation
const updatePermissionValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Permission ID'),

  body('resource')
    .trim()
    .escape()
    .optional(),

  body('description')
    .trim()
    .escape()
    .optional()
    .isLength({ max: 200 }).withMessage('Description cannot be more than 200 characters'),

  body('actions')
    .optional()
    .isArray().withMessage('Actions must be an array')
    .notEmpty().withMessage('At least one action is required')
    .custom(actions => {
      if (actions) {
        const invalidActions = actions.filter(action => !VALID_ACTIONS.includes(action));
        if (invalidActions.length > 0) {
          throw new Error(`Invalid actions: ${invalidActions.join(', ')}`);
        }
      }
      return true;
    }),

  body('isSystem')
    .optional()
    .isBoolean().withMessage('isSystem must be a boolean value')
];

module.exports = {
  createPermissionValidation,
  updatePermissionValidation
}; 