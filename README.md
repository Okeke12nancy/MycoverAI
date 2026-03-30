# MyCoverGenius API

This is a mini insuretech REST API that allows users to purchase insurance products (called a plan), using their wallet, manage pending policy slots, and activate policies.

## Tech Stack

- **NestJS** — Node.js framework
- **Sequelize-TypeScript** — ORM
- **PostgreSQL** — Database
- **TypeScript** — Language

## Prerequisites

- Node.js v18+
- PostgreSQL v13+
- Git

## Getting Started

### 1. Clone the repository

```bash
git https://github.com/Okeke12nancy/MycoverAI.git
cd my-cover-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=mycover.ai
NODE_ENV=development
```

### 4. Create the database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE mycover.ai;
```

### 5. Start the server

```bash
npm run start:dev
```

On startup, the application automatically:

- Syncs all database tables
- Seeds product categories, products, and test users

The server runs at `http://localhost:3000`

---

## Seeded Data

### Test Users

| Name        | Email              | Wallet Balance |
| ----------- | ------------------ | -------------- |
| John Doe    | <john@example.com> | ₦500,000       |
| Jane Smith  | <jane@example.com> | ₦300,000       |
| Bob Johnson | <bob@example.com>  | ₦150,000       |

> User IDs are UUIDs generated at runtime. Query the `users` table or use `GET /api/v1/products` to get the correct IDs before testing.

### Product Table

| Name                  | Category | Price   |
| --------------------- | -------- | ------- |
| Optimal Care Mini     | Health   | ₦10,000 |
| Optimal Care Standard | Health   | ₦20,000 |
| Third-Party           | Auto     | ₦5,000  |
| Comprehensive         | Auto     | ₦15,000 |

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

All responses follow this structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {}
}
```

### Products

#### Fetch all products

```bash

GET /products
```

- Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Optimal Care Mini",
      "price": "10000",
      "category": { "id": "uuid", "name": "Health" }
    }
  ]
}
```

---

### Plans

#### Purchase a plan

```bash
POST /plans
```

#### Request Body

```json
{
  "userId": "uuid",
  "productId": "uuid",
  "quantity": 2
}
```

- `userId` — the user purchasing the plan (must have sufficient wallet balance)
- `productId` — the insurance product being purchased
- `quantity` — number of slots to create (total cost = price × quantity)

Response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Plan purchased successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "totalAmount": "20000",
    "quantity": 2
  }
}
```

---

### Pending Policies

#### List pending policy slots under a plan

```bash
GET /plans/:planId/pending-policies
```

Returns all unused slots under the specified plan. Each slot can be activated individually and assigned to a user.

- Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pending policies fetched successfully",
  "data": [
    {
      "id": "uuid",
      "planId": "uuid",
      "productId": "uuid",
      "status": "unused",
      "product": { "id": "uuid", "name": "Optimal Care Mini", "price": "10000" }
    }
  ]
}
```

---

### Policies

#### Activate a pending policy

```bash
PATCH /policies/activate/:pendingPolicyId
```

Activates a pending policy slot and assigns it to a user. On activation:

- A unique policy number is generated
- The pending policy is marked as used and soft deleted
- A policy record is created for the specified user

- Request Body

```json
{
  "userId": "uuid"
}
```

> Note: A user cannot be assigned the same product type more than once within the same plan.

- Response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Policy activated successfully",
  "data": {
    "id": "uuid",
    "policyNumber": "PL-1234567890",
    "planId": "uuid",
    "productId": "uuid",
    "userId": "uuid"
  }
}
```

#### List all activated policies

```bash
GET /policies
```

#### Filter policies by plan

```bash
GET /policies?planId=uuid
```

## Testing the Full Flow

Follow these steps in order to test the complete purchase and activation flow:

1. **Get product IDs** — `GET /api/v1/products` and copy a product UUID
2. **Get user IDs** — query your `users` table in pgAdmin: `SELECT id, name FROM users;`
3. **Buy a plan** — `POST /api/v1/plans` with a userId, productId and quantity
4. **View pending slots** — `GET /api/v1/plans/:planId/pending-policies` and copy a slot UUID
5. **Activate slot 1** — `PATCH /api/v1/policies/activate/:pendingPolicyId` with a userId
6. **Activate slot 2** — repeat with a different userId to assign to another person
7. **View all policies** — `GET /api/v1/policies`
8. **Filter by plan** — `GET /api/v1/policies?planId=uuid`

---

## Running Tests

```bash
npm run test
```

## Postman Documentation

<https://documenter.getpostman.com/view/32473062/2sBXinGq1q>
