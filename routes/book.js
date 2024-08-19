const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })
const express = require('express');
const route = express.Router();
route.get('/',(req,res)=>[
    res.redirect('/addBook')
])