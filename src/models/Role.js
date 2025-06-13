const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a role name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Role name cannot be more than 50 characters']
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters']
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
      }
    ],
    isDefault: {
      type: Boolean,
      default: false
    },
    isSystemRole: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Prevent deleting system roles
RoleSchema.pre('remove', function(next) {
  if (this.isSystemRole) {
    return next(new Error('Cannot delete system roles'));
  }
  next();
});

module.exports = mongoose.model('Role', RoleSchema); 