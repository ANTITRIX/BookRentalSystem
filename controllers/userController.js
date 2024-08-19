const User = require("../models/User");
const bcrypt = require("bcrypt");
const getSignIn=(req,res)=>{
    res.render('signin',{message:""})
}
const handleSignIn=async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            message = "This email does not have an associated account.";
            return res.render('signin', { message });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.isAuth = true;
            req.session.user = { id: user.id, email: user.email, username: user.username };
            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.status(500).json({ error: 'Failed to log in' });
                }
                return res.redirect('/allBooks')
            });
        } else {
            message = "Authentication failed. Please check your credentials.";
            return res.render('signin', { message });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getSignUp=(req,res)=>{
    res.render('signup')
}
const handleSignUp=async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const count = await User.count({
            where: { email: email },
        });

        if (count > 0) {
            return res.status(400).json({ error: 'This email already has an account' });
        } else {
            const newUser = await User.create({
                username,
                email,
                password: hashPassword,
            });
            return res.redirect('/signin');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports={
    getSignIn,
    handleSignIn,
    getSignUp,
    handleSignUp
}
