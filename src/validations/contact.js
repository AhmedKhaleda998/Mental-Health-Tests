const { body } = require('express-validator');

exports.message = () => {
    return [
        body('name')
            .optional()
            .trim()
            .isString()
            .withMessage('Name must be a string')
            .isLength({ min: 1, max: 256 })
            .withMessage('Name must be at least 2 characters long and at most 256 characters long'),

        body('email')
            .optional()
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),

        body('message')
            .notEmpty()
            .withMessage('Message is required')
            .isLength({ min: 1, max: 2048 })
            .withMessage('Message must be at least 1 characters long and at most 256 characters long')
    ]
}