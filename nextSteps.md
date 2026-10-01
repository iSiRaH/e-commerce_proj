# Next Steps & Developer Roadmap — E-Commerce Monorepo

This document outlines the step-by-step actionable roadmap for developing, enhancing, and deploying the E-Commerce Monorepo project.

---

## 🎯 Implementation Roadmap Overview

```
 Phase 1: Foundation (P0)      Phase 2: Core Features (P1)     Phase 3: DevOps & QA (P2)
┌─────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
│ • Workspace Clean-up    │   │ • Complete Web Pages      │   │ • Unit & E2E Testing      │
│ • API Integration Setup │──>│ • State & Cart Management │──>│ • Docker Setup            │
│ • Shared Packages Dev   │   │ • Payment Gateway Wire-up │   │ • CI/CD Pipelines         │
│ • Zod Input Validation  │   │ • Admin Dashboard UI      │   │ • Production Deployment   │
└─────────────────────────┘   └───────────────────────────┘   └───────────────────────────┘
```

---

## Phase 1: Foundation & Cleanup (P0 - Immediate)

Focus on stabilizing the codebase, addressing technical debt, setting up API communications, and building shared package foundations.

### 1.1 Monorepo Workspace Cleanup & Environment Setup
- [ ] Remove hardcoded debugging statements (`console.log`) in `apps/api/src/app.js`.
- [ ] Fix `pnpm-workspace.yaml` `allowBuilds` settings for `@prisma/engines` and `prisma`.
- [ ] Ensure `.env.example` templates exist for both `apps/api` and `apps/web`.

### 1.2 Shared Packages Initialization (`packages/`)
- [ ] **`packages/types`**: Define typescript/JSDoc types for User, Product, Category, Cart, Order, and API payload contracts.
- [ ] **`packages/utils`**: Implement common helpers (`formatCurrency`, `formatDate`, `validateEmail`, `slugify`).
- [ ] **`packages/ui`**: Move shared basic components (`Button`, `Input`, `Card`, `Badge`, `Modal`) into `@e-commerce/ui`.
- [ ] Update `package.json` files in `apps/api` and `apps/web` to depend on workspace packages (`workspace:*`).

### 1.3 Backend Security & Validation Foundation
- [ ] Install and configure **Zod** schema validation middleware on Express routes (`authRoutes`, `productRoutes`, `orderRoutes`).
- [ ] Install and configure **Helmet** and **express-rate-limit** in `apps/api/src/app.js`.
- [ ] Add async wrapper error middleware to eliminate manual `try/catch` repetition in Express controllers.

---

## Phase 2: Core Feature Implementation (P1 - Short-Term)

Focus on connecting frontend web views with backend API endpoints and delivering complete user shopping flows.

### 2.1 Web Client API Service & State Setup (`apps/web`)
- [ ] Create central Axios API client (`src/api/client.js`) with request/response interceptors for automatic JWT header injection and global error handling.
- [ ] Implement global **Auth Context / Zustand store** handling user login state, token persistence (`localStorage` or HTTP-only cookies), and logout.
- [ ] Implement global **Cart Store** synced with API endpoint `/api/v1/carts`.

### 2.2 Complete Web Routing & Views (`apps/web`)
- [ ] **Auth Pages**: Build `/login` and `/register` components with client-side form validation.
- [ ] **Product Pages**:
  - Connect `/` Home catalog page to real `/api/v1/products` API (replace mock data).
  - Build `/product/:id` view showing detailed images, description, reviews, stock status, and "Add to Cart".
- [ ] **Cart & Checkout**:
  - Build Cart page / side-drawer component.
  - Implement `/checkout` multi-step form (Shipping details, Order summary, Payment selection).
- [ ] **User Profile & Orders**:
  - Build `/profile` page for user details management.
  - Build `/orders` list and `/orders/:id` detailed view for order history tracking.

### 2.3 Payment Gateway Integration
- [ ] Implement Stripe / PayPal payment session creation in `apps/api/src/controllers/paymentController.js`.
- [ ] Integrate Stripe Elements / PayPal buttons on frontend checkout page (`apps/web`).
- [ ] Implement Stripe Webhook handler endpoint (`/api/v1/payments/webhook`) to handle async payment confirmation and order status updates to `PAID`.

### 2.4 Admin Management Portal
- [ ] Add role-based middleware (`restrictTo('ADMIN')`) for admin endpoints in backend API.
- [ ] Build `/admin` dashboard views:
  - Product catalog CRUD operations (Add product, edit price/stock, upload images).
  - Category manager.
  - Order status management (Mark orders as `SHIPPED` or `DELIVERED`).

---

## Phase 3: Mobile App, Testing & DevOps (P2 - Medium-Term)

Focus on mobile application bootstrapping, automated test coverage, containerization, and production readiness.

### 3.1 Mobile App Initialization (`apps/mobile`)
- [ ] Initialize Expo / React Native workspace in `apps/mobile`.
- [ ] Configure Tailwind / NativeWind styling and React Navigation.
- [ ] Connect shared API client and `@e-commerce/types` packages.

### 3.2 Automated Testing Setup
- [ ] **Backend API Tests**: Setup Vitest / Jest + Supertest for testing API endpoints (`auth`, `product`, `order`).
- [ ] **Web Component Tests**: Add React Testing Library tests for critical components (Cart, Checkout form).
- [ ] **End-to-End Tests**: Setup Playwright to verify full user journey: Register -> Browse Catalog -> Add to Cart -> Checkout.

### 3.3 Containerization & CI/CD
- [ ] Write optimized `Dockerfile` for `apps/api` and `apps/web`.
- [ ] Create `docker-compose.yml` to run API, Web, and PostgreSQL locally with a single command (`docker compose up`).
- [ ] Create GitHub Actions workflow (`.github/workflows/ci.yml`) to enforce linting, type-checking, and test suite execution on pull requests.

---

## 📋 Quick Task Checkoff Matrix

| Area | Task | Priority | Status |
| :--- | :--- | :---: | :---: |
| **Clean-up** | Remove debug logs & update pnpm settings | P0 | ⏳ Pending |
| **Packages** | Populate `packages/types`, `packages/utils`, `packages/ui` | P0 | ⏳ Pending |
| **Backend** | Add Zod input validation & security headers | P0 | ⏳ Pending |
| **Frontend** | Axios client & global Auth/Cart state | P1 | ⏳ Pending |
| **Frontend** | Build Product Detail, Cart, Checkout, Auth pages | P1 | ⏳ Pending |
| **Backend** | Stripe payment webhook implementation | P1 | ⏳ Pending |
| **Admin** | Build Admin Dashboard UI & protected routes | P1 | ⏳ Pending |
| **Mobile** | Bootstrap Expo app in `apps/mobile` | P2 | ⏳ Pending |
| **DevOps** | Dockerfile & Docker Compose configuration | P2 | ⏳ Pending |
| **QA** | Integration test suite setup (Vitest + Supertest) | P2 | ⏳ Pending |
