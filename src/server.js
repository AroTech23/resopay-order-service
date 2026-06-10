require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

const PORT = process.env.PORT || 3002;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });