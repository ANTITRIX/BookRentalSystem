const express = require('express');
const route = express.Router();
const Book = require('../models/Book');
const User=require('../models/User')
const Rental=require('../models/Rental')
const { Op } = require('sequelize');

route.get('')