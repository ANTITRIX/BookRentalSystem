const User = require('../models/User');
const mailgunService = require('../services/mailgunServices');
const jwt=require('jsonwebtoken')

const renderResetPassword=(req,res)=>{
    return res.render('reset-password',{message:''})
}
const renderLink=(req,res)=>{

}

const generateResetLink = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).send('User not found');
    }

    const secret = process.env.JWT_SECRET + user.password;
    const payload = {
        email: user.email,
        id: user.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '30m' });
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`;
    const fromEmail = 'midoezzat447@gmail.com';
    const subject = 'Password Reset';
    const message = `Click the following link to reset your password: ${link}`;

    try {
        await mailgunService.sendMail({
            body: {
                toEmail: email,
                fromEmail,
                subject,
                message,
            },
        }, res);

        res.render('reset-password',{ message: "validation email has been sent to your email !" })
    } catch (error) {
        res.status(500).send("Failed to send reset link");
    }
};










module.exports= {
    renderResetPassword,
    generateResetLink
};