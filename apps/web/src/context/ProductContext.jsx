import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import { useToast } from './ToastContext';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'cart' | 'auth' | 'checkout' | 'orders' | 'admin' | 'productDetail' | null

  const { showToast } = useToast();

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, orderRes] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
        api.orders.getAll(),
      ]);

      if (prodRes?.data?.products) {
        setProducts(prodRes.data.products);
      }
      if (catRes?.data?.categories) {
        setCategories(catRes.data.categories);
      }
      if (orderRes?.data?.orders) {
        setOrders(orderRes.data.orders);
      }
    } catch (err) {
      console.error('Failed to load products/categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) =>
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.slug?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      default:
        // Featured
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Derived sections
  const todayDeals = useMemo(() => {
    return products.filter((p) => p.isDealOfDay || p.discount >= 25).slice(0, 8);
  }, [products]);

  const trendingDeals = useMemo(() => {
    return products.filter((p) => p.isTrending || p.isBestseller || p.rating >= 4.5).slice(0, 8);
  }, [products]);

  // Product actions
  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setActiveModal('productDetail');
  };

  const closeModals = () => {
    setActiveModal(null);
    setSelectedProduct(null);
  };

  // Admin: Create product
  const createProduct = async (productData) => {
    try {
      const res = await api.products.create(productData);
      if (res?.data?.product) {
        setProducts((prev) => [res.data.product, ...prev]);
        showToast(`Created product: ${productData.name}`, 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
      return false;
    }
  };

  // Admin: Update product
  const updateProduct = async (id, updateData) => {
    try {
      const res = await api.products.update(id, updateData);
      if (res?.data?.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...res.data.product } : p))
        );
        showToast(`Updated product #${id}`, 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to update product', 'error');
      return false;
    }
  };

  // Admin: Delete product
  const deleteProduct = async (id) => {
    try {
      await api.products.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Product deleted`, 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
      return false;
    }
  };

  // Orders: Place order
  const placeOrder = async (orderData) => {
    try {
      const res = await api.orders.create(orderData);
      if (res?.data?.order) {
        setOrders((prev) => [res.data.order, ...prev]);
        showToast(`Order #${res.data.order.orderId} placed successfully!`, 'success');
        return res.data.order;
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
      return null;
    }
  };

  // Admin: Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.orders.updateStatus(orderId, status);
      if (res?.data?.order) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, orderStatus: status } : o))
        );
        showToast(`Order #${orderId} updated to ${status}`, 'success');
        return true;
      }
    } catch (err) {
      showToast('Failed to update order status', 'error');
      return false;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        orders,
        loading,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filteredProducts,
        todayDeals,
        trendingDeals,
        selectedProduct,
        openProductDetail,
        activeModal,
        setActiveModal,
        closeModals,
        createProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        refreshData: loadData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
