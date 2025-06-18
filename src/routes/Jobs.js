// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/Jobs');

router.post('/', jobController.createJob);       // Create Job
router.get('/', jobController.getAllJobs);       // Get All Jobs
router.get('/:id', jobController.getJobById);    // Get Job by ID
router.put('/:id', jobController.updateJob);     // Update Job
router.delete('/:id', jobController.deleteJob);  // Delete Job

module.exports = router;