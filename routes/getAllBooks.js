const express = require('express');
const route = express.Router();
const Book = require('../models/Book');
const Rental=require('../models/Rental')
const { Op } = require('sequelize');
const authController = require('../controllers/authController');
const {getAllBooks, getBookToRent, rentBook}=require('../controllers/bookController');


route.get('/',authController, getAllBooks);
route.get('/:id/Rent',getBookToRent);
route.post('/:id/Rent',rentBook);

module.exports=route;