import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Shield,
  Store,
  LogOut,
  Package,
  Sparkles,
  ChevronDown,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import logo from '../../public/images/logo.png';
import siteName from '../../public/images/SiteName.png';

export default function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, isSeller, isAdmin, role, logout } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setActiveModal,
  } = useProducts();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f7f4ea]/95 backdrop-blur-md border-b border-black/5 shadow-sm transition-all">
      {/* Top Banner: Only if logged in as Admin or Seller, show contextual role status */}
      {isAdmin && (
        <div className="w-full bg-slate-900 text-amber-200 py-1.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
          <Shield size={14} className="text-amber-400" />
          <span>You are browsing as <strong>Platform Admin</strong>.</span>
          <Link
            to="/admin"
            className="bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full hover:bg-amber-300 ml-2"
          >
            Open Admin Dashboard →
          </Link>
        </div>
      )}

      {isSeller && !isAdmin && (
        <div className="w-full bg-indigo-950 text-indigo-200 py-1.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
          <Store size={14} className="text-indigo-400" />
          <span>You are logged in as <strong>Merchant Seller</strong>.</span>
          <Link
            to="/seller"
            className="bg-indigo-500 text-white font-bold px-2.5 py-0.5 rounded-full hover:bg-indigo-400 ml-2"
          >
            Open Seller Portal →
          </Link>
        </div>
      )}

      {/* Welcome / Promotion Strip */}
      {!isAdmin && !isSeller && (
        <div className="w-full bg-[#a8bba3] py-2 px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-slate-900">
            <Sparkles size={16} className="text-amber-800 animate-pulse" />
            <span>Welcome to TouchIT! Touch. Shop. Done. ⚡ Free shipping on orders over $99</span>
            <span className="hidden sm:inline bg-black/10 px-2 py-0.5 rounded-full text-xs font-mono ml-2">
              Code: TOUCH20 for 20% OFF
            </span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo Section */}
          <Link
            to="/"
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={logo}
              alt="TouchIT Logo"
              className="w-14 md:w-16 lg:w-20 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <img
                src={siteName}
                alt="TouchIT"
                className="w-28 md:w-36 lg:w-40 object-contain"
              />
              <p className="text-[#8da588] font-medium text-xs tracking-wider">
                Touch. Shop. Done.
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="w-full lg:max-w-xl">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white border border-slate-300 rounded-full shadow-inner overflow-hidden focus-within:border-[#b87c4c] focus-within:ring-2 focus-within:ring-[#b87c4c]/20 transition-all"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, audio, cameras..."
                className="w-full px-5 py-2.5 bg-transparent outline-none text-sm md:text-base text-slate-800 placeholder-slate-400"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                className="bg-[#9d96cb] hover:bg-[#847cb5] text-slate-900 px-5 py-2.5 flex items-center justify-center transition"
                title="Search"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Role-Specific Shortcuts */}
            {isSeller && (
              <Link
                to="/seller"
                className="hidden sm:flex items-center gap-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-bold px-3.5 py-2 rounded-full border border-indigo-200 transition shadow-sm"
              >
                <Store size={15} />
                <span>Seller Portal</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3.5 py-2 rounded-full border border-amber-300 transition shadow-sm"
              >
                <Shield size={15} />
                <span>Admin Hub</span>
              </Link>
            )}

            {/* My Orders (for buyers or all users) */}
            <button
              onClick={() => setActiveModal('orders')}
              className="hidden sm:flex bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 rounded-full px-3.5 py-2 text-xs font-bold items-center gap-1.5 transition shadow-sm"
            >
              <Package size={15} />
              <span>Orders</span>
            </button>

            {/* Auth Dropdown / Button */}
            {!isAuthenticated ? (
              <button
                onClick={() => setActiveModal('auth')}
                className="bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 rounded-full px-5 py-2 text-xs font-bold transition shadow-sm"
              >
                Sign In / Join
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-sm"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'}
                    alt={user?.name}
                    className="w-6 h-6 rounded-full object-cover border border-white"
                  />
                  <span className="max-w-[90px] truncate">{user?.name}</span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                      isAdmin
                        ? 'bg-amber-600 text-white'
                        : isSeller
                        ? 'bg-indigo-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {role === 'CUSTOMER' ? 'BUYER' : role}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Active Account
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAdmin
                            ? 'bg-amber-100 text-amber-800'
                            : isSeller
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Role: {role === 'CUSTOMER' ? 'BUYER' : role}
                      </span>
                    </div>

                    {/* Role-Specific Portal Links */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-50/70 hover:bg-amber-100 transition"
                      >
                        <Shield size={15} className="text-amber-700" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {isSeller && (
                      <Link
                        to="/seller"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100 transition"
                      >
                        <Store size={15} className="text-indigo-700" />
                        <span>Seller Portal</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setActiveModal('orders');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-[#f7f4ea] transition text-left"
                    >
                      <Package size={15} className="text-[#b87c4c]" />
                      <span>My Orders & Tracking</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setActiveModal('auth');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-[#f7f4ea] transition text-left"
                    >
                      <User size={15} className="text-slate-500" />
                      <span>Switch Account Role</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left font-semibold"
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-[#b87c4c] hover:bg-[#9b643a] text-white rounded-full px-4 py-2 font-bold text-xs transition shadow-md"
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="bg-white text-[#b87c4c] font-black text-[11px] px-1.5 py-0.2 rounded-full ml-0.5">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
