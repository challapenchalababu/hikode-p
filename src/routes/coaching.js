const express = require('express');
const { protect } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const validate = require('../middlewares/validate');
const Coaching = require('../models/Coaching');
const {
  createCoachingValidation,
  updateCoachingValidation,
  applyForCoachingValidation,
  updateApplicationStatusValidation
} = require('../validations/coaching');
const {
  getCoachingSessions,
  getCoachingSession,
  createCoachingSession,
  updateCoachingSession,
  deleteCoachingSession,
  applyForCoaching,
  getUserApplications,
  getUserCoachingSessions,
  getReceivedApplications,
  updateApplicationStatus
} = require('../controllers/coaching');

const router = express.Router();

/**
 * @swagger
 * /coaching/{id}/apply:
 *   post:
 *     summary: Apply for a coaching session
 *     tags: [Coaching]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coaching session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduledDate
 *               - scheduledTime
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 description: The date for coaching
 *               scheduledTime:
 *                 type: string
 *                 description: The time for coaching
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coaching session not found
 */
router.route('/:id/apply').post(protect, validate(applyForCoachingValidation), applyForCoaching);

/**
 * @swagger
 * /coaching/applications:
 *   get:
 *     summary: Get all coaching applications for the current user
 *     tags: [Coaching]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *       401:
 *         description: Unauthorized
 */
router.route('/applications').get(protect, getUserApplications);

/**
 * @swagger
 * /coaching/mysessions:
 *   get:
 *     summary: Get all coaching sessions created by the current user
 *     tags: [Coaching]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coaching sessions
 *       401:
 *         description: Unauthorized
 */
router.route('/mysessions').get(protect, getUserCoachingSessions);

/**
 * @swagger
 * /coaching/applications/received:
 *   get:
 *     summary: Get applications for coaching sessions created by the current user
 *     tags: [Coaching]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *       401:
 *         description: Unauthorized
 */
router.route('/applications/received').get(protect, getReceivedApplications);

/**
 * @swagger
 * /coaching/applications/{id}:
 *   put:
 *     summary: Update application status
 *     tags: [Coaching]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, completed, cancelled]
 *                 description: Application status
 *     responses:
 *       200:
 *         description: Application status updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.route('/applications/:id').put(protect, validate(updateApplicationStatusValidation), updateApplicationStatus);

/**
 * @swagger
 * /coaching:
 *   get:
 *     summary: Get all coaching sessions
 *     tags: [Coaching]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isFree
 *         schema:
 *           type: boolean
 *         description: Filter by free/paid status
 *     responses:
 *       200:
 *         description: List of coaching sessions
 *   post:
 *     summary: Create a new coaching session
 *     tags: [Coaching]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 description: Coaching title
 *               description:
 *                 type: string
 *                 description: Coaching description
 *               category:
 *                 type: string
 *                 enum: [Career, Business, Lifestyle, Health, Technology, Other]
 *                 description: Coaching category
 *               isFree:
 *                 type: boolean
 *                 description: Whether the coaching is free
 *               price:
 *                 type: number
 *                 description: Price (required if not free)
 *               duration:
 *                 type: number
 *                 description: Duration in minutes
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of specialties
 *               yearsOfExperience:
 *                 type: number
 *                 description: Years of experience
 *               professionalBio:
 *                 type: string
 *                 description: Professional bio
 *               availability:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                     slots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           start:
 *                             type: string
 *                             description: Start time (e.g., 09:00)
 *                           end:
 *                             type: string
 *                             description: End time (e.g., 17:00)
 *               maxParticipants:
 *                 type: number
 *                 description: Maximum number of participants
 *     responses:
 *       201:
 *         description: Coaching session created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .get(
    advancedResults(Coaching, {
      path: 'coach',
      select: 'firstName lastName'
    }),
    getCoachingSessions
  )
  .post(protect, validate(createCoachingValidation), createCoachingSession);

/**
 * @swagger
 * /coaching/{id}:
 *   get:
 *     summary: Get a single coaching session
 *     tags: [Coaching]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coaching session ID
 *     responses:
 *       200:
 *         description: Coaching session details
 *       404:
 *         description: Coaching session not found
 *   put:
 *     summary: Update a coaching session
 *     tags: [Coaching]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coaching session ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Career, Business, Lifestyle, Health, Technology, Other]
 *               isFree:
 *                 type: boolean
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of specialties
 *               yearsOfExperience:
 *                 type: number
 *                 description: Years of experience
 *               professionalBio:
 *                 type: string
 *                 description: Professional bio
 *               availability:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                     slots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           start:
 *                             type: string
 *                             description: Start time (e.g., 09:00)
 *                           end:
 *                             type: string
 *                             description: End time (e.g., 17:00)
 *               maxParticipants:
 *                 type: number
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Coaching session updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coaching session not found
 *   delete:
 *     summary: Delete a coaching session
 *     tags: [Coaching]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coaching session ID
 *     responses:
 *       200:
 *         description: Coaching session deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coaching session not found
 */
router
  .route('/:id')
  .get(getCoachingSession)
  .put(protect, validate(updateCoachingValidation), updateCoachingSession)
  .delete(protect, deleteCoachingSession);

module.exports = router; 