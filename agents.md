# AGENTS.md — AI Agent & Developer Architecture Guide

Welcome to the **E-Commerce Monorepo** project. This file serves as the definitive reference guide for AI coding assistants and human developers. It details the project architecture, tech stack, workspace layout, coding standards, database schema, and instructions for working within this codebase.

---

## 1. Project Overview & Architecture

This repository is structured as a modern **full-stack E-Commerce monorepo** managed using **pnpm workspaces** and **Turborepo**.

```
                           +------------------------+
                           |  pnpm / Turbo Monorepo |
                           +-----------+------------+
                                       |
           +---------------------------+---------------------------+
           |                           |                           |
   +-------v-------+           +-------v-------+           +-------v-------+
   |   apps/api    |           |   apps/web    |           |  apps/mobile  |
   | Node/Express  |           | React 19/Vite |           |  (Future)     |
   | PostgreSQL    |           | Tailwind CSS  |           | Expo / RN     |
   +-------+-------+           +---------------+           +---------------+
           |
   +-------v-------+
   |  packages/    |
   | ui, types,    |
   | utils, config |
   +---------------+
```

---

## 2. Directory Structure

```
e-commerce_proj/
├── apps/
│   ├── api/                    # Backend Express REST API
│   │   ├── prisma/             # Prisma database schema & seed scripts
│   │   │   ├── schema/         # Modular Prisma schema files
│   │   │   └── seed.js         # Initial database seed script
│   │   └── src/
│   │       ├── config/         # Environment & database configs
│   │       ├── controllers/    # Route controllers (request handler logic)
│   │       ├── routes/         # Express router modules
│   │       ├── services/       # Business logic layer
│   │       ├── utils/          # API utility helper functions
│   │       ├── app.js          # Express app configuration & middleware setup
│   │       └── server.js       # API entry point (HTTP server listening)
│   ├── web/                    # Frontend Web Client
│   │   ├── src/
│   │   │   ├── assets/         # Static assets & graphics
│   │   │   ├── component/      # Reusable React components
│   │   │   ├── pages/          # View pages (Home, etc.)
│   │   │   ├── App.jsx         # Main React App routing component
│   │   │   └── main.jsx        # Web entry point
│   │   ├── index.html          # Main HTML entry
│   │   ├── vite.config.js      # Vite build configuration
│   │   └── tailwind.config.js  # Tailwind CSS styling configuration
│   └── mobile/                 # Reserved for Mobile App (Expo / React Native)
├── packages/                   # Shared Monorepo Packages
│   ├── config/                 # Shared configurations (ESLint, Prettier)
│   ├── types/                  # Shared TypeScript/JSDoc interfaces & models
│   ├── ui/                     # Shared UI component library
│   └── utils/                  # Shared helper functions
├── package.json                # Monorepo root package.json
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── turbo.json                  # Turborepo task pipeline configuration
├── README.md                   # User documentation
├── agents.md                   # AI Agent & developer guide (this file)
├── improvements.md             # Suggested project improvements
└── nextSteps.md                # Actionable roadmap & next steps
```

---

## 3. Technology Stack

| Domain | Technology | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **Monorepo** | pnpm + Turborepo | `turbo`, `pnpm` workspace |
| **Backend API** | Node.js (ES / CommonJS) | Express.js 5, Morgan, CORS, dotenv |
| **Database & ORM** | PostgreSQL | Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`) |
| **Authentication** | JWT | `jsonwebtoken`, `bcrypt` |
| **Mailing** | Nodemailer | `nodemailer` |
| **Frontend Web** | React 19 + Vite 8 | `react-router-dom` v7, Tailwind CSS v3, Framer Motion, Lucide React |
| **Linting & Code Style** | ESLint + Prettier | `eslint-config-airbnb`, Airbnb plugins |

---

## 4. Key Developer Commands

All monorepo tasks can be run from the root directory using `pnpm`:

```bash
# Install dependencies across all workspaces
pnpm install

# Start all applications in development mode concurrently
pnpm dev

# Build all applications and packages
pnpm build

# Run linting across the monorepo
pnpm lint
```

### Backend API Specific Commands (`apps/api`):

```bash
cd apps/api

# Run Prisma schema generation
npx prisma generate

# Run Prisma migrations
npx prisma migrate dev

# Seed database with initial data
npx prisma db seed
```

### Frontend Web Specific Commands (`apps/web`):

```bash
cd apps/web

# Start Vite dev server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

---

## 5. Database Schema & Architecture (`apps/api/prisma`)

The project uses modular Prisma schema definitions located under `apps/api/prisma/schema/`:

1. **`base.prisma`**: Global Prisma generator and database datasource configuration.
2. **`user.prisma`**: User credentials, roles (`USER`, `ADMIN`), profile data, and relations.
3. **`product.prisma`**: Product catalog items, pricing, inventory stock, images, and relationships.
4. **`category.prisma`**: Hierarchical or list categories for product taxonomy.
5. **`cart.prisma`**: Shopping cart entities and cart item line items.
6. **`order.prisma`**: Order records, shipping addresses, order item line items, status states (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
7. **`payment.prisma`**: Payment transaction status, payment gateways, and references.

---

## 6. Backend API Endpoint Map

Base path: `/api/v1`

- **Health**: `/api/v1/health`
- **Auth**: `/api/v1/auth` (Register, Login, Password Reset, Refresh Token)
- **Users**: `/api/v1/users` (Profile management, Admin user management)
- **Products**: `/api/v1/products` (Catalog list, Detail, Search/Filter, Admin CRUD)
- **Categories**: `/api/v1/categories` (Category list, Admin CRUD)
- **Carts**: `/api/v1/carts` (Get cart, Add item, Update quantity, Remove item)
- **Orders**: `/api/v1/orders` (Create order, User order history, Order details, Admin status update)
- **Payments**: `/api/v1/payments` (Process payment, Webhook listener)

---

## 7. Operational Guidelines for AI Agents

When implementing features or fixing bugs in this repository, follow these rules:

1. **Workspace Boundary Awareness**:
   - Web application code goes in `apps/web/src/`.
   - Express API code goes in `apps/api/src/`.
   - Shared code should be abstracted into `packages/` when shared across apps.

2. **File Paths & Links**:
   - Always reference files with exact workspace paths.
   - Use standard relative imports within individual apps or package aliases where configured.

3. **Backend Coding Standards**:
   - Use standard Express controller/service separation: controllers handle request parsing and response formatting; services handle database interactions and business logic.
   - Pass unhandled errors to Express global error handler via `next(error)` or async error wrappers.

4. **Frontend Coding Standards**:
   - Keep UI components clean and responsive using Tailwind CSS.
   - Preserve component structure and ensure proper state management and props typing/validation.

5. **Prisma Schema Changes**:
   - When modifying files in `apps/api/prisma/schema/`, run `npx prisma generate` to update the Prisma Client.
