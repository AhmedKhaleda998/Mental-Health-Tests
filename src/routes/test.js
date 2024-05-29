const router = require('express').Router();

const { takeTest, getTests, predict } = require('../controllers/test');

const isAuthenticated = require('../middlewares/isAuthenticated');

const { test } = require('../validations/test');

router.post('/predict', predict);

router.post('/', isAuthenticated, test(), takeTest);

router.get('/', isAuthenticated, getTests);

module.exports = router;