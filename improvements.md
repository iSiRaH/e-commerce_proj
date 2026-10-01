# Project Improvements — E-Commerce Monorepo

This document outlines key technical recommendations, code quality enhancements, structural optimizations, and security improvements for the E-Commerce Monorepo codebase.

---

## 1. Monorepo & Shared Packages Integration

### 🔴 Issue / Current State
- The shared workspace packages in `packages/` (`config`, `types`, `utils`, `ui`) currently contain minimal stub files (`module.exports = {}`).
- `apps/web` and `apps/api` duplicate utility logic and type concepts independently instead of sharing code.
- `apps/mobile` is currently an empty directory without package configuration or Expo/React Native boilerplate.

### 💡 Recommended Improvements
- **Populate Shared Packages**:
  - **`packages/types`**: Define shared TypeScript interfaces/types or JSDoc typedefs for API requests/responses, User, Product, Order, Cart, and Enum schemas.
  - **`packages/utils`**: Move common utility functions (currency formatting, date formatting, string manipulation, validation helpers) into this package.
  - **`packages/ui`**: Extract reusable React components (Buttons, Inputs, Modals, Cards, Loading Skeletons) to ensure uniform UI styling between `apps/web` and future `apps/mobile`.
  - **`packages/config`**: Share ESLint, Prettier, and Tailwind CSS configurations across all workspace apps.
- **Initialize `apps/mobile`**: Setup an Expo / React Native project structure configured to consume `@e-commerce/types` and `@e-commerce/utils`.

---

## 2. TypeScript Migration

### 🔴 Issue / Current State
- Both `apps/api` and `apps/web` are written in JavaScript (`.js` and `.jsx`).
- Lack of compile-time type safety makes refactoring risky and increases likelihood of runtime errors in API data payloads and component props.

### 💡 Recommended Improvements
- **Gradual TypeScript Adoption**:
  - Add `tsconfig.json` files to root and workspace apps.
  - Migrate core domain models and API contracts first (`packages/types`).
  - Convert Express controllers, services, and route handlers to `.ts`.
  - Convert React components and hooks to `.tsx`.

---

## 3. Backend & API Enhancements (`apps/api`)

### 🔴 Issue / Current State
- **Console Logs in Production Code**: `app.js` contains `console.log('Environment Variables:', ...)` with comments `#REMOVE: for debugging purposes only`.
- **Validation**: Request input validation is handled ad-hoc or partially missing in route controllers.
- **Error Handling**: While `errorController.js` exists, async handler wrapper standard is missing across all controllers, risking uncaught promise rejections.
- **Security Headers & Rate Limiting**: Missing security headers middleware (`helmet`) and rate-limiting middleware (`express-rate-limit`).
- **File Uploads**: No dedicated storage solution (e.g. S3 / Cloudinary) configured for product image uploads.

### 💡 Recommended Improvements
- **Input Validation**: Implement **Zod** or **Joi** schema validation middleware for all request bodies (`req.body`), query parameters (`req.query`), and route params (`req.params`).
- **Production Logging**: Replace `console.log` statements with a structured logger like **Pino** or **Winston** configured for JSON logging in production.
- **Security Hardening**:
  - Add `helmet` middleware for secure HTTP headers.
  - Add `express-rate-limit` for auth endpoints (`/auth/login`, `/auth/register`) to prevent brute-force attacks.
  - Sanitize user inputs against XSS and SQL injection.
  - Set up CORS with explicit origin allowlists instead of wildcard wildcard origins.
- **Image Storage Service**: Integrate AWS S3 or Cloudinary SDK in `services/uploadService.js` for handling product and user avatar images.

---

## 4. Frontend & UX Enhancements (`apps/web`)

### 🔴 Issue / Current State
- **Single Page Mounted**: `App.jsx` currently only routes to `<Home />`.
- **Missing Pages**: Lack of routes for Product Detail, Shopping Cart, Checkout, Order Tracking, Login/Register, User Profile, and Admin Dashboard.
- **State Management & API Layer**: Missing client state management (e.g. Redux Toolkit or Zustand) and data fetching library (e.g. TanStack / React Query or Axios instance with interceptors).
- **Hardcoded / Mock Data**: `Home.jsx` and `ProductFrame.jsx` rely heavily on inline mock data instead of calling backend API endpoints.

### 💡 Recommended Improvements
- **Complete Route Hierarchy**:
  - `/` -> Home Catalog Page
  - `/product/:id` -> Product Detail View
  - `/cart` -> Cart Drawer & Full Cart Page
  - `/checkout` -> Multi-step Checkout Flow (Address, Shipping, Payment)
  - `/orders` & `/orders/:id` -> Order History & Tracking
  - `/login` & `/register` -> Auth Pages
  - `/admin/*` -> Protected Admin Dashboard (Products, Orders, Analytics)
- **Data Fetching & Caching Layer**:
  - Install **TanStack Query (React Query)** and **Axios**.
  - Configure Axios instance with base URL (`http://localhost:5000/api/v1`), timeout, and request/response interceptors to handle JWT bearer token injection and 401 token refresh automatically.
- **Global Auth & Cart State**:
  - Implement a lightweight state management solution using **Zustand** or **React Context API** for managing current authenticated user, tokens, and cart state across components.
- **UX UI Polish**:
  - Add skeleton loaders (`SkeletonCard`) during data fetch state.
  - Add accessible toast notifications for cart actions and errors (e.g. `react-hot-toast` or `sonner`).

---

## 5. Database & ORM Enhancements (`apps/api/prisma`)

### 🔴 Issue / Current State
- `pnpm-workspace.yaml` contains `allowBuilds` configuration placeholder (`prisma: set this to true or false`).
- Indexing strategies and soft-delete patterns could be formalized across Prisma models.

### 💡 Recommended Improvements
- **Prisma Configuration Clean-up**: Update `pnpm-workspace.yaml` to explicitly enable required native engine builds for `@prisma/engines` and `prisma`.
- **Database Indexes**: Add database indexes (`@@index`) in Prisma schemas for high-frequency queries (e.g., `userId` on orders, `categoryId` on products, `email` on users, `createdAt` for sorting).
- **Soft Deletes & Auditing**: Add `isDeleted` / `deletedAt` fields to key entities (Product, Category) to prevent orphaned order history data when items are deleted by admins.

---

## 6. Testing, CI/CD & DevOps

### 🔴 Issue / Current State
- `package.json` scripts specify `"test": "echo \"Error: no test specified\" && exit 1"`.
- No automated unit tests, integration tests, or end-to-end tests exist.
- No Docker containerization or CI/CD pipelines configured.

### 💡 Recommended Improvements
- **Testing Setup**:
  - **API Tests**: Implement unit and integration tests using **Jest** / **Vitest** and **Supertest** for testing API endpoints, database operations, and authentication logic.
  - **Web Tests**: Implement component tests using **React Testing Library** and E2E tests using **Playwright**.
- **Dockerization**:
  - Create standard `Dockerfile` for `apps/api` and `apps/web`.
  - Create `docker-compose.yml` orchestrating PostgreSQL database, backend API service, and frontend web server.
- **CI/CD Pipeline**:
  - Configure **GitHub Actions** (`.github/workflows/ci.yml`) to automatically run linting, type checks, build validation, and automated tests on every Pull Request.
