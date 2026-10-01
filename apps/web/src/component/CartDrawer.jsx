import { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    promoCode,
    discountPercent,
    promoDiscount,
    applyPromo,
    shippingCost,
    tax,
    totalAmount,
    itemCount,
  } = useCart();

  const { setActiveModal } = useProducts();
  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput) {
      applyPromo(promoInput);
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#f7f4ea]/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-[#b87c4c]" size={22} />
              <h2 className="text-xl font-extrabold text-slate-900">Your Cart</h2>
              <span className="bg-[#b87c4c] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white text-slate-500 hover:text-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-[#ebd9d1]/50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag size={36} className="text-[#b87c4c]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                  Looks like you haven't added anything to your cart yet. Explore our deals!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#b87c4c] hover:bg-[#9b643a] text-white font-bold py-2.5 px-6 rounded-full text-sm transition shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>${item.price} each</span>
                        {item.discount > 0 && (
                          <span className="text-rose-600 font-bold">-{item.discount}%</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 transition text-slate-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 transition text-slate-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-500 transition p-1"
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-right">
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-400 hover:text-rose-600 transition"
                  >
                    Clear entire cart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-[#fdfbf7]">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. TOUCH20)"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Apply
                  </button>
                </div>
                {promoCode && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <Check size={12} />
                    Code "{promoCode}" applied ({discountPercent}% OFF)
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shippingCost}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200/60">
                  <span>Total</span>
                  <span className="text-[#b87c4c]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#b87c4c] hover:bg-[#9b643a] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg hover:shadow-xl text-base"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
