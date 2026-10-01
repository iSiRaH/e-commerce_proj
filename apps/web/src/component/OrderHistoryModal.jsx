import {
  X,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

export default function OrderHistoryModal() {
  const { orders, activeModal, closeModals } = useProducts();
  const { user } = useAuth();

  if (activeModal !== 'orders') return null;

  // Filter orders for the user, or show all if none specifically match
  const userOrders = orders.filter((o) => !user?.id || o.userId === user.id || orders.length <= 2);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'SHIPPED':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#f7f4ea]/80">
          <div className="flex items-center gap-2.5">
            <Package size={22} className="text-[#b87c4c]" />
            <div>
              <h2 className="text-xl font-black text-slate-900">My Orders & Tracking</h2>
              <p className="text-xs text-slate-500">
                Tracking history for {user?.name || 'Customer Account'}
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

        {/* Orders List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
                Explore our catalog and place your first order today!
              </p>
              <button
                onClick={closeModals}
                className="bg-[#b87c4c] hover:bg-[#9b643a] text-white text-xs font-bold py-2 px-5 rounded-full transition shadow"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            userOrders.map((order) => (
              <div
                key={order.orderId}
                className="border border-slate-200 rounded-2xl p-5 hover:border-[#b87c4c]/40 transition shadow-sm bg-white"
              >
                {/* Order Top Summary */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        #ORD-{order.orderId}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-black text-slate-900">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {order.paymentMethod || 'Credit Card'} • {order.paymentStatus || 'PAID'}
                    </p>
                  </div>
                </div>

                {/* Progress Tracker Bar */}
                <div className="py-4">
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                    <div className="flex flex-col items-center gap-1 text-emerald-700">
                      <CheckCircle2 size={16} />
                      <span>Order Placed</span>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-1 ${
                        ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(
                          order.orderStatus?.toUpperCase()
                        )
                          ? 'text-emerald-700'
                          : 'text-slate-300'
                      }`}
                    >
                      <Package size={16} />
                      <span>Processing</span>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-1 ${
                        ['SHIPPED', 'DELIVERED'].includes(order.orderStatus?.toUpperCase())
                          ? 'text-emerald-700'
                          : 'text-slate-300'
                      }`}
                    >
                      <Truck size={16} />
                      <span>Shipped</span>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-1 ${
                        order.orderStatus?.toUpperCase() === 'DELIVERED'
                          ? 'text-emerald-700'
                          : 'text-slate-300'
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                      Items in this shipment:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl text-xs"
                        >
                          {item.product?.thumbnail && (
                            <img
                              src={item.product.thumbnail}
                              alt=""
                              className="w-7 h-7 rounded-lg object-cover bg-white"
                            />
                          )}
                          <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                            {item.product?.name || `Product #${item.productId}`}
                          </span>
                          <span className="text-slate-400">×{item.quantity}</span>
                          <span className="font-bold text-slate-700">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
