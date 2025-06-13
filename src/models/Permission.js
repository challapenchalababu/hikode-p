const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema(
  {
    resource: {
      type: String,
      required: [true, 'Please add a resource name'],
      trim: true
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters']
    },
    actions: {
      type: [String],
      required: [true, 'Please add at least one action'],
      enum: ['create', 'read', 'update', 'delete', 'list']
    },
    isSystem: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index to ensure uniqueness of resource-action combination
PermissionSchema.index({ resource: 1 }, { unique: true });

module.exports = mongoose.model('Permission', PermissionSchema); 