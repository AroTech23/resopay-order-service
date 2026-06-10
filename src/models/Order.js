const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tableNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'Pending',
      'InPreparation',
      'Ready',
      'Delivered'
    ),
    defaultValue: 'Pending',
  },
  source: {
    type: DataTypes.ENUM('QR', 'Waiter'),
    allowNull: false,
  },
  waiterId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;