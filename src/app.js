const express = require('express');
const app = express();

app.use(express.json());

const orderRoutes = require('./routes/orderRoutes');
app.use('/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Order Service is running' });
});

module.exports = app;