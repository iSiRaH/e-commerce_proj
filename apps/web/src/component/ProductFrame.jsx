import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Eye,
  Star,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ProductCard() {
  const [wishlist, setWishlist] = useState(false);

  const product = {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 129.99,
    originalPrice: 169.99,
    discount: 25,
    rating: 4.8,
    reviews: 324,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    isBestseller: true,
    isNew: true,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
    >
      <Link to={`/product/${product.id}`}>
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 aspect-[4/5]">
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 transition duration-300 group-hover:opacity-100"></div>

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.discount && (
              <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                -{product.discount}% OFF
              </span>
            )}

            {product.isBestseller && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                <Sparkles size={14} />
                Bestseller
              </span>
            )}

            {product.isNew && (
              <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                New Arrival
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setWishlist(!wishlist);
              }}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg backdrop-blur-md transition ${
                wishlist
                  ? "bg-orange-600 text-white"
                  : "bg-white/80 text-gray-700"
              }`}
            >
              <Heart
                className={`${wishlist ? "fill-current" : ""}`}
                size={20}
              />
            </button>

            {/* Quick View */}
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-gray-700 shadow-lg backdrop-blur-md transition hover:bg-white">
              <Eye size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col p-5">
          {/* Rating */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={
                    index < Math.floor(product.rating)
                      ? "fill-orange-500 text-orange-500"
                      : "text-gray-300"
                  }
                />
              ))}

              <span className="ml-1 text-sm text-gray-500">
                ({product.reviews})
              </span>
            </div>

            <BadgeCheck className="text-emerald-600" size={20} />
          </div>

          {/* Product Name */}
          <h3 className="mb-4 line-clamp-2 text-lg font-semibold text-gray-800">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>

            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          </div>

          {/* Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}