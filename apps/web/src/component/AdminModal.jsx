import { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Package,
  Layers,
  Save,
  Check,
  Shield,
  ShoppingBag,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

export default function AdminModal() {
  const {
    products,
    categories,
    orders,
    activeModal,
    closeModals,
    createProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
  } = useProducts();

  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('products'); // 'products' | 'new-product' | 'orders'

  // New Product form state matching backend product schema
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: '',
    discount: '',
    category: 'Audio',
    brand: '',
    sku: '',
    stockQty: 50,
    weight: 0.5,
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop',
    description: '',
  });

  // Editing product inline
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  if (activeModal !== 'admin') return null;

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
      setTab('products');
      setNewProduct({
        name: '',
        slug: '',
        price: '',
        discount: '',
        category: 'Audio',
        brand: '',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">Admin Control Hub</h2>
                <span className="bg-amber-200 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  Backend API CRUD
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage live product inventory, seed catalog items, and customer order statuses
              </p>
            </div>
          </div>

          <button
            onClick={closeModals}
            className="p-2 rounded-full hover:bg-white text-slate-500 hover:text-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 gap-4 text-xs font-bold">
          <button
            onClick={() => setTab('products')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              tab === 'products'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Package size={15} />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setTab('new-product')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              tab === 'new-product'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Plus size={15} />
            <span>Add New Product (POST /products)</span>
          </button>

          <button
            onClick={() => setTab('orders')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              tab === 'orders'
                ? 'border-[#b87c4c] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShoppingBag size={15} />
            <span>Manage Orders ({orders.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Database Catalog
                </span>
                <button
                  onClick={() => setTab('new-product')}
                  className="bg-[#b87c4c] hover:bg-[#9b643a] text-white text-xs font-bold py-1.5 px-3.5 rounded-xl flex items-center gap-1 transition shadow-sm"
                >
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => {
                      const isEditing = editingId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.thumbnail || p.image}
                                alt=""
                                className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                                <p className="text-[10px] text-slate-400">{p.brand || 'TouchIT'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-slate-600">{p.category}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">
                            {p.sku || `SKU-${p.id}`}
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-18 p-1 border rounded text-xs bg-white"
                              />
                            ) : (
                              `$${Number(p.price).toFixed(2)}`
                            )}
                          </td>
                          <td className="p-3">
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
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEditing ? (
                                <button
                                  onClick={() => saveEdit(p.id)}
                                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                                  title="Save Changes"
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

          {tab === 'new-product' && (
            <form onSubmit={handleCreateSubmit} className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                New Product Parameters (Prisma Schema Match)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ergonomic Studio Headset"
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

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="99.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
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
                  <label className="block font-semibold text-slate-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    placeholder="AudioTech"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newProduct.stockQty}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQty: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="AUDIO-NEW-01"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.thumbnail}
                    onChange={(e) => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Full product overview..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setTab('products')}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#b87c4c] hover:bg-[#9b643a] text-white rounded-xl text-xs font-bold transition shadow"
                >
                  Save & Publish to Catalog
                </button>
              </div>
            </form>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Customer Orders Lifecycle Management
              </span>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {orders.map((ord) => (
                  <div key={ord.orderId} className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          #ORD-{ord.orderId}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">User #{ord.userId}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Amount: <strong className="text-slate-900">${Number(ord.totalAmount).toFixed(2)}</strong> ({ord.paymentMethod})
                      </p>
                      <p className="text-slate-400 text-[11px] truncate max-w-sm mt-0.5">
                        Ship to: {ord.shippingAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] font-semibold">Status:</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white outline-none focus:border-[#b87c4c]"
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
        </div>
      </div>
    </div>
  );
}
