const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

const user = require('./user');
const post = require('./post');
const file = require('./file');
const hart = require('./hart');

// post fk
user.hasMany(post, {foreignKey: 'user_id'});
post.belongsTo(user, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

// file fk
post.hasMany(file, {foreignKey: 'post_id'});
file.belongsTo(post,{
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

// hart fk (user)
user.hasMany(hart, {foreignKey: 'user_id'});
hart.belongsTo(user, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// hart fk (post)
post.hasMany(hart, {foreignKey: 'post_id'});
hart.belongsTo(post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
})

module.exports = sequelize;