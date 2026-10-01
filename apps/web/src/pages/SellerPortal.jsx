import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Package,
  Plus,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Check,
  Edit2,
  Trash2,
  ArrowLeft,
  Truck,
  Layers,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import AuthModal from '../component/AuthModal';
import logo from '../../public/images/logo.png';
import siteName from '../../public/images/SiteName.png';

export default function SellerPortal() {
  const { user, isSeller, isAdmin, logout } = useAuth();
  const {
    products,
    categories,
    orders,
    createProduct,
    updateProduct,
    deleteProduct,
    setActiveModal,
  } = useProducts();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'add-product' | 'orders'

  // Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: '',
    discount: '',
    category: 'Audio',
    brand: user?.name ? user.name.replace(/\s*\(Seller\)/i, '') : 'Merchant Gear',
    sku: '',
    stockQty: 50,
    weight: 0.5,
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Role Guard: Only SELLER or ADMIN
  const hasAccess = isSeller || isAdmin;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#f7f4ea] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 shadow-xl">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Seller Portal Restricted</h2>
          <p className="text-sm text-slate-600 mb-6">
            You are currently logged in as a <strong>{user?.role || 'Guest'}</strong>. A <strong>SELLER</strong> role is required to access the Merchant Portal.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveModal('auth')}
              className="bg-[#b87c4c] hover:bg-[#9b643a] text-white font-bold py-3 px-6 rounded-2xl text-sm transition shadow"
            >
              Sign In as Seller (seller@touchit.com)
            </button>
            <Link
              to="/"
              className="bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 font-bold py-3 px-6 rounded-2xl text-sm transition text-center"
            >
              Back to Buyer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter seller's products (or display products for this merchant)
  const sellerProducts = products;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...newProduct,
      slug: newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: parseFloat(newProduct.price),
      discount: newProduct.discount ? parseFloat(newProduct.discount) : 0,
      stockQty: parseInt(newProduct.stockQty, 10) || 10,
      weight: parseFloat(newProduct.weight) || 0.1,
      sku: newProduct.sku || `SKU-${Date.now().toString().slice(-4)}`,
    };

    const ok = await createProduct(payload);
    if (ok) {
      setActiveTab('inventory');
      setNewProduct({
        name: '',
        slug: '',
        price: '',
        discount: '',
        category: 'Audio',
        brand: user?.name ? user.name.replace(/\s*\(Seller\)/i, '') : 'Merchant Gear',
        sku: '',
        stockQty: 50,
        weight: 0.5,
        thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop',
        description: '',
      });
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stockQty || 50);
  };

  const saveEdit = async (id) => {
    await updateProduct(id, {
      price: parseFloat(editPrice),
      stockQty: parseInt(editStock, 10),
    });
    setEditingId(null);
  };

  const totalUnits = sellerProducts.reduce((acc, p) => acc + (p.stockQty || 0), 0);
  const totalValue = sellerProducts.reduce((acc, p) => acc + p.price * (p.stockQty || 0), 0);

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-slate-800 font-sans flex flex-col">
      {/* Top Seller Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="TouchIT" className="w-10 h-10 object-contain" />
              <img src={siteName} alt="TouchIT" className="w-24 object-contain hidden sm:block" />
            </Link>
            <div className="h-5 w-px bg-slate-300 mx-1" />
            <div className="flex items-center gap-2">
              <Store className="text-[#b87c4c]" size={20} />
              <span className="font-extrabold text-sm sm:text-base text-slate-900">
                Seller Merchant Portal
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                SELLER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="flex items-center gap-1.5 bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition"
            >
              <ArrowLeft size={14} />
              <span>Browse Storefront</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'}
                alt=""
                className="w-8 h-8 rounded-full object-cover border"
              />
              <div className="hidden md:block text-left text-xs">
                <p className="font-bold text-slate-900 truncate max-w-[120px]">{user?.name}</p>
                <p className="text-[10px] text-slate-500">Merchant Account</p>
              </div>

              <button
                onClick={() => setActiveModal('auth')}
                className="text-xs text-slate-600 hover:text-slate-900 font-bold px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                title="Switch to Buyer or Admin"
              >
                Switch Role
              </button>

              <button
                onClick={logout}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2.5 py-1.5 hover:bg-rose-50 rounded-xl transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Listed Products
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{sellerProducts.length}</p>
            </div>
            <div className="p-3 bg-[#ebd9d1] text-[#7c4820] rounded-xl">
              <Package size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Stock On Hand
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalUnits} units</p>
            </div>
            <div className="p-3 bg-[#a8bba3]/40 text-[#4c6248] rounded-xl">
              <Layers size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Catalog Inventory Value
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <DollarSign size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Orders to Fulfill
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
              <Truck size={22} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'inventory'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Package size={17} />
            <span>My Inventory & Listings</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'add-product'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Plus size={17} />
            <span>List New Product for Sale</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'orders'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Truck size={17} />
            <span>Orders to Fulfill ({orders.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Merchant Product Inventory</h3>
                <p className="text-xs text-slate-500">Edit prices, adjust stock levels, or retire items.</p>
              </div>
              <button
                onClick={() => setActiveTab('add-product')}
                className="bg-[#b87c4c] hover:bg-[#9b643a] text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Plus size={15} />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">SKU</th>
                    <th className="p-3.5">Selling Price</th>
                    <th className="p-3.5">Available Stock</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerProducts.map((p) => {
                    const isEditing = editingId === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.thumbnail || p.image}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                              <p className="text-[11px] text-slate-400">{p.brand || 'Merchant Item'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-medium text-slate-600">{p.category}</td>
                        <td className="p-3.5 font-mono text-slate-500">{p.sku || `SKU-${p.id}`}</td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-20 p-1 border rounded text-xs bg-white"
                            />
                          ) : (
                            `$${Number(p.price).toFixed(2)}`
                          )}
                        </td>
                        <td className="p-3.5">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="w-16 p-1 border rounded text-xs bg-white"
                            />
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                (p.stockQty || 50) < 20
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.stockQty || 50} in stock
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isEditing ? (
                              <button
                                onClick={() => saveEdit(p.id)}
                                className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                              >
                                <Check size={14} />
                              </button>
                            ) : (
                              <button
                                onClick={() => startEdit(p)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                title="Edit Price & Stock"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}

                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'add-product' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="font-black text-lg text-slate-900 mb-1">List a New Product for Sale</h3>
            <p className="text-xs text-slate-500 mb-6">
              Create a new listing in the TouchIT marketplace. Product will be immediately live.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Ergonomic Vertical Mouse"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="79.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newProduct.stockQty}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQty: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.thumbnail}
                  onChange={(e) => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Full specs, compatibility, and highlights..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#b87c4c] hover:bg-[#9b643a] text-white rounded-xl font-bold transition shadow"
                >
                  Publish Listing to Store
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">Customer Orders to Ship</h3>
            <p className="text-xs text-slate-500 mb-6">Fulfill customer packages and ship out on time.</p>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        #ORD-{ord.orderId}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      Deliver to: <strong>{ord.shippingAddress}</strong>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Method: {ord.shippingMethod || 'Standard'} • Total: ${Number(ord.totalAmount).toFixed(2)}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Payment Verified ({ord.paymentStatus})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AuthModal />
    </div>
  );
}
