const mongoose = require('mongoose');

const CoachingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a coaching title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a coach']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Career', 'Business', 'Lifestyle', 'Health', 'Technology', 'Other']
    },
    isFree: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      required: function() {
        return !this.isFree;
      },
      min: [0, 'Price cannot be negative']
    },
    duration: {
      type: Number,
      required: [true, 'Please specify duration in minutes'],
      min: [15, 'Duration must be at least 15 minutes']
    },
    specialties: {
      type: [String],
      default: []
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative']
    },
    professionalBio: {
      type: String,
      maxlength: [2000, 'Professional bio cannot be more than 2000 characters']
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true
        },
        slots: [
          {
            start: { type: String, required: true },
            end: { type: String, required: true }
          }
        ]
      }
    ],
    maxParticipants: {
      type: Number,
      default: 1,
      min: [1, 'Must allow at least 1 participant']
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Coaching', CoachingSchema); 