
const express = require('express');
const router = express.Router();

const signIn = require('./middleware/user/signin');
const login = require('./middleware/user/login');
const token = require('./middleware/user/token');

router.post('/', signIn.createUser, signIn.saveUser, signIn.responseToUser);
router.post('/login', login.validateParameter, login.comparePassword, login.createJsonWebToken, login.updateUserWithToken, login.responseToUser);
router.get('/token', token.validateParameter, token.verifyToken, token.findUser, token.createToken, token.responseToUser);

module.exports = router;