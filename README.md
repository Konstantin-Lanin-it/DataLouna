# Project DataLouna

A simple Node.js application for user management and product purchasing using TypeScript and PostgreSQL.

## Features

- User registration and authentication.
- User balance management.
- Product listing with prices.
- Purchase functionality with balance updates.
- Caching of items data using Redis.

## Technologies Used

- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Redis
- bcrypt
- node-fetch

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Redis

## Installation

1. **Clone the repository:**

Install dependencies:
npm install

Set up PostgreSQL:
Create a database and run the SQL scripts to setup the required tables. You can do this by running the SQL commands in the migrations/schema.sql file.

Set up Redis:
Ensure that Redis is running locally on localhost:6379.

Compile TypeScript code:
npm run build

Running the Application
Start the server:

npm start
The server will run on http://localhost:3000.



API Endpoints

User Management
Register User: POST /api/users/register
Login User: POST /api/users/login
Change Password: POST /api/users/change-password

Product Management
Get Items: GET /api/items

Purchasing
Purchase Product: POST /api/purchases/purchase


Request Body:
json
{
    "userId": 1,
    "productId": 1
}

Response:
json
{
    "balance": 39.50
}

Database Structure
Users Table
id: SERIAL PRIMARY KEY
username: VARCHAR(50) UNIQUE NOT NULL
password: VARCHAR(100) NOT NULL
balance: FLOAT NOT NULL DEFAULT 0.0
Products Table
id: SERIAL PRIMARY KEY
name: VARCHAR(100) NOT NULL
price: FLOAT NOT NULL
Purchases Table
id: SERIAL PRIMARY KEY
user_id: INTEGER REFERENCES users(id)
product_id: INTEGER REFERENCES products(id)
purchase_date: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

License
This project is licensed under the MIT License - see the LICENSE file for details.
