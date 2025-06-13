const express = require('express');
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions
} = require('../controllers/roles');

const router = express.Router();

const { protect, checkPermission } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createRoleValidation,
  updateRoleValidation,
  updateRolePermissionsValidation
} = require('../validations/roles');

// Apply protection to all routes
router.use(protect);

// Role routes
router.get('/', checkPermission('roles', 'list'), getRoles);
router.get('/:id', checkPermission('roles', 'read'), getRole);
router.post('/', checkPermission('roles', 'create'), validate(createRoleValidation), createRole);
router.put('/:id', checkPermission('roles', 'update'), validate(updateRoleValidation), updateRole);
router.delete('/:id', checkPermission('roles', 'delete'), deleteRole);

// Role permissions routes
router.get('/:id/permissions', checkPermission('roles', 'read'), getRolePermissions);
router.put('/:id/permissions', checkPermission('roles', 'update'), validate(updateRolePermissionsValidation), updateRolePermissions);

module.exports = router; 