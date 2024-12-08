const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateAadhar = require('../middleware/validateAadhar');
const jwtAuthMiddleware = require('../middleware/jwt');

module.exports = function () {
    router.post('/signup', validateAadhar, userController.singUp);
    router.post('/login', userController.login);
    router.get('/profile', jwtAuthMiddleware, userController.profileDetails);
    router.put('/profile/password', jwtAuthMiddleware, userController.changePassword);
}
