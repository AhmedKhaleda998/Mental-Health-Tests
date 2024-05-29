const router = require('express').Router();

const { sendMessage } = require('../controllers/contact');

const { message } = require('../validations/contact');

router.post('/', message(), sendMessage);

module.exports = router;