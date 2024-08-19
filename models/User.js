const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db').sequelize;
class User extends Model{}

User.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false

    },
    email:{
        unique:true,
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    modelName: 'Users',
    timestamps: false,
});
module.exports=User

