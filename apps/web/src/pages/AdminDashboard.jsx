import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Package,
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  Check,
  Edit2,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Layers,
  Lock,
  Mail,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import AuthModal from '../component/AuthModal';
import logo from '../../public/images/logo.png';
import siteName from '../../public/images/SiteName.png';

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const {
    products,
    categories,
    orders,
    createProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    setActiveModal,
  } = useProducts();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'add-product' | 'orders' | 'categories' | 'users'

  // New Product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: '',
    discount: '',
    category: 'Audio',
    brand: 'AudioTech',
    sku: '',
    stockQty: 50,
    weight: 0.5,
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Sample platform users list
  const platformUsers = [
    { id: 1, name: 'Alex Johnson', email: 'buyer@touchit.com', role: 'CUSTOMER', status: 'ACTIVE', ordersCount: 2 },
    { id: 2, name: 'Marcus Vance', email: 'seller@touchit.com', role: 'SELLER', status: 'ACTIVE', productsCount: 16 },
    { id: 3, name: 'Sarah Connor', email: 'admin@touchit.com', role: 'ADMIN', status: 'ACTIVE', permissions: 'ALL' },
  ];

  // Role Guard: Only ADMIN
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f7f4ea] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 shadow-xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Admin Access Required</h2>
          <p className="text-sm text-slate-600 mb-6">
            Access to the Platform Control Center is restricted to <strong>ADMIN</strong> accounts. Your current role is <strong>{user?.role || 'Guest'}</strong>.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveModal('auth')}
              className="bg-[#b87c4c] hover:bg-[#9b643a] text-white font-bold py-3 px-6 rounded-2xl text-sm transition shadow"
            >
              Sign In as Admin (admin@touchit.com)
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
      setActiveTab('products');
      setNewProduct({
        name: '',
        slug: '',
        price: '',
        discount: '',
        category: 'Audio',
        brand: 'AudioTech',
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

  const totalGMV = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-slate-800 font-sans flex flex-col">
      {/* Top Admin Navigation */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="TouchIT" className="w-10 h-10 object-contain" />
              <img src={siteName} alt="TouchIT" className="w-24 object-contain brightness-200 hidden sm:block" />
            </Link>
            <div className="h-5 w-px bg-slate-700 mx-1" />
            <div className="flex items-center gap-2">
              <Shield className="text-amber-400" size={20} />
              <span className="font-extrabold text-sm sm:text-base text-white">
                Admin Control Center
              </span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl transition border border-slate-700"
            >
              <ArrowLeft size={14} />
              <span>View Live Storefront</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-amber-400"
              />
              <div className="hidden md:block text-left text-xs">
                <p className="font-bold text-white truncate max-w-[120px]">{user?.name}</p>
                <p className="text-[10px] text-amber-400">Master Admin</p>
              </div>

              <button
                onClick={() => setActiveModal('auth')}
                className="text-xs text-amber-200 hover:text-white font-bold px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
                title="Switch to Buyer or Seller"
              >
                Switch Role
              </button>

              <button
                onClick={logout}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2.5 py-1.5 hover:bg-slate-800 rounded-xl transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total GMV Sales</p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ${totalGMV.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
              <DollarSign size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Products</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{products.length}</p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <Package size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Orders</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
              <ShoppingBag size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Users</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{platformUsers.length}</p>
            </div>
            <div className="p-3 bg-sky-100 text-sky-800 rounded-xl">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-6 text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'products'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Package size={17} />
            <span>Product Catalog CRUD ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'add-product'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Plus size={17} />
            <span>Add Product (POST /products)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'orders'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShoppingBag size={17} />
            <span>Platform Orders Lifecycle ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'categories'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Layers size={17} />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'users'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Users size={17} />
            <span>User Accounts (RBAC)</span>
          </button>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Live Backend Product Catalog</h3>
                <p className="text-xs text-slate-500">Connected to Express API `/api/v1/products`.</p>
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
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => {
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
                              <p className="text-[11px] text-slate-400">{p.brand || 'TouchIT'}</p>
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
                              {p.stockQty || 50} units
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

        {/* Tab 2: Add Product */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="font-black text-lg text-slate-900 mb-1">Create New Product (POST /products)</h3>
            <p className="text-xs text-slate-500 mb-6">
              Inserts product directly into the backend database catalog.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra ANC Wireless Headphones"
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
                    placeholder="129.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    placeholder="25"
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
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="AudioTech"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newProduct.stockQty}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQty: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="AUDIO-01"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
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
                  placeholder="Full specs and features..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#b87c4c] hover:bg-[#9b643a] text-white rounded-xl font-bold transition shadow"
                >
                  Add Product to Database
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Orders Lifecycle */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">Platform Orders Lifecycle (PATCH /orders/:id)</h3>
            <p className="text-xs text-slate-500 mb-6">Update customer order statuses in real-time.</p>

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
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">User #{ord.userId}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-800">${Number(ord.totalAmount).toFixed(2)}</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      Ship to: <strong>{ord.shippingAddress}</strong>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Method: {ord.shippingMethod || 'Standard'} • Payment: {ord.paymentMethod} ({ord.paymentStatus})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">Change Status:</span>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none focus:border-[#b87c4c]"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Categories */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">Product Category Taxonomy</h3>
            <p className="text-xs text-slate-500 mb-6">Configured categories matching Prisma Category schema.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div key={c.id || c.name} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">slug: {c.slug}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Users & RBAC */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">User Accounts & Roles (RBAC)</h3>
              <p className="text-xs text-slate-500">Manage user roles: CUSTOMER (Buyer), SELLER, and ADMIN.</p>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {platformUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'SELLER'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3.5">
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <UserCheck size={14} />
                        Active
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-slate-500">
                      {u.ordersCount ? `${u.ordersCount} orders` : u.productsCount ? `${u.productsCount} listings` : 'Full System Access'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <AuthModal />
    </div>
  );
}
