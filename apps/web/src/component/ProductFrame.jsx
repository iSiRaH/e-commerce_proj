import {
  ShoppingCart,
  Heart,
  Eye,
  Star,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function ProductCard({ text, product: customProduct, isCategory = false }) {
  const [wishlist, setWishlist] = useState(false);
  const { addToCart } = useCart();
  const { openProductDetail } = useProducts();

  // Render category frame fallback
  if (isCategory) {
    return (
      <div className="rounded-xl bg-[#ebd9d1] px-4 py-3 text-center font-bold text-slate-800 shadow-sm hover:shadow-md hover:bg-[#dfc3b7] transition cursor-pointer">
        {text}
      </div>
    );
  }

  // Default product data fallback
  const defaultProduct = {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 129.99,
    discount: 25,
    rating: 4.8,
    reviews: 324,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    brand: 'AudioTech',
    category: 'Audio',
    stockQty: 50,
    isBestseller: true,
    isNew: true,
  };

  const product = customProduct || defaultProduct;
  const imageSrc = product.thumbnail || product.image || defaultProduct.thumbnail;
  const calculatedOriginalPrice =
    product.originalPrice ||
    (product.discount
      ? (product.price / (1 - product.discount / 100)).toFixed(2)
      : product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:border-[#b87c4c]/40"
    >
      <div>
        {/* Image & Action Overlay */}
        <div
          onClick={() => openProductDetail(product)}
          className="relative overflow-hidden bg-slate-100 aspect-[4/4] cursor-pointer"
        >
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 transition duration-300 group-hover:opacity-100" />

          {/* Badges on Top-Left */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {product.discount > 0 && (
              <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow-md">
                -{product.discount}% OFF
              </span>
            )}

            {product.isBestseller && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                <Sparkles size={11} />
                Bestseller
              </span>
            )}

            {product.isNew && (
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                New
              </span>
            )}
          </div>

          {/* Action Buttons Top-Right */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 z-10 opacity-90 sm:opacity-0 transition duration-300 group-hover:opacity-100">
            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setWishlist(!wishlist);
              }}
              title="Add to Wishlist"
              className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-md backdrop-blur-md transition ${
                wishlist ? 'bg-rose-600 text-white' : 'bg-white/90 text-slate-700 hover:bg-white'
              }`}
            >
              <Heart className={wishlist ? 'fill-current' : ''} size={17} />
            </button>

            {/* Quick View */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openProductDetail(product);
              }}
              title="Quick View"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-md backdrop-blur-md transition hover:bg-white hover:text-[#b87c4c]"
            >
              <Eye size={17} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-4">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#8da588]">
              {product.brand || 'TouchIT'}
            </span>
            <span className="text-slate-400 truncate max-w-[100px]">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => openProductDetail(product)}
            className="mb-2 line-clamp-2 text-sm sm:text-base font-bold text-slate-800 hover:text-[#b87c4c] transition cursor-pointer min-h-[2.5rem]"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.rating || 4.7}</span>
              <span className="text-slate-400">({product.reviews || 120})</span>
            </div>

            {product.stockQty && product.stockQty <= 20 ? (
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                Only {product.stockQty} left
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 font-medium">
                <BadgeCheck size={13} className="text-emerald-600" />
                In Stock
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>

            {product.discount > 0 && (
              <span className="text-xs text-slate-400 line-through">
                ${calculatedOriginalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add To Cart Button */}
      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ebd9d1] hover:bg-[#b87c4c] hover:text-white py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-800 transition-colors shadow-sm"
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </motion.button>
      </div>
    </motion.div>
  );
}