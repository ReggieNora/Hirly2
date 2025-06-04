const { validationResult } = require('express-validator');
const { validationError } = require('../lib/response');

/**
 * Validate request using express-validator
 */
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return validationError(res, errors.array());
  };
};

// Common validation rules
const rules = {
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email address',
    },
    normalizeEmail: true,
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long',
    },
  },
  job: {
    title: {
      notEmpty: {
        errorMessage: 'Job title is required',
      },
      isLength: {
        options: { max: 200 },
        errorMessage: 'Title must be less than 200 characters',
      },
    },
    description: {
      notEmpty: {
        errorMessage: 'Job description is required',
      },
    },
  },
};

module.exports = {
  validate,
  rules,
};
