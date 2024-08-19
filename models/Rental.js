const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db').sequelize;
const User=require('../models/User');
const Book=require('../models/Book');
class Rental extends Model{}
Rental.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Book',
            key: 'id'
        }
    },
    start_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Rental',
    tableName:'rentals',
    timestamps:false
})
Book.hasMany(Rental, { foreignKey: 'book_id' });
User.hasMany(Rental,{foreignKey:'user_id'})
Rental.belongsTo(User,{foreignKey:'user_id'})
Rental.belongsTo(Book, { foreignKey: 'book_id' });
Rental.belongsTo(Book, { foreignKey: 'book_id' });
Book.hasMany(Rental, { foreignKey: 'book_id' });

module.exports=Rental