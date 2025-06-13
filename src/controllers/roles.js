const ErrorResponse = require('../utils/errorResponse');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');

// @desc      Get all roles
// @route     GET /api/v1/roles
// @access    Private/Admin
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().populate('permissions');

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single role
// @route     GET /api/v1/roles/:id
// @access    Private/Admin
exports.getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');

    if (!role) {
      return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create role
// @route     POST /api/v1/roles
// @access    Private/Admin
exports.createRole = async (req, res, next) => {
  try {
    const { name, description, permissions, isDefault } = req.body;

    // Check if permissions exist if provided
    if (permissions && permissions.length > 0) {
      const permissionsExist = await Permission.find({
        _id: { $in: permissions }
      });

      if (permissionsExist.length !== permissions.length) {
        return next(new ErrorResponse('Some permissions do not exist', 404));
      }
    }

    // Create role
    const role = await Role.create({
      name,
      description,
      permissions: permissions || [],
      isDefault: isDefault || false,
      createdBy: req.user.id
    });

    // If this is set as default, remove default from other roles
    if (isDefault) {
      await Role.updateMany(
        { _id: { $ne: role._id } },
        { isDefault: false }
      );
    }

    res.status(201).json({
      success: true,
      data: role
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update role
// @route     PUT /api/v1/roles/:id
// @access    Private/Admin
exports.updateRole = async (req, res, next) => {
  try {
    let role = await Role.findById(req.params.id);

    if (!role) {
      return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
    }

    // Prevent updating system roles
    if (role.isSystemRole && (req.body.name || req.body.isSystemRole === false)) {
      return next(new ErrorResponse('Cannot modify system role name or system status', 400));
    }

    const { name, description, permissions, isDefault } = req.body;

    // Check if permissions exist if provided
    if (permissions && permissions.length > 0) {
      const permissionsExist = await Permission.find({
        _id: { $in: permissions }
      });

      if (permissionsExist.length !== permissions.length) {
        return next(new ErrorResponse('Some permissions do not exist', 404));
      }
    }

    // Update role
    const fieldsToUpdate = {
      name,
      description,
      permissions,
      isDefault
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    role = await Role.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    // If this is set as default, remove default from other roles
    if (isDefault) {
      await Role.updateMany(
        { _id: { $ne: role._id } },
        { isDefault: false }
      );
    }

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete role
// @route     DELETE /api/v1/roles/:id
// @access    Private/Admin
exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
    }

    // Prevent deleting system roles
    if (role.isSystemRole) {
      return next(new ErrorResponse('Cannot delete system roles', 400));
    }

    // Check if any users are using this role
    const usersWithRole = await User.countDocuments({ role: role._id });
    if (usersWithRole > 0) {
      return next(new ErrorResponse(`This role is assigned to ${usersWithRole} users and cannot be deleted`, 400));
    }

    await role.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get role permissions
// @route     GET /api/v1/roles/:id/permissions
// @access    Private/Admin
exports.getRolePermissions = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');

    if (!role) {
      return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: role.permissions
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update role permissions
// @route     PUT /api/v1/roles/:id/permissions
// @access    Private/Admin
exports.updateRolePermissions = async (req, res, next) => {
  try {
    const { permissions } = req.body;
    
    if (!permissions || !Array.isArray(permissions)) {
      return next(new ErrorResponse('Please provide permissions array', 400));
    }

    let role = await Role.findById(req.params.id);

    if (!role) {
      return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
    }

    // Prevent modifying system role permissions
    if (role.isSystemRole) {
      return next(new ErrorResponse('Cannot modify system role permissions', 400));
    }

    // Check if all permissions exist
    const permissionsExist = await Permission.find({
      _id: { $in: permissions }
    });

    if (permissionsExist.length !== permissions.length) {
      return next(new ErrorResponse('Some permissions do not exist', 404));
    }

    role.permissions = permissions;
    await role.save();

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (err) {
    next(err);
  }
}; 