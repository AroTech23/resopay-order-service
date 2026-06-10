# ResoPay — Order Service

The Order Service is the critical micro-service of the ResoPay smart restaurant management platform. It handles order creation from both QR self-service and waiter tablet channels, persists order data, and publishes events to RabbitMQ for downstream consumption by the Kitchen and Inventory services.

---

## Tech Stack

| Layer          | Technology         |
| -------------- | ------------------ |
| Runtime        | Node.js v18+       |
| Framework      | Express.js         |
| Database       | PostgreSQL 14+     |
| ORM            | Sequelize          |
| Messaging      | RabbitMQ 3.11+     |
| Authentication | JWT (jsonwebtoken) |
| Testing        | Jest + Supertest   |
| Container      | Docker             |

---

## Project Structure

resopay-order-service/
├── src/
│ ├── config/
│ │ ├── database.js # PostgreSQL connection via Sequelize
│ │ └── rabbitmq.js # RabbitMQ connection and publisher
│ ├── controllers/
│ │ └── orderController.js # Request handlers
│ ├── middleware/
│ │ └── authMiddleware.js # JWT authentication
│ ├── models/
│ │ ├── Order.js # Order entity
│ │ └── OrderItem.js # OrderItem entity
│ ├── routes/
│ │ └── orderRoutes.js # API route definitions
│ ├── services/
│ │ └── orderService.js # Business logic
│ ├── app.js # Express app setup
│ └── server.js # Entry point
├── tests/
│ └── order.test.js # Unit and integration tests
├── .env.example # Environment variable template
├── docker-compose.yml # Local development setup
└── package.json

---

## Prerequisites

Make sure you have the following installed:

- Node.js v18 or higher
- PostgreSQL 14 or higher
- RabbitMQ 3.11 or higher
- Docker (optional but recommended)

---

## Installation

**1. Clone the repository:**

```bash
git clone https://github.com/YOURUSERNAME/resopay-order-service
cd resopay-order-service
```

**2. Install dependencies:**

```bash
npm install
```

**3. Create your environment file:**

```bash
cp .env.example .env
```

**4. Edit the `.env` file with your local credentials:**

PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resopay_orders
DB_USER=postgres
DB_PASSWORD=yourpassword
RABBITMQ_URL=amqp://localhost
JWT_SECRET=your_secret_key
NODE_ENV=development

---

## Running the Service

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The service will start on `http://localhost:3002`

**Verify it is running:**

```bash
curl http://localhost:3002/health
```

Expected response:

```json
{ "status": "Order Service is running" }
```

---

## API Endpoints

| Method | Endpoint             | Description         | Auth |
| ------ | -------------------- | ------------------- | ---- |
| GET    | `/health`            | Health check        | None |
| POST   | `/orders`            | Create a new order  | JWT  |
| GET    | `/orders/:id`        | Get order by ID     | JWT  |
| PATCH  | `/orders/:id/status` | Update order status | JWT  |

---

## Request Examples

**Create an order:**

```json
POST /orders
Authorization: Bearer <token>

{
  "tableNumber": 7,
  "source": "QR",
  "items": [
    {
      "menuItemId": 1,
      "menuItemName": "Ndole",
      "quantity": 1,
      "unitPrice": 4500
    },
    {
      "menuItemId": 3,
      "menuItemName": "Guinness",
      "quantity": 2,
      "unitPrice": 1500
    }
  ]
}
```

**Expected response:**

```json
{
  "message": "Order created successfully",
  "orderId": 42,
  "status": "Pending"
}
```

**Update order status:**

```json
PATCH /orders/42/status
Authorization: Bearer <token>

{
  "status": "InPreparation"
}
```

---

## Running Tests

```bash
npm test
```

Tests cover:

- Health check endpoint
- Authentication — missing token returns 401
- Validation — missing fields returns 400

---

## Deployment with Docker

**1. Create a `docker-compose.yml` file in the project root:**

```yaml
version: "3.8"
services:
  order-service:
    build: .
    ports:
      - "3002:3002"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=resopay_orders
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - RABBITMQ_URL=amqp://rabbitmq
      - JWT_SECRET=resopay_secret_key
    depends_on:
      - postgres
      - rabbitmq

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: resopay_orders
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
```

**2. Create a `Dockerfile` in the project root:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
```

**3. Run everything:**

```bash
docker-compose up --build
```

---

## Environment Variables

| Variable     | Description                     | Default          |
| ------------ | ------------------------------- | ---------------- |
| PORT         | Port the service runs on        | 3002             |
| DB_HOST      | PostgreSQL host                 | localhost        |
| DB_PORT      | PostgreSQL port                 | 5432             |
| DB_NAME      | Database name                   | resopay_orders   |
| DB_USER      | Database user                   | postgres         |
| DB_PASSWORD  | Database password               | —                |
| RABBITMQ_URL | RabbitMQ connection URL         | amqp://localhost |
| JWT_SECRET   | Secret key for JWT verification | —                |
| NODE_ENV     | Environment                     | development      |

---

## Author

**Ngong Arnold**
Seven International University (SIU)
Course: Application Design & Evaluation SWE209
