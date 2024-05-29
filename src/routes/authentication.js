const router = require('express').Router();

const { login, register, logout } = require('../controllers/authentication');

const isAuthenticated = require('../middlewares/isAuthenticated');

const { isLogin, isUser } = require("../validations/authentication")

router.post('/login', isLogin(), login);

router.post('/register', isUser(), register);

router.post('/logout', isAuthenticated, logout)

module.exports = router;