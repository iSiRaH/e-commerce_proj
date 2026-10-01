import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, User, MapPin, Phone, Shield, Store, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

export default function AuthModal() {
  const { login, register } = useAuth();
  const { activeModal, closeModals } = useProducts();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    role: 'CUSTOMER', // 'CUSTOMER' | 'SELLER'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeModal !== 'auth') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (mode === 'login') {
      const user = await login(formData.email, formData.password);
      if (user) {
        closeModals();
        navigate('/');
      }
    } else {
      const user = await register(formData);
      if (user) {
        closeModals();
        navigate('/');
      }
    }
    setIsSubmitting(false);
  };

  const handleRoleQuickLogin = async (email, password = 'password123') => {
    setIsSubmitting(true);
    const user = await login(email, password);
    setIsSubmitting(false);
    if (user) {
      closeModals();
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Header Tabs */}
        <div className="p-6 pb-0 flex items-center justify-between">
          <div className="flex gap-4 border-b border-slate-100 w-full">
            <button
              onClick={() => setMode('login')}
              className={`pb-3 text-sm font-bold transition border-b-2 ${
                mode === 'login'
                  ? 'border-[#b87c4c] text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`pb-3 text-sm font-bold transition border-b-2 ${
                mode === 'register'
                  ? 'border-[#b87c4c] text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={closeModals}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition -mt-3"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {mode === 'register' && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      formData.role === 'CUSTOMER'
                        ? 'border-[#b87c4c] bg-[#ebd9d1]/30 text-[#7c4820]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="CUSTOMER"
                      checked={formData.role === 'CUSTOMER'}
                      onChange={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                      className="accent-[#b87c4c]"
                    />
                    <ShoppingBag size={15} />
                    <span>Buyer / Customer</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      formData.role === 'SELLER'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="SELLER"
                      checked={formData.role === 'SELLER'}
                      onChange={() => setFormData({ ...formData, role: 'SELLER' })}
                      className="accent-indigo-600"
                    />
                    <Store size={15} />
                    <span>Merchant / Seller</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Street Address, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#b87c4c] hover:bg-[#9b643a] disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow mt-2"
          >
            {isSubmitting ? 'Authenticating...' : mode === 'login' ? 'Sign In to TouchIT' : 'Register Account'}
          </button>
        </form>

        {/* Quick Role-Based Logins */}
        <div className="p-6 pt-0 border-t border-slate-100 mt-1 bg-slate-50/60">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center my-3">
            Quick Role-Based Authentication
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleRoleQuickLogin('buyer@touchit.com')}
              disabled={isSubmitting}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold py-2 px-2 rounded-xl transition flex flex-col items-center gap-1 shadow-sm"
              title="buyer@touchit.com"
            >
              <User size={15} className="text-[#b87c4c]" />
              <span>Buyer</span>
            </button>

            <button
              onClick={() => handleRoleQuickLogin('seller@touchit.com')}
              disabled={isSubmitting}
              className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-[11px] font-bold py-2 px-2 rounded-xl transition flex flex-col items-center gap-1 shadow-sm"
              title="seller@touchit.com"
            >
              <Store size={15} className="text-indigo-600" />
              <span>Seller</span>
            </button>

            <button
              onClick={() => handleRoleQuickLogin('admin@touchit.com')}
              disabled={isSubmitting}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold py-2 px-2 rounded-xl transition flex flex-col items-center gap-1 shadow-sm"
              title="admin@touchit.com"
            >
              <Shield size={15} className="text-amber-700" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
