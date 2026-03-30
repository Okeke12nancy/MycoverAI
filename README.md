# MyCoverGenius API

A mini insuretech REST API for purchasing insurance plans and managing policies.

## Tech Stack

- NestJS
- Sequelize-TypeScript
- PostgreSQL

## Setup

### Prerequisites

- Node.js v18+
- PostgreSQL

### Installation

```bash
npm install
```

### Environment

Create a `.env` file:

```env

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=mycovergenius
```

### Create database

```sql
CREATE DATABASE mycovergenius;
```

### Run

```bash
npm run start:dev
```

The app seeds all products, categories, and test users automatically on startup.

## Test Users (seeded)

| ID  | Name | Email | Wallet |
| --- | ---- | ----- | ------ |

| 1 | John Doe | <john@example.com> | ₦500,000 |

| 2 | Jane Smith | <jane@example.com> | ₦300,000 |

| 3 | Bob Johnson | <bob@example.com> | ₦150,000 |

## API Endpoints

### Products

`GET /api/v1/products` — List all products

### Plans

`POST /api/v1/plans` — Purchase a plan

```json
{ "userId": 1, "productId": 1, "quantity": 2 }
```

### Pending Policies

`GET /api/v1/plans/:planId/pending-policies`

### Policies

`POST /api/v1/policies/activate/:pendingPolicyId`

```json
{ "userId": 2 }
```

`GET /api/v1/policies` — All policies  
`GET /api/v1/policies?planId=1` — Filter by plan

## Tests

```bash

npm run test
```
