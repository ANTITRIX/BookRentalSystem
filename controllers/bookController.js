const Book = require("../models/Book");
const {Op} = require("sequelize");
const Rental = require("../models/Rental");
const User = require("../models/User");
const getAllBooks=async (req, res) => {
    try {
        const user_id = req.session.user.id;
        const allBooksExceptMine = await Book.findAll({
            where: {
                user_id: {
                    [Op.not]: user_id
                }
            }
        });

        res.render('allBooks', { books: allBooksExceptMine });
    } catch (error) {
        console.error('Error fetching available books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getBookToRent=async (req,res)=>{
    try {
        const id=req.params.id;
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.render('rentBook', { book });
    }
    catch (error){
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const rentBook=async (req,res)=>{
    try {
        const book_id = req.params.id
        const user_id = req.session.user.id
        const {start_date, end_date} = req.body
        const newRental=await Rental.create({
            user_id,
            book_id,
            start_date,
            end_date,
        })
        console.log('done')
        await Book.update(
            { rented: true },
            { where: { id:book_id } }
        );
        return res.redirect('/userRentals')
    }
    catch (error){

    }

}
const getUserBooks=async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await User.findOne({
            where: { id: userId },
            include: {
                model: Book,
                attributes: ['id', 'title', 'author', 'description', 'thumbnail_path']
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const books = user.Books;
        const userName = user.username;
        books.forEach((book) => {
            book.thumbnail_path = `${book.thumbnail_path}`;
        });

        res.render('usersBooks', { books, userName });
    } catch (error) {
        console.error('Error fetching user books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getBookToUpdate=async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.render('singleBook', { book });
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const postUpdateBook=async (req,res)=>{
    try{
        const id=req.params.id;
        const{title,author,description}=req.body;
        const thumbnail_path = req.file ? `uploads/${req.file.filename}` : null;
        await Book.update({
            title,
            author,
            description,
            thumbnail_path
        },{
            where:{id}
        })
        return res.redirect('/userBooks')

    }
    catch (error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getBookToDelete=async (req, res) => {
    try {
        const id = req.params.id;
        await Book.destroy({ where: { id } });
        res.redirect('/userBooks');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const renderBookToRent=async (req, res) => {
    try {
        const user_id = req.session.user.id;
        const userRentals = await Rental.findAll({
            where: { user_id },
            include: {
                model: Book,
                attributes: ['title', 'author', 'description', 'thumbnail_path', 'rating']
            }
        });

        console.log(JSON.stringify(userRentals, null, 2)); // Debugging line

        res.render('userRentals', { rentals: userRentals });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}
const postBookRental=async (req, res) => {
    const book_id = req.params.id;
    const { rating } = req.body;

    try {
        const book = await Book.findByPk(book_id);

        if (book) {
            book.rating = rating;
            await book.save();
            res.redirect('/userRentals');  // Redirect to the rentals page
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports={
    getAllBooks,
    getBookToRent,
    rentBook,
    getUserBooks,
    getBookToUpdate,
    postUpdateBook,
    getBookToDelete,
    renderBookToRent,
    postBookRental

}
