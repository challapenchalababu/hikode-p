const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Internship', 'Freelance'], required: true },
    experience: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    skills: [{ type: String }],
    salary: {
      min: { type: Number },
      max: { type: Number }
    },
    isRemote: { type: Boolean, default: false },
    openings: { type: Number, default: 1 },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Job', jobSchema);