const {DataTypes} = require('sequelize');
const sequelize = require('./database');

const user = sequelize.define('user', {
  user_id:{
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  username:{
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password:{
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  created_at:{
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = user;