const express=require('express')
const route=express.Router()
const Rental=require('../models/Rental')
const Book=require('../models/Book')
const User=require('../models/User')
const authController = require('../controllers/authController');
const{ renderBookToRent, postBookRental }=require('../controllers/bookController');



route.get('/',authController, renderBookToRent);
route.post('/:id/rate',authController, postBookRental);


module.exports=route;