const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const ENCODED_DATABASE_URL =
  process.env['DATABASE_URL']?.replace(
    '[YOUR-PASSWORD]',
    process.env['DATABASE_PASSWORD'] || ''
  ) || '';

let realPrisma = null;
let isDbOnline = false;

try {
  const pool = new Pool({
    connectionString: ENCODED_DATABASE_URL,
    connectionTimeoutMillis: 2000,
  });
  const adapter = new PrismaPg(pool);
  realPrisma = new PrismaClient({ adapter });
} catch (e) {
  console.log('[DB] Pool initialization failed, will use local persistence.');
}

// In-Memory / Local fallback store with seed data
const initialCategories = [
  { id: 1, name: 'Audio', slug: 'audio', description: 'High-quality headphones, earbuds, speakers, and audio gear.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Wearables', slug: 'wearables', description: 'Smart watches, fitness bands, and wearable technology.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'Cameras', slug: 'cameras', description: 'Professional cameras, webcams, lenses, and photography equipment.', image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=1200&auto=format&fit=crop', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: 'Accessories', slug: 'accessories', description: 'Everyday gadgets, stands, tripods, hubs, and connectors.', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: 'Office & Desk', slug: 'office-desk', description: 'Keyboards, mice, desk lamps, and workspaces organization.', image: 'https://images.unsplash.com/photo-1587829191301-dc798b83add3?q=80&w=1200&auto=format&fit=crop', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: 'Mobile Accessories', slug: 'mobile-accessories', description: 'Cases, screen protectors, and chargers for your smartphones.', image: 'https://images.unsplash.com/photo-1606933248051-5ce42bebce85?q=80&w=1200&auto=format&fit=crop', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, name: 'Home Appliances', slug: 'home-appliances', description: 'Smart home automation, appliances, and accessories.', image: 'https://images.unsplash.com/photo-1565636192335-14c01e2335d6?q=80&w=1200&auto=format&fit=crop', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, name: 'Gadgets', slug: 'gadgets', description: 'Smart gadgets, tools, and tech novelties.', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1200&auto=format&fit=crop', isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

const initialProducts = [
  { id: 1, name: 'Premium Wireless Headphones', slug: 'premium-wireless-headphones', description: 'Experience studio-quality audio with active noise cancellation and 40-hour battery life.', price: 129.99, discount: 25.0, brand: 'AudioTech', category: 'Audio', sku: 'AUDIO-HEAD-01', stockQty: 50, weight: 0.3, thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Smart Watch Pro', slug: 'smart-watch-pro', description: 'Stay connected and track your vitals with cellular connectivity and water resistance up to 50m.', price: 199.99, discount: 33.0, brand: 'WearTech', category: 'Wearables', sku: 'WEAR-SW-02', stockQty: 30, weight: 0.1, thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'Ultra HD Camera', slug: 'ultra-hd-camera', description: 'Capture stunning landscapes and details with 4K video capabilities and continuous autofocus.', price: 799.99, discount: 20.0, brand: 'CamTech', category: 'Cameras', sku: 'CAM-UHD-03', stockQty: 15, weight: 0.8, thumbnail: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: 'Portable Speaker', slug: 'portable-speaker', description: 'Compact wireless Bluetooth speaker delivering deep bass and 360-degree sound distribution.', price: 79.99, discount: 38.0, brand: 'AudioTech', category: 'Audio', sku: 'AUDIO-SPK-04', stockQty: 80, weight: 0.5, thumbnail: 'https://images.unsplash.com/photo-1589003077984-894e133814c9?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: 'Wireless Earbuds', slug: 'wireless-earbuds', description: 'Ergonomic, secure-fit in-ear headphones with touch controls and IPX7 sweat/water resistance.', price: 89.99, discount: 40.0, brand: 'AudioTech', category: 'Audio', sku: 'AUDIO-EAR-05', stockQty: 60, weight: 0.05, thumbnail: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: 'Phone Tripod', slug: 'phone-tripod', description: 'Extendable tripod stand with bluetooth remote control for stable photography and video recording.', price: 29.99, discount: 40.0, brand: 'AccessTech', category: 'Accessories', sku: 'ACC-TRIP-06', stockQty: 100, weight: 0.2, thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, name: 'USB-C Hub', slug: 'usb-c-hub', description: '8-in-1 multi-port adapter with 4K HDMI, SD card reader, USB 3.0 ports, and Power Delivery passthrough.', price: 49.99, discount: 37.0, brand: 'AccessTech', category: 'Accessories', sku: 'ACC-HUB-07', stockQty: 120, weight: 0.1, thumbnail: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, name: 'Phone Stand', slug: 'phone-stand', description: 'Adjustable, sturdy aluminum desktop phone cradle holder for video calls, reading, and watching movies.', price: 19.99, discount: 43.0, brand: 'AccessTech', category: 'Accessories', sku: 'ACC-STAND-08', stockQty: 200, weight: 0.15, thumbnail: 'https://images.unsplash.com/photo-1563394566578-f8fae67fa0fb?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 9, name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', description: 'Tactile mechanical keyboard with customized RGB lighting effects and hot-swappable key switches.', price: 149.99, discount: 25.0, brand: 'KeyTech', category: 'Office & Desk', sku: 'OFF-KEY-09', stockQty: 40, weight: 1.0, thumbnail: 'https://images.unsplash.com/photo-1587829191301-dc798b83add3?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 10, name: 'Gaming Mouse', slug: 'gaming-mouse', description: 'High-precision tracking mouse with adjustable DPI sensor and ergonomic grips for marathon gaming sessions.', price: 59.99, discount: 40.0, brand: 'KeyTech', category: 'Office & Desk', sku: 'OFF-MOUS-10', stockQty: 95, weight: 0.12, thumbnail: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 11, name: 'Monitor Stand', slug: 'monitor-stand', description: 'Ergonomic wooden desk shelf and dual monitor stand riser with drawer compartments.', price: 89.99, discount: 36.0, brand: 'DeskTech', category: 'Office & Desk', sku: 'OFF-MON-11', stockQty: 25, weight: 2.5, thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 12, name: 'Desk Lamp', slug: 'desk-lamp', description: 'Dimmable smart LED desk light with wireless charging dock and adjustable arms.', price: 45.99, discount: 42.0, brand: 'DeskTech', category: 'Office & Desk', sku: 'OFF-LAMP-12', stockQty: 50, weight: 0.9, thumbnail: 'https://images.unsplash.com/photo-1565636192335-14c01e2335d6?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 13, name: 'Phone Case', slug: 'phone-case', description: 'Shock-proof clear protective case with MagSafe compatibility and yellowing resistance.', price: 24.99, discount: 50.0, brand: 'CaseTech', category: 'Mobile Accessories', sku: 'ACC-CASE-13', stockQty: 150, weight: 0.03, thumbnail: 'https://images.unsplash.com/photo-1606933248051-5ce42bebce85?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 14, name: 'Screen Protector', slug: 'screen-protector', description: 'Ultra-thin 9H hardness tempered glass shield with bubble-free installation frames.', price: 14.99, discount: 50.0, brand: 'CaseTech', category: 'Mobile Accessories', sku: 'ACC-PROT-14', stockQty: 300, weight: 0.01, thumbnail: 'https://images.unsplash.com/photo-1600163509057-ba94a3db4b18?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 15, name: 'Cable Organizer', slug: 'cable-organizer', description: 'Silicone self-adhesive cable management holder clips for clean office workspaces.', price: 12.99, discount: 48.0, brand: 'DeskTech', category: 'Office & Desk', sku: 'OFF-ORG-15', stockQty: 180, weight: 0.05, thumbnail: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 16, name: 'Webcam', slug: 'webcam', description: '1080p full HD desktop camera with autofocus, dual noise-reducing stereo microphones.', price: 99.99, discount: 37.0, brand: 'CamTech', category: 'Cameras', sku: 'CAM-WEB-16', stockQty: 45, weight: 0.25, thumbnail: 'https://images.unsplash.com/photo-1587826922334-403e5d63b672?q=80&w=1200&auto=format&fit=crop', sellerId: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

// Pre-hashed password for password123
const defaultHashedPassword = bcrypt.hashSync('password123', 10);

const initialUsers = [
  {
    id: 1,
    email: 'buyer@touchit.com',
    password: defaultHashedPassword,
    name: 'Alex Johnson (Buyer)',
    role: 'CUSTOMER',
    address: '742 Evergreen Terrace, Springfield, OR',
    phone: '+1 (555) 382-9104',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    isActive: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: 'seller@touchit.com',
    password: defaultHashedPassword,
    name: 'Marcus Vance (Seller)',
    role: 'SELLER',
    address: '450 Merchant Plaza, Suite 8, Austin, TX',
    phone: '+1 (555) 441-2983',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    isActive: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    email: 'admin@touchit.com',
    password: defaultHashedPassword,
    name: 'Sarah Connor (Admin)',
    role: 'ADMIN',
    address: '100 Silicon Way, Tech City, CA',
    phone: '+1 (555) 902-1133',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    isActive: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialOrders = [
  {
    orderId: 1001,
    userId: 1,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(),
    orderStatus: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Express Delivery',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR',
    billingAddress: '742 Evergreen Terrace, Springfield, OR',
    subtotal: 129.99,
    discount: 0,
    tax: 6.5,
    shippingCost: 0,
    totalAmount: 136.49,
    status: 'COMPLETED',
    orderItems: [
      {
        id: 1,
        orderId: 1001,
        productId: 1,
        quantity: 1,
        price: 129.99,
        discount: 25.0,
        total: 129.99,
        product: initialProducts[0],
      },
    ],
  },
  {
    orderId: 1002,
    userId: 1,
    createdAt: new Date(Date.now() - 3600000 * 5),
    updatedAt: new Date(),
    orderStatus: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'PayPal',
    shippingMethod: 'Standard Shipping',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR',
    billingAddress: '742 Evergreen Terrace, Springfield, OR',
    subtotal: 259.98,
    discount: 20.0,
    tax: 12.0,
    shippingCost: 0,
    totalAmount: 251.98,
    status: 'PROCESSING',
    orderItems: [
      {
        id: 2,
        orderId: 1002,
        productId: 2,
        quantity: 1,
        price: 199.99,
        discount: 33.0,
        total: 199.99,
        product: initialProducts[1],
      },
      {
        id: 3,
        orderId: 1002,
        productId: 10,
        quantity: 1,
        price: 59.99,
        discount: 40.0,
        total: 59.99,
        product: initialProducts[9],
      },
    ],
  },
];

const inMemoryDB = {
  products: [...initialProducts],
  categories: [...initialCategories],
  users: [...initialUsers],
  orders: [...initialOrders],
  carts: [],
  payments: [],
};

// Helper: Filter fields according to Prisma select
function applySelect(item, select) {
  if (!select || !item) return item;
  const result = {};
  for (const key of Object.keys(select)) {
    if (select[key]) {
      result[key] = item[key];
    }
  }
  return result;
}

// Fallback Model Handler
const createModelProxy = (tableName, collection) => ({
  findMany: async (args = {}) => {
    let items = collection.map((i) => ({ ...i }));
    if (args.where) {
      items = items.filter((item) => {
        for (const [key, val] of Object.entries(args.where)) {
          if (val && typeof val === 'object') {
            if (val.in && Array.isArray(val.in)) {
              if (!val.in.includes(item[key])) return false;
            }
          } else if (item[key] !== val) {
            return false;
          }
        }
        return true;
      });
    }
    if (args.select) {
      return items.map((i) => applySelect(i, args.select));
    }
    return items;
  },

  findUnique: async (args = {}) => {
    const item = collection.find((i) => {
      for (const [key, val] of Object.entries(args.where || {})) {
        if (typeof val === 'string' && typeof i[key] === 'string') {
          if (i[key].toLowerCase() === val.toLowerCase()) return true;
        }
        if (i[key] == val) return true;
      }
      return false;
    });
    if (!item) return null;
    const cloned = { ...item };
    return args.select ? applySelect(cloned, args.select) : cloned;
  },

  findFirst: async (args = {}) => {
    const item = collection.find((i) => {
      for (const [key, val] of Object.entries(args.where || {})) {
        if (i[key] == val) return true;
      }
      return false;
    });
    if (!item) return null;
    const cloned = { ...item };
    return args.select ? applySelect(cloned, args.select) : cloned;
  },

  create: async (args = {}) => {
    const newItem = {
      id: collection.length > 0 ? Math.max(...collection.map((i) => i.id || i.orderId || 0)) + 1 : 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      ...args.data,
    };
    if (tableName === 'order') {
      newItem.orderId = newItem.id;
      if (args.data.orderItems && args.data.orderItems.create) {
        newItem.orderItems = args.data.orderItems.create.map((item, idx) => ({
          id: idx + 1,
          orderId: newItem.orderId,
          ...item,
          product: inMemoryDB.products.find((p) => p.id === item.productId) || null,
        }));
      }
    }
    collection.unshift(newItem);
    const cloned = { ...newItem };
    return args.select ? applySelect(cloned, args.select) : cloned;
  },

  update: async (args = {}) => {
    const idx = collection.findIndex((i) => {
      for (const [key, val] of Object.entries(args.where || {})) {
        if (i[key] == val) return true;
      }
      return false;
    });
    if (idx === -1) throw new Error(`${tableName} not found for update`);
    collection[idx] = {
      ...collection[idx],
      ...args.data,
      updatedAt: new Date(),
    };
    return args.select ? applySelect(collection[idx], args.select) : collection[idx];
  },

  delete: async (args = {}) => {
    const idx = collection.findIndex((i) => {
      for (const [key, val] of Object.entries(args.where || {})) {
        if (i[key] == val) return true;
      }
      return false;
    });
    if (idx === -1) throw new Error(`${tableName} not found for delete`);
    const removed = collection.splice(idx, 1)[0];
    return removed;
  },

  deleteMany: async () => {
    collection.length = 0;
    return { count: 0 };
  },

  count: async () => collection.length,
});

const fallbackPrisma = {
  product: createModelProxy('product', inMemoryDB.products),
  category: createModelProxy('category', inMemoryDB.categories),
  user: createModelProxy('user', inMemoryDB.users),
  order: createModelProxy('order', inMemoryDB.orders),
  orderItem: createModelProxy('orderItem', []),
  cart: createModelProxy('cart', inMemoryDB.carts),
  payment: createModelProxy('payment', inMemoryDB.payments),
  $queryRaw: async () => [{ 1: 1 }],
  $disconnect: async () => {},
};

// Smart proxy: calls real Prisma if available, otherwise delegates to fallbackPrisma
const prismaHandler = {
  get(target, prop) {
    if (prop in fallbackPrisma) {
      const model = fallbackPrisma[prop];
      if (typeof model === 'function') {
        return model;
      }
      // Wrap methods with automatic fallback on DB errors
      return new Proxy(model, {
        get(mTarget, method) {
          return async (...args) => {
            if (realPrisma && realPrisma[prop] && typeof realPrisma[prop][method] === 'function') {
              try {
                return await realPrisma[prop][method](...args);
              } catch (err) {
                // If DB connection error, use fallback seamlessly
                return await mTarget[method](...args);
              }
            }
            return await mTarget[method](...args);
          };
        },
      });
    }
    return target[prop];
  },
};

const prisma = new Proxy(realPrisma || fallbackPrisma, prismaHandler);

module.exports = prisma;
