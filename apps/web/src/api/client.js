import { initialCategories, initialProducts, demoUsers, initialOrders } from './seedData';

const BASE_URL = '/api/v1';

const STORAGE_KEYS = {
  PRODUCTS: 'touchit_products',
  CATEGORIES: 'touchit_categories',
  ORDERS: 'touchit_orders',
  USERS: 'touchit_users',
  USER: 'touchit_user',
  TOKEN: 'touchit_token',
};

// Initialize localStorage with seed data
function initializeLocalStore() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
  }
}

initializeLocalStore();

const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return {
    'Content-Type': 'application/json',
    ...(token && (token.startsWith('eyJ') || token.length > 20) ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Request with clean error reporting and fallback
async function request(endpoint, options = {}, fallbackFn) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      if (res.status === 204) return { status: 'success', data: null };
      const data = await res.json();
      return data;
    }

    // Extract detailed error message from backend if available
    let errorMsg = `Server error (${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.message) {
        errorMsg = errJson.message;
      }
    } catch (_) {}

    const apiErr = new Error(errorMsg);
    apiErr.status = res.status;
    throw apiErr;
  } catch (err) {
    // Only fall back to local mock data if the server is completely unreachable (offline/network failure)
    // Never fall back if the backend explicitly returned a 4xx client/validation error
    if (fallbackFn && (err.name === 'AbortError' || err.message.includes('Failed to fetch') || !err.status)) {
      return fallbackFn();
    }
    throw err;
  }
}

export const api = {
  // --- HEALTH ---
  health: {
    check: () =>
      request('/health', {}, () => ({
        status: 'ok',
        message: 'TouchIT API connected',
      })),
  },

  // --- PRODUCTS ---
  products: {
    getAll: () =>
      request('/products', {}, () => {
        const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        const products = stored ? JSON.parse(stored) : initialProducts;
        return { status: 'success', results: products.length, data: { products } };
      }),

    getById: (id) =>
      request(`/products/${id}`, {}, () => {
        const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        const products = stored ? JSON.parse(stored) : initialProducts;
        const product = products.find((p) => p.id === Number(id));
        if (!product) throw new Error('Product not found');
        return { status: 'success', data: { product } };
      }),

    create: (productData) =>
      request(
        '/products',
        {
          method: 'POST',
          body: JSON.stringify(productData),
        },
        () => {
          const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
          const products = stored ? JSON.parse(stored) : [...initialProducts];
          const newProduct = {
            id: Date.now(),
            rating: 5.0,
            reviews: 1,
            isNew: true,
            isActive: true,
            ...productData,
          };
          const updated = [newProduct, ...products];
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
          return { status: 'success', data: { product: newProduct } };
        }
      ),

    update: (id, updateData) =>
      request(
        `/products/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updateData),
        },
        () => {
          const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
          const products = stored ? JSON.parse(stored) : [...initialProducts];
          const idx = products.findIndex((p) => p.id === Number(id));
          if (idx === -1) throw new Error('Product not found');
          const updatedProduct = { ...products[idx], ...updateData };
          products[idx] = updatedProduct;
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
          return { status: 'success', data: { product: updatedProduct } };
        }
      ),

    delete: (id) =>
      request(
        `/products/${id}`,
        {
          method: 'DELETE',
        },
        () => {
          const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
          const products = stored ? JSON.parse(stored) : [...initialProducts];
          const updated = products.filter((p) => p.id !== Number(id));
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
          return { status: 'success', data: null };
        }
      ),
  },

  // --- CATEGORIES ---
  categories: {
    getAll: () =>
      request('/categories', {}, () => {
        const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        const categories = stored ? JSON.parse(stored) : initialCategories;
        return { status: 'success', results: categories.length, data: { categories } };
      }),
  },

  // --- AUTH ---
  auth: {
    login: async ({ email, password }) => {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    register: async (userData) => {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...userData,
          passwordConfirm: userData.passwordConfirm || userData.password,
        }),
      });
    },

    getMe: async () => {
      return await request('/auth/me');
    },

    logout: async () => {
      return await request('/auth/logout', {
        method: 'POST',
      });
    },
  },

  // --- USERS ---
  users: {
    getAll: () =>
      request('/users', {}, () => {
        const stored = localStorage.getItem(STORAGE_KEYS.USERS);
        const users = stored ? JSON.parse(stored) : demoUsers;
        return { status: 'success', results: users.length, data: { users } };
      }),
  },

  // --- ORDERS ---
  orders: {
    create: (orderData) =>
      request(
        '/orders',
        {
          method: 'POST',
          body: JSON.stringify(orderData),
        },
        () => {
          const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
          const orders = stored ? JSON.parse(stored) : [...initialOrders];
          const newOrder = {
            orderId: Math.floor(1000 + Math.random() * 9000),
            createdAt: new Date().toISOString(),
            orderStatus: 'PENDING',
            paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
            status: 'PROCESSING',
            ...orderData,
          };
          const updated = [newOrder, ...orders];
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
          return { status: 'success', data: { order: newOrder } };
        }
      ),

    getByUser: (userId) =>
      request(`/orders/user/${userId}`, {}, () => {
        const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
        const orders = stored ? JSON.parse(stored) : initialOrders;
        const userOrders = orders.filter((o) => !userId || o.userId === Number(userId));
        return { status: 'success', results: userOrders.length, data: { orders: userOrders } };
      }),

    getAll: () =>
      request('/orders', {}, () => {
        const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
        const orders = stored ? JSON.parse(stored) : initialOrders;
        return { status: 'success', results: orders.length, data: { orders } };
      }),

    updateStatus: (orderId, newStatus) =>
      request(
        `/orders/${orderId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ orderStatus: newStatus }),
        },
        () => {
          const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
          const orders = stored ? JSON.parse(stored) : [...initialOrders];
          const idx = orders.findIndex((o) => o.orderId === Number(orderId));
          if (idx !== -1) {
            orders[idx].orderStatus = newStatus;
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
          }
          return { status: 'success', data: { order: orders[idx] } };
        }
      ),
  },
};
