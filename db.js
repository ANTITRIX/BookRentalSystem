const Sequelize = require('sequelize');
const sequelize = new Sequelize('BookRentalSystem', 'root', '@ldbOy2003', {
    host: 'localhost',
    dialect: 'mysql',
});


const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;