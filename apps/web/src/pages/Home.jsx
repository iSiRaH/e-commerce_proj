import { useState } from 'react';
import {
  Flame,
  TrendingUp,
  SlidersHorizontal,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import Header from '../component/Header';
import HeroBanner from '../component/HeroBanner';
import CategorySidebar from '../component/CategorySidebar';
import CategoryPills from '../component/CategoryPills';
import Frame from '../component/ProductFrame';
import Footer from '../component/Footer';
import ProductDetailModal from '../component/ProductDetailModal';
import CartDrawer from '../component/CartDrawer';
import CheckoutModal from '../component/CheckoutModal';
import AuthModal from '../component/AuthModal';
import OrderHistoryModal from '../component/OrderHistoryModal';
import { useProducts } from '../context/ProductContext';

export default function Home() {
  const [showCategories, setShowCategories] = useState(false);
  const {
    products,
    todayDeals,
    trendingDeals,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useProducts();

  const isFiltering = !!selectedCategory || !!searchQuery.trim();

  return (
    <div className="bg-[#f7f4ea] min-h-screen w-full overflow-x-hidden flex flex-col font-sans">
      {/* Dynamic Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Navigation Bar / Quick Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className={`rounded-full px-5 py-2 font-bold text-sm transition shadow-sm ${
                !selectedCategory && !searchQuery
                  ? 'bg-[#b87c4c] text-white shadow'
                  : 'bg-[#ebd9d1] text-slate-800 hover:bg-[#dfc3b7]'
              }`}
            >
              All Products
            </button>

            <a
              href="#today-deals"
              className="bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 rounded-full px-5 py-2 font-bold text-sm transition shadow-sm flex items-center gap-1.5"
            >
              <Flame size={15} className="text-amber-700" />
              <span>Today's Deals</span>
            </a>

            <a
              href="#trending-deals"
              className="bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 rounded-full px-5 py-2 font-bold text-sm transition shadow-sm flex items-center gap-1.5"
            >
              <TrendingUp size={15} className="text-[#8da588]" />
              <span>Trending</span>
            </a>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-bold text-slate-900"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Layout: Category Sidebar + Main Showcase */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <CategorySidebar
            showCategories={showCategories}
            setShowCategories={setShowCategories}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Show HeroBanner when not performing active search/category filter */}
            {!isFiltering && <HeroBanner />}

            {/* Quick Horizontal Category Pills */}
            <CategoryPills />

            {/* Active Filter Bar when search or category is active */}
            {isFiltering && (
              <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Filtering By:
                  </span>
                  {selectedCategory && (
                    <span className="bg-[#b87c4c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span>Category: {selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="hover:text-amber-200"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-[#9d96cb] text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span>"{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="hover:text-slate-700"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    {filteredProducts.length} items found
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Filtered Results Catalog View */}
            {isFiltering ? (
              <div className="mb-12">
                <div className="bg-[#a8bba3] rounded-2xl px-5 py-2.5 w-fit mb-6 shadow-sm">
                  <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                    <Layers size={20} />
                    <span>Matching Products ({filteredProducts.length})</span>
                  </h2>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                    <p className="text-lg font-bold text-slate-800 mb-1">
                      No matching products found
                    </p>
                    <p className="text-sm text-slate-500 mb-4">
                      Try searching with different keywords or clear your current category filter.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery('');
                      }}
                      className="bg-[#b87c4c] text-white text-xs font-bold py-2.5 px-6 rounded-full shadow"
                    >
                      Reset Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredProducts.map((product) => (
                      <Frame key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Section 1: Today Deals */}
                <section id="today-deals" className="mb-14 scroll-mt-24">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-[#a8bba3] rounded-2xl px-5 py-2.5 shadow-sm">
                      <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                        <Flame size={20} className="text-amber-800" />
                        <span>Today's Deal's</span>
                      </h2>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/70 border border-amber-300/40 px-3 py-1.5 rounded-full">
                      <Sparkles size={14} className="text-amber-700" />
                      <span>Limited Flash Discounts</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {todayDeals.map((product) => (
                      <Frame key={product.id} product={product} />
                    ))}
                  </div>
                </section>

                {/* Section 2: Trending Deals */}
                <section id="trending-deals" className="mb-14 scroll-mt-24">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-[#a8bba3] rounded-2xl px-5 py-2.5 shadow-sm">
                      <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                        <TrendingUp size={20} className="text-slate-800" />
                        <span>Trending Deal's</span>
                      </h2>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      Popular Customer Favorites
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {trendingDeals.map((product) => (
                      <Frame key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modern E-Commerce Footer replacing empty brown div */}
      <Footer />

      {/* Global Interactive Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      <OrderHistoryModal />
    </div>
  );
}