const request = require('supertest');
const app = require('../src/app');

describe('Order Service - API Tests', () => {

  it('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Order Service is running');
  });

  it('POST /orders without token should return 401', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        tableNumber: 5,
        items: [
          {
            menuItemId: 1,
            menuItemName: 'Ndole',
            quantity: 2,
            unitPrice: 4500,
          },
        ],
        source: 'QR',
      });
    expect(res.statusCode).toBe(401);
  });

  it('POST /orders with missing fields should return 400', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: 1, role: 'Waiter' },
      process.env.JWT_SECRET || 'resopay_secret_key'
    );
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ tableNumber: 5 });
    expect(res.statusCode).toBe(400);
  });

});