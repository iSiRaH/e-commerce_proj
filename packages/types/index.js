/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [description]
 * @property {number} price
 * @property {number} [discount]
 * @property {string} [brand]
 * @property {string} [category]
 * @property {string} [sku]
 * @property {number} [stockQty]
 * @property {number} [weight]
 * @property {string} [thumbnail]
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [description]
 * @property {string} [image]
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} [name]
 * @property {'CUSTOMER'|'SELLER'|'ADMIN'} role
 * @property {string} [address]
 * @property {string} [phone]
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} id
 * @property {number} orderId
 * @property {number} productId
 * @property {number} quantity
 * @property {number} price
 * @property {number} [discount]
 * @property {number} total
 */

/**
 * @typedef {Object} Order
 * @property {number} orderId
 * @property {number} userId
 * @property {OrderItem[]} orderItems
 * @property {number} totalAmount
 * @property {number} [discount]
 * @property {number} [tax]
 * @property {string} [shippingAddress]
 * @property {string} [billingAddress]
 * @property {string} [shippingMethod]
 * @property {string} [paymentMethod]
 * @property {string} [paymentStatus]
 * @property {string} orderStatus
 * @property {number} [shippingCost]
 * @property {number} subtotal
 * @property {string} status
 */

export const OrderStatuses = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const UserRoles = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
};
