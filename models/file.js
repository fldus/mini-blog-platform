const {DataTypes} = require('sequelize');
const sequelize = require('./index');

const file = sequelize.define('file', {
  file_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'file',
  timestamps: false
});

module.exports = file;