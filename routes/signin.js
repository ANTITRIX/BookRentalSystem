const express = require('express');
const bcrypt = require('bcrypt');
const route = express.Router();
const User = require('../models/User');
const {getSignIn, handleSignIn}=require('../controllers/userController');
route.get('/',getSignIn)

route.post('/', handleSignIn);
module.exports=route;