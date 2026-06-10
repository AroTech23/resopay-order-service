const orderService = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const { tableNumber, items, source, waiterId } = req.body;
    if (!tableNumber || !items || !source) {
      return res.status(400).json({
        error: 'tableNumber, items and source are required',
      });
    }
    const order = await orderService.createOrder({
      tableNumber,
      items,
      source,
      waiterId,
    });
    return res.status(201).json({
      message: 'Order created successfully',
      orderId: order.id,
      status: order.status,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const order = await orderService.updateOrderStatus(
      req.params.id,
      status
    );
    return res.status(200).json({
      message: 'Order status updated',
      orderId: order.id,
      status: order.status,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { createOrder, getOrderById, updateOrderStatus };