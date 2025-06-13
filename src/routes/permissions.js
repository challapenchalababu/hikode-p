const express = require('express');
const {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByResource
} = require('../controllers/permissions');

const router = express.Router();

const { protect, checkPermission } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createPermissionValidation,
  updatePermissionValidation
} = require('../validations/permissions');

// Apply protection to all routes
router.use(protect);

// Permission routes
router.get('/', checkPermission('permissions', 'list'), getPermissions);
router.get('/:id', checkPermission('permissions', 'read'), getPermission);
router.post('/', checkPermission('permissions', 'create'), validate(createPermissionValidation), createPermission);
router.put('/:id', checkPermission('permissions', 'update'), validate(updatePermissionValidation), updatePermission);
router.delete('/:id', checkPermission('permissions', 'delete'), deletePermission);

// Get permissions by resource
router.get('/resource/:resource', checkPermission('permissions', 'read'), getPermissionsByResource);

module.exports = router; 