const { body } = require('express-validator');

exports.createCoachingValidation = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('description')
    .not()
    .isEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
  body('category')
    .not()
    .isEmpty()
    .withMessage('Category is required')
    .isIn(['Career', 'Business', 'Lifestyle', 'Health', 'Technology', 'Other'])
    .withMessage('Please select a valid category'),
  body('isFree')
    .optional()
    .isBoolean()
    .withMessage('isFree must be a boolean value'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value, { req }) => {
      if (req.body.isFree === false && !value) {
        throw new Error('Price is required for paid coaching sessions');
      }
      if (value < 0) {
        throw new Error('Price cannot be negative');
      }
      return true;
    }),
  body('duration')
    .not()
    .isEmpty()
    .withMessage('Duration is required')
    .isNumeric()
    .withMessage('Duration must be a number')
    .isInt({ min: 15 })
    .withMessage('Duration must be at least 15 minutes'),
  body('specialties')
    .optional()
    .isArray().withMessage('Specialties must be an array of strings')
    .custom(arr => arr.every(item => typeof item === 'string')).withMessage('Each specialty must be a string'),
  body('yearsOfExperience')
    .optional()
    .isNumeric().withMessage('Years of experience must be a number')
    .isInt({ min: 0 }).withMessage('Years of experience cannot be negative'),
  body('professionalBio')
    .optional()
    .isString().withMessage('Professional bio must be a string')
    .isLength({ max: 2000 }).withMessage('Professional bio cannot be more than 2000 characters'),
  body('availability')
    .optional()
    .isArray().withMessage('Availability must be an array')
    .custom((arr) => {
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return arr.every(item =>
        typeof item.day === 'string' &&
        validDays.includes(item.day) &&
        Array.isArray(item.slots) &&
        item.slots.every(slot => typeof slot.start === 'string' && typeof slot.end === 'string')
      );
    }).withMessage('Availability must be an array of objects with day and slots (start, end)'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum participants must be at least 1')
];

exports.updateCoachingValidation = [
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
  body('category')
    .optional()
    .isIn(['Career', 'Business', 'Lifestyle', 'Health', 'Technology', 'Other'])
    .withMessage('Please select a valid category'),
  body('isFree')
    .optional()
    .isBoolean()
    .withMessage('isFree must be a boolean value'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value, { req }) => {
      if (req.body.isFree === false && value === undefined) {
        throw new Error('Price is required for paid coaching sessions');
      }
      if (value < 0) {
        throw new Error('Price cannot be negative');
      }
      return true;
    }),
  body('duration')
    .optional()
    .isNumeric()
    .withMessage('Duration must be a number')
    .isInt({ min: 15 })
    .withMessage('Duration must be at least 15 minutes'),
  body('specialties')
    .optional()
    .isArray().withMessage('Specialties must be an array of strings')
    .custom(arr => arr.every(item => typeof item === 'string')).withMessage('Each specialty must be a string'),
  body('yearsOfExperience')
    .optional()
    .isNumeric().withMessage('Years of experience must be a number')
    .isInt({ min: 0 }).withMessage('Years of experience cannot be negative'),
  body('professionalBio')
    .optional()
    .isString().withMessage('Professional bio must be a string')
    .isLength({ max: 2000 }).withMessage('Professional bio cannot be more than 2000 characters'),
  body('availability')
    .optional()
    .isArray().withMessage('Availability must be an array')
    .custom((arr) => {
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return arr.every(item =>
        typeof item.day === 'string' &&
        validDays.includes(item.day) &&
        Array.isArray(item.slots) &&
        item.slots.every(slot => typeof slot.start === 'string' && typeof slot.end === 'string')
      );
    }).withMessage('Availability must be an array of objects with day and slots (start, end)'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum participants must be at least 1'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

exports.applyForCoachingValidation = [
  body('scheduledDate')
    .not()
    .isEmpty()
    .withMessage('Scheduled date is required')
    .isISO8601()
    .withMessage('Scheduled date must be a valid date'),
  body('scheduledTime')
    .not()
    .isEmpty()
    .withMessage('Scheduled time is required')
    .isString()
    .withMessage('Scheduled time must be a string'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot be more than 500 characters')
];

exports.updateApplicationStatusValidation = [
  body('status')
    .not()
    .isEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'approved', 'rejected', 'completed', 'cancelled'])
    .withMessage('Please provide a valid status')
]; 