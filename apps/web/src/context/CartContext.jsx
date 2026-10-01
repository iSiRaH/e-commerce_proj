import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const { showToast } = useToast();

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('touchit_cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('touchit_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showToast(`Updated quantity for ${product.name}`, 'info');
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        showToast(`Added ${product.name} to cart!`, 'success');
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            originalPrice: product.originalPrice || (product.discount ? Number((product.price / (1 - product.discount / 100)).toFixed(2)) : product.price),
            discount: product.discount || 0,
            thumbnail: product.thumbnail || product.image,
            brand: product.brand || 'TouchIT',
            sku: product.sku || `SKU-${product.id}`,
            quantity: Number(quantity),
          },
        ];
      }
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        showToast(`Removed ${item.name} from cart`, 'info');
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'TOUCH20' || clean === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoCode(clean);
      showToast('Promo code applied: 20% OFF!', 'success');
      return true;
    } else if (clean === 'TOUCH10') {
      setDiscountPercent(10);
      setPromoCode(clean);
      showToast('Promo code applied: 10% OFF!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "TOUCH20"', 'error');
      return false;
    }
  };

  // Calculations matching backend Order model
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  const promoDiscount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const discountedSubtotal = Math.max(0, subtotal - promoDiscount);
  const shippingCost = subtotal > 99 || subtotal === 0 ? 0 : 9.99;
  const tax = Number((discountedSubtotal * 0.05).toFixed(2)); // 5% tax
  const totalAmount = Number((discountedSubtotal + shippingCost + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        promoCode,
        discountPercent,
        promoDiscount,
        applyPromo,
        shippingCost,
        tax,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
