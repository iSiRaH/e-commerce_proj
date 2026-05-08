# E-Commerce Web Application

A modern full-stack E-Commerce web application built using React, Vite, Tailwind CSS, Node.js, Express.js, and MySQL/MongoDB.

---

# Features

## User Features
- User registration and login
- JWT authentication
- Product search and filtering
- Product categories
- Add to cart
- Checkout system
- Order management
- User profile management
- Responsive modern UI
- Dark/light modern design
- Product reviews and ratings

## Admin Features
- Admin dashboard
- Add/Edit/Delete products
- Manage categories
- Manage users
- Manage orders
- Sales analytics
- Inventory management

---

# Technologies Used

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Redux Toolkit / Context API

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL

## Authentication
- JWT Authentication
- bcrypt password hashing

---

# Project Structure

```bash
e-commerce/
│
├── apps/
│   ├── web/              # React frontend
│   ├── api/              # Node.js + Express backend
│   └── mobile/           # Future React Native / Expo app
│
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # Shared types/schemas
│   ├── utils/            # Shared utility functions
│   └── config/           # Shared configs
│
├── package.json
├── turbo.json / nx.json
└── README.md

---

### Installation

 git clone https://github.com/your-username/e-commerce.git
 cd e-commerce
 pnpm install
 pnpm  dev
