const express = require('express');
const route = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const multer  = require('multer')
const authController = require('../controllers/authController');
const path = require("path");
const {where} = require("sequelize");
const {getUserBooks, getBookToUpdate, postUpdateBook, getBookToDelete}=require('../controllers/bookController');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const userId = req.session.user.id;
        const title = req.body.title.replace(/ /g, '_');
        const ext = path.extname(file.originalname);
        cb(null, `${userId}_${title}${ext}`);
    }
});
const upload = multer({ storage: storage })

route.get('/',authController, getUserBooks);
route.get('/:id/update',authController, getBookToUpdate);
route.post('/:id/update',upload.single('thumbnail'),postUpdateBook)
route.get('/:id/delete', getBookToDelete);


module.exports = route;
