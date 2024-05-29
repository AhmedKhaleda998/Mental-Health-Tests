const { body } = require('express-validator');

exports.test = () => {
    return [
        body('category')
            .notEmpty()
            .withMessage('Category must not be empty')
            .isString()
            .withMessage('Category must be a string')
            .isIn(['ADHD', 'Anxiety', 'Depression', 'PTSD', 'Stress'])
            .withMessage('Invalid category, must be ADHD, Anxiety, Depression, PTSD, or Stress'),

        body('score')
            .notEmpty()
            .withMessage('Score must not be empty')
            .isNumeric()
            .withMessage('Score must be a number')
            .isInt({ min: 0, max: 100 })
            .withMessage('Score must be between 0 and 100'),
    ];
};