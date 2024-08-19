const express = require('express');
const bcrypt = require('bcrypt');
const route = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const {getSignUp, handleSignUp}=require('../controllers/userController');
route.get('/',getSignUp)

route.post('/', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], handleSignUp);

module.exports = route;
