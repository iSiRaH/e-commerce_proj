import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function HeroBanner() {
  const { products, openProductDetail } = useProducts();
  const { addToCart } = useCart();

  // Featured hero spotlight item: Premium Wireless Headphones
  const spotlightProduct = products[0] || {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 129.99,
    discount: 25,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
  };

  const scrollToDeals = () => {
    const el = document.getElementById('today-deals');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full rounded-[36px] overflow-hidden bg-gradient-to-br from-[#b87c4c] via-[#a36838] to-[#7c4820] text-white p-6 sm:p-8 md:p-12 mb-10 shadow-2xl">
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline, Copy & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-amber-100 w-fit mb-4"
          >
            <Sparkles size={16} className="text-amber-300" />
            <span>2026 Collection — Next-Gen Electronics & Everyday Essentials</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-4"
          >
            Touch. Shop. <span className="text-amber-200 underline decoration-wavy decoration-amber-300/60">Done.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/85 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-normal"
          >
            Immerse yourself in precision-crafted audio gear, wearables, 4K cameras, and ergonomic workspace accessories. Backed by express shipping and verified warranty.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            <button
              onClick={scrollToDeals}
              className="bg-white hover:bg-amber-50 text-[#7c4820] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group text-base"
            >
              <span>Explore Today's Deals</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={scrollToCatalog}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold px-6 py-3.5 rounded-full transition-all text-base"
            >
              Browse Full Catalog
            </button>
          </motion.div>

          {/* Trust Value Props */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/15 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-amber-300 shrink-0" />
              <span>Free Delivery &gt;$99</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-300 shrink-0" />
              <span>1-Year Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={18} className="text-amber-300 shrink-0" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Spotlight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden group">
            {/* Top Deal Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Featured Spotlight
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-200 bg-black/20 px-3 py-1 rounded-full">
                <Clock size={14} />
                <span>Limited Quantities</span>
              </div>
            </div>

            {/* Product Image Frame */}
            <div
              onClick={() => openProductDetail(spotlightProduct)}
              className="relative aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden bg-white/20 mb-4 cursor-pointer"
            >
              <img
                src={spotlightProduct.thumbnail}
                alt={spotlightProduct.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                -{spotlightProduct.discount}% OFF
              </div>
            </div>

            {/* Product Info */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg sm:text-xl text-white truncate mr-2">
                {spotlightProduct.name}
              </h3>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-amber-200">
                  ${spotlightProduct.price}
                </span>
              </div>
            </div>

            <p className="text-white/70 text-xs sm:text-sm line-clamp-2 mb-4">
              {spotlightProduct.description || 'Studio-grade acoustics with active noise cancellation and ultra-lightweight ergonomic headband.'}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => addToCart(spotlightProduct)}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-md hover:shadow-lg text-center"
              >
                Add to Cart
              </button>
              <button
                onClick={() => openProductDetail(spotlightProduct)}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"
              >
                View
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
