const {DataTypes} = require('sequelize');
const sequelize = require('./index');

const user = sequelize.define('user', {
  user_id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username:{
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  password:{
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nickname:{
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
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