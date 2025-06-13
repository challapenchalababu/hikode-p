const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Role = require('../models/Role');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    // Use the advancedResults middleware in the route
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: 'Permission'
      }
    });

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, roleId } = req.body;

    if (!roleId) {
      return next(new ErrorResponse('Role ID is required', 400));
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return next(new ErrorResponse(`Role with id ${roleId} not found`, 404));
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role: roleId
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      active: req.body.active
    };

    // If role is provided, check if it exists
    if (req.body.roleId) {
      const role = await Role.findById(req.body.roleId);
      if (!role) {
        return next(new ErrorResponse(`Role with id ${req.body.roleId} not found`, 404));
      }
      fieldsToUpdate.role = req.body.roleId;
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Change user password
// @route     PUT /api/v1/users/:id/password
// @access    Private/Admin
exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
}; 