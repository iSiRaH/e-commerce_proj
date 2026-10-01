/**
 * Shared utility functions for E-Commerce Monorepo
 */

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const calculateDiscount = (price, discountPercent) => {
  if (!discountPercent) return price;
  const original = price / (1 - discountPercent / 100);
  return Number(original.toFixed(2));
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export const truncate = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
