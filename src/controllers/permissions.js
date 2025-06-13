const ErrorResponse = require('../utils/errorResponse');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

// @desc      Get all permissions
// @route     GET /api/v1/permissions
// @access    Private/Admin
exports.getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find();

    res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single permission
// @route     GET /api/v1/permissions/:id
// @access    Private/Admin
exports.getPermission = async (req, res, next) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return next(
        new ErrorResponse(`Permission not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: permission
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create permission
// @route     POST /api/v1/permissions
// @access    Private/Admin
exports.createPermission = async (req, res, next) => {
  try {
    const { resource, description, actions, isSystem } = req.body;

    // Validate actions
    const validActions = ['create', 'read', 'update', 'delete', 'list'];
    if (actions && actions.length > 0) {
      const invalidActions = actions.filter(action => !validActions.includes(action));
      if (invalidActions.length > 0) {
        return next(
          new ErrorResponse(`Invalid actions: ${invalidActions.join(', ')}`, 400)
        );
      }
    }

    // Check if permission already exists for this resource
    const existingPermission = await Permission.findOne({ resource });
    if (existingPermission) {
      return next(
        new ErrorResponse(`Permission already exists for resource ${resource}`, 400)
      );
    }

    // Create permission
    const permission = await Permission.create({
      resource,
      description,
      actions,
      isSystem: isSystem || false
    });

    res.status(201).json({
      success: true,
      data: permission
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update permission
// @route     PUT /api/v1/permissions/:id
// @access    Private/Admin
exports.updatePermission = async (req, res, next) => {
  try {
    let permission = await Permission.findById(req.params.id);

    if (!permission) {
      return next(
        new ErrorResponse(`Permission not found with id of ${req.params.id}`, 404)
      );
    }

    // Prevent modifying system permissions
    if (permission.isSystem && (req.body.resource || req.body.isSystem === false)) {
      return next(
        new ErrorResponse('Cannot modify system permission resource or system status', 400)
      );
    }

    const { resource, description, actions, isSystem } = req.body;

    // Validate actions
    if (actions && actions.length > 0) {
      const validActions = ['create', 'read', 'update', 'delete', 'list'];
      const invalidActions = actions.filter(action => !validActions.includes(action));
      if (invalidActions.length > 0) {
        return next(
          new ErrorResponse(`Invalid actions: ${invalidActions.join(', ')}`, 400)
        );
      }
    }

    // Check if permission already exists for this resource if changing resource
    if (resource && resource !== permission.resource) {
      const existingPermission = await Permission.findOne({ resource });
      if (existingPermission) {
        return next(
          new ErrorResponse(`Permission already exists for resource ${resource}`, 400)
        );
      }
    }

    // Update permission
    const fieldsToUpdate = {
      resource,
      description,
      actions,
      isSystem
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    permission = await Permission.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: permission
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete permission
// @route     DELETE /api/v1/permissions/:id
// @access    Private/Admin
exports.deletePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return next(
        new ErrorResponse(`Permission not found with id of ${req.params.id}`, 404)
      );
    }

    // Prevent deleting system permissions
    if (permission.isSystem) {
      return next(new ErrorResponse('Cannot delete system permissions', 400));
    }

    // Check if any role uses this permission
    const rolesWithPermission = await Role.countDocuments({
      permissions: permission._id
    });

    if (rolesWithPermission > 0) {
      return next(
        new ErrorResponse(
          `This permission is assigned to ${rolesWithPermission} roles and cannot be deleted`,
          400
        )
      );
    }

    await permission.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get permissions by resource
// @route     GET /api/v1/permissions/resource/:resource
// @access    Private/Admin
exports.getPermissionsByResource = async (req, res, next) => {
  try {
    const resource = req.params.resource;
    const permission = await Permission.findOne({ resource });

    if (!permission) {
      return next(
        new ErrorResponse(`No permissions found for resource ${resource}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: permission
    });
  } catch (err) {
    next(err);
  }
}; 