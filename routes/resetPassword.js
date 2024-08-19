const express=require('express');
const User = require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const router=express.Router();
const {renderResetPassword, generateResetLink}=require('../controllers/resetPasswordController');
router.get('/',renderResetPassword);
router.post('/',generateResetLink);
router.get('/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            console.error(`User not found with id: ${id}`);
            return res.status(404).send('Invalid link or user does not exist');
        }
        const secret = process.env.JWT_SECRET + user.password;
        try {
            const payload = jwt.verify(token, secret);
            console.log(`Token verified for user: ${user.email}`);
            res.render('resetPassword', { id, token, message: null });
        } catch (err) {
            console.error(`Invalid token: ${err.message}`);
            return res.status(400).send('Invalid token or expired');
        }
    } catch (error) {
        console.error(`Error retrieving user: ${error.message}`);
        return res.status(500).send('Internal server error');
    }
});
router.post('/:id/:token', async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const { id, token } = req.params;
    if (newPassword !== confirmPassword) {
        return res.render('reset-password', { id, token, message: 'Passwords do not match' });
    }
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('Invalid link or user does not exist');
        }
        const secret = process.env.JWT_SECRET + user.password;
        jwt.verify(token, secret);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(400).send('Invalid token or expired');
    }
});








module.exports=router;