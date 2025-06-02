const {DataTypes} = require('sequelize');
const sequelize = require('./database');

const hart = sequelize.define('hart', {
  user_id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  post_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'hart',
  timestamps: false
});

module.exports = hart;