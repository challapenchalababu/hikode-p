const ErrorResponse = require('../utils/errorResponse');
const Coaching = require('../models/Coaching');
const CoachingApplication = require('../models/CoachingApplication');
const User = require('../models/User');

// @desc      Get all coaching sessions
// @route     GET /api/v1/coaching
// @access    Public
exports.getCoachingSessions = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc      Get single coaching session
// @route     GET /api/v1/coaching/:id
// @access    Public
exports.getCoachingSession = async (req, res, next) => {
  try {
    const coaching = await Coaching.findById(req.params.id).populate({
      path: 'coach',
      select: 'firstName lastName email'
    });

    if (!coaching) {
      return next(new ErrorResponse(`Coaching session not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: coaching
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create new coaching session
// @route     POST /api/v1/coaching
// @access    Private
exports.createCoachingSession = async (req, res, next) => {
  try {
    // Add user to req.body as coach
    req.body.coach = req.user.id;

    // Check for required fields
    const { title, description, category, duration } = req.body;
    if (!title || !description || !category || !duration) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }

    // If not free, price is required
    if (req.body.isFree === false && !req.body.price) {
      return next(new ErrorResponse('Price is required for paid coaching sessions', 400));
    }

    // specialties, yearsOfExperience, professionalBio, and new availability structure are handled directly from req.body
    const coaching = await Coaching.create(req.body);

    res.status(201).json({
      success: true,
      data: coaching
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update coaching session
// @route     PUT /api/v1/coaching/:id
// @access    Private
exports.updateCoachingSession = async (req, res, next) => {
  try {
    let coaching = await Coaching.findById(req.params.id);

    if (!coaching) {
      return next(new ErrorResponse(`Coaching session not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is the coach
    if (coaching.coach.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this coaching session`, 401));
    }

    coaching = await Coaching.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: coaching
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete coaching session
// @route     DELETE /api/v1/coaching/:id
// @access    Private
exports.deleteCoachingSession = async (req, res, next) => {
  try {
    const coaching = await Coaching.findById(req.params.id);

    if (!coaching) {
      return next(new ErrorResponse(`Coaching session not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is the coach
    if (coaching.coach.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this coaching session`, 401));
    }

    await coaching.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Apply for coaching session
// @route     POST /api/v1/coaching/:id/apply
// @access    Private
exports.applyForCoaching = async (req, res, next) => {
  try {
    const coaching = await Coaching.findById(req.params.id);

    if (!coaching) {
      return next(new ErrorResponse(`Coaching session not found with id of ${req.params.id}`, 404));
    }

    // Check if user is applying to their own coaching session
    if (coaching.coach.toString() === req.user.id) {
      return next(new ErrorResponse('You cannot apply to your own coaching session', 400));
    }

    // Check if user has already applied
    const existingApplication = await CoachingApplication.findOne({
      coaching: req.params.id,
      user: req.user.id,
      status: { $nin: ['completed', 'cancelled', 'rejected'] }
    });

    if (existingApplication) {
      return next(new ErrorResponse('You have already applied for this coaching session', 400));
    }

    // Create application
    const application = await CoachingApplication.create({
      coaching: req.params.id,
      user: req.user.id,
      scheduledDate: req.body.scheduledDate,
      scheduledTime: req.body.scheduledTime,
      notes: req.body.notes,
      paymentAmount: coaching.isFree ? 0 : coaching.price,
      paymentStatus: coaching.isFree ? 'not_applicable' : 'pending'
    });

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get coaching applications for a user
// @route     GET /api/v1/coaching/applications
// @access    Private
exports.getUserApplications = async (req, res, next) => {
  try {
    const applications = await CoachingApplication.find({ user: req.user.id })
      .populate({
        path: 'coaching',
        select: 'title category duration isFree price',
        populate: {
          path: 'coach',
          select: 'firstName lastName email'
        }
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get coaching sessions created by user (as coach)
// @route     GET /api/v1/coaching/mysessions
// @access    Private
exports.getUserCoachingSessions = async (req, res, next) => {
  try {
    const coachingSessions = await Coaching.find({ coach: req.user.id });

    res.status(200).json({
      success: true,
      count: coachingSessions.length,
      data: coachingSessions
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get applications for coach's sessions
// @route     GET /api/v1/coaching/applications/received
// @access    Private
exports.getReceivedApplications = async (req, res, next) => {
  try {
    // Get all coaching sessions by this coach
    const coachingSessions = await Coaching.find({ coach: req.user.id });
    const sessionIds = coachingSessions.map(session => session._id);

    // Get all applications for these sessions
    const applications = await CoachingApplication.find({
      coaching: { $in: sessionIds }
    }).populate([
      {
        path: 'coaching',
        select: 'title category duration'
      },
      {
        path: 'user',
        select: 'firstName lastName email'
      }
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update application status
// @route     PUT /api/v1/coaching/applications/:id
// @access    Private
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return next(new ErrorResponse('Please provide a valid status', 400));
    }

    let application = await CoachingApplication.findById(req.params.id)
      .populate('coaching');

    if (!application) {
      return next(new ErrorResponse(`Application not found with id of ${req.params.id}`, 404));
    }

    // Check if user is the coach for this session
    if (application.coaching.coach.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this application', 401));
    }

    application = await CoachingApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    next(err);
  }
}; 