import { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal() {
  const { selectedProduct, closeModals, setActiveModal } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const imageSrc = product.thumbnail || product.image;
  const calculatedOriginalPrice =
    product.originalPrice ||
    (product.discount
      ? (product.price / (1 - product.discount / 100)).toFixed(2)
      : product.price);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    closeModals();
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row border border-slate-200"
      >
        {/* Close Button */}
        <button
          onClick={closeModals}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          <X size={20} />
        </button>

        {/* Left Column: Image & Badges */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-200">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner bg-white">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Package size={14} className="text-[#b87c4c]" />
              SKU: {product.sku || 'TOUCH-001'}
            </span>
            {product.weight && (
              <span>Weight: {product.weight} kg</span>
            )}
          </div>
        </div>

        {/* Right Column: Information, Specs & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Category & Brand Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#a8bba3]/30 text-[#4c6248] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.category || 'Electronics'}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                • {product.brand || 'TouchIT Essentials'}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Rating & Stock */}
            <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-sm">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating || 4.7)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-800">{product.rating || 4.7}</span>
                <span className="text-slate-400 text-xs">({product.reviews || 120} reviews)</span>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 size={13} />
                  {product.stockQty ? `${product.stockQty} in stock` : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-black text-slate-900">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ${calculatedOriginalPrice}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Save ${((calculatedOriginalPrice - product.price)).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {product.description ||
                'Engineered with premium quality materials, tested for longevity, and designed to seamlessly elevate your everyday tech workflow.'}
            </p>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-slate-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons & Value Props */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-900 font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition shadow-sm"
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#b87c4c] hover:bg-[#9b643a] text-white font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition shadow-md"
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Value chips */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 text-center">
              <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl">
                <Truck size={16} className="text-[#b87c4c]" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl">
                <ShieldCheck size={16} className="text-[#a8bba3]" />
                <span>1-Yr Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl">
                <RotateCcw size={16} className="text-[#9d96cb]" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
