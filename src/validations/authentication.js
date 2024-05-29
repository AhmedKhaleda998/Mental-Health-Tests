const { body } = require('express-validator');

const User = require('../models/user');

exports.isLogin = () => {
    return [
        body('email')
            .notEmpty()
            .withMessage('Email must not be empty')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Password must not be empty'),
    ];
};

exports.isUser = () => {
    return [
        body('firstName')
            .notEmpty()
            .withMessage('First name must not be empty')
            .trim()
            .isAlpha()
            .withMessage('First name must contain only alphabetic characters')
            .isLength({ min: 2, max: 256 })
            .withMessage('First name must be at least 2 characters long and at most 256 characters long'),

        body('lastName')
            .notEmpty()
            .withMessage('First name must not be empty')
            .trim()
            .isAlpha()
            .withMessage('First name must contain only alphabetic characters')
            .isLength({ min: 2, max: 256 })
            .withMessage('First name must be at least 2 characters long and at most 256 characters long'),

        body('email')
            .notEmpty()
            .withMessage('Email must not be empty')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail()
            .custom(async (email) => {
                const user = await User.findOne({ email });
                if (user) {
                    return Promise.reject('Email already exists');
                }
            }),

        body('password')
            .notEmpty()
            .withMessage('Password must not be empty')
            .trim()
            .isLength({ min: 6, max: 512 })
            .withMessage('Password must be at least 6 characters long and at most 512 characters long')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

        body('phone')
            .notEmpty()
            .withMessage('Phone must not be empty')
            .trim()
            .isString()
            .withMessage('Phone must be a string')
            .isLength({ min: 11, max: 11 })
            .withMessage('Phone must be 11 characters long')
            .matches(/^01[0125]\d{8}$/)
            .withMessage('Invalid phone number')
            .custom(async (phone) => {
                const user = await User.findOne({ phone });
                if (user) {
                    return Promise.reject('Phone number already exists');
                }
            }),

        body('gender')
            .optional()
            .trim()
            .isString()
            .withMessage('Gender method must be a string')
            .isIn(['male', 'female'])
            .withMessage('Invalid gender'),

        body('ssn')
            .optional()
            .trim()
            .isString()
            .withMessage('SSN must be a string')
            .isLength({ min: 14, max: 14 })
            .withMessage('SSN must be 14 characters long')
            .matches(/^(2|3)\d{13}$/)
            .withMessage('Invalid SSN')
            .custom(async (ssn) => {
                const user = await User.findOne({ ssn });
                if (user) {
                    return Promise.reject('SSN already exists');
                }
            }),
    ];
};
