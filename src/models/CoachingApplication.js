const mongoose = require('mongoose');

const CoachingApplicationSchema = new mongoose.Schema(
  {
    coaching: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coaching',
      required: [true, 'Please provide a coaching session']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user']
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Please provide a scheduled date']
    },
    scheduledTime: {
      type: String,
      required: [true, 'Please provide a scheduled time']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    paymentStatus: {
      type: String,
      enum: ['not_applicable', 'pending', 'completed', 'refunded'],
      default: function() {
        // Set default based on whether the coaching is free
        return this.isFree ? 'not_applicable' : 'pending';
      }
    },
    paymentAmount: {
      type: Number,
      default: 0
    },
    paymentDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CoachingApplication', CoachingApplicationSchema); 