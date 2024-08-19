const Book=require('./models/Book')
const express=require('express');
const db = require('./db');
const sequelize = require('./db').sequelize;
const expressLayouts=require('express-ejs-layouts');
const path=require('path')
const bodyParser = require('body-parser');
const cookieParser=require('cookie-parser')
const session=require('express-session')
const signup=require('./routes/signup')
const signin=require('./routes/signin')
const getUserBooks=require('./routes/getUsedrBooks')
const getAllBooks=require('./routes/getAllBooks')
const userRentals=require('./routes/userRentals')
const resetPassword=require('./routes/resetPassword');
const  Rental  = require('./models/Rental');
const { Op } = require('sequelize');

const app=express();
app.use(express.json());
app.use(expressLayouts);
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
    session({
        resave : false,
        saveUninitialized : false,
        secret : 'your-secret-key',
        cookie : {
            secure : false,
        }
    })
)
async function checkRentalRecords() {
    try {
        const today = new Date();

        // Find all rentals where the end date is before today
        const expiredRentals = await Rental.findAll({
            where: {
                end_date: {
                    [Op.lt]: today
                }
            }
        });

        for (const rental of expiredRentals) {
            // Update the corresponding book's rented status to false
            await Book.update(
                { rented: false },
                { where: { id: rental.book_id } }
            );

            console.log(`Rental ended for Book ID: ${rental.book_id}, status updated.`);
        }
    } catch (error) {
        console.error('Error checking rental records:', error);
    }
}

// Schedule the function to run every day at midnight
setInterval(async () => {
    await checkRentalRecords();
}, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
});
checkRentalRecords();
app.use('/signup',signup);
app.use('/signin',signin)
app.use('/userBooks',getUserBooks)
app.use('/allBooks',getAllBooks);
app.use('/userRentals',userRentals);
app.use('/reset-password',resetPassword);
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Set your uploads directory
    },
    filename: function (req, file, cb) {
        const userId = req.session.user.id;
        const title = req.body.title.replace(/ /g, '_');
        const ext = path.extname(file.originalname);
        cb(null, `${userId}_${title}${ext}`);
    }
});
const upload = multer({ storage: storage })
app.get('/',(req,res)=>{
    return res.render('home');
})
app.get('/addBook',(req,res)=>{
    return res.render('addNewBook')
})
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});
app.post('/addBook', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, author, description } = req.body;
        const thumbnail_path = req.file ? `uploads/${req.file.filename}` : null;


        if (!req.session.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        await Book.create({
            user_id: req.session.user.id,
            title,
            author,
            description,
            thumbnail_path
        });

        res.redirect('/userBooks')
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

