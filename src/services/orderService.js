const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { publish } = require('../config/rabbitmq');
const sequelize = require('../config/database');

async function validateOrderItems(items) {
  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }
  for (const item of items) {
    if (!item.menuItemId) {
      throw new Error('Each item must have a menuItemId');
    }
    if (!item.quantity || item.quantity < 1) {
      throw new Error('Each item must have a valid quantity');
    }
    if (!item.unitPrice || item.unitPrice <= 0) {
      throw new Error('Each item must have a valid unit price');
    }
  }
  return true;
}

async function createOrder(data) {
  const { tableNumber, items, source, waiterId } = data;

  await validateOrderItems(items);

  const transaction = await sequelize.transaction();

  try {
    const order = await Order.create(
      { tableNumber, source, waiterId: waiterId || null, status: 'Pending' },
      { transaction }
    );

    const orderItems = items.map((item) => ({
      orderId: order.id,
      menuItemId: item.menuItemId,
      menuItemName: item.menuItemName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      notes: item.notes || null,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });
    await transaction.commit();

    await publish('order.created', {
      orderId: order.id,
      tableNumber: order.tableNumber,
      source: order.source,
      items: orderItems,
    });

    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getOrderById(id) {
  const order = await Order.findByPk(id, {
    include: [{ model: OrderItem }],
  });
  if (!order) throw new Error('Order not found');
  return order;
}

async function updateOrderStatus(id, status) {
  const validStatuses = [
    'Pending',
    'InPreparation',
    'Ready',
    'Delivered',
  ];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status value');
  }
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  order.status = status;
  await order.save();
  return order;
}

module.exports = { createOrder, getOrderById, updateOrderStatus, validateOrderItems };