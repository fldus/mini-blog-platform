const sequelize = require('./database');
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

module.exports = {sequelize, user, post, file, hart};