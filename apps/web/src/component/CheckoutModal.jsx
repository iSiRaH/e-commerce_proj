import { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

export default function CheckoutModal() {
  const {
    cartItems,
    subtotal,
    promoDiscount,
    shippingCost,
    tax,
    totalAmount,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const { activeModal, closeModals, placeOrder, setActiveModal } = useProducts();

  const [step, setStep] = useState(1); // 1: Info & Shipping, 2: Payment, 3: Confirmation
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'customer@example.com',
    phone: user?.phone || '+1 (555) 382-9104',
    address: user?.address || '742 Evergreen Terrace',
    city: 'Springfield',
    postalCode: '97477',
    shippingMethod: 'Standard Delivery',
    paymentMethod: 'Credit Card',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '123',
  });

  if (activeModal !== 'checkout') return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      userId: user?.id || 1,
      totalAmount,
      subtotal,
      discount: promoDiscount || 0,
      tax,
      shippingCost,
      shippingAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`,
      billingAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`,
      shippingMethod: formData.shippingMethod,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
      orderStatus: 'PENDING',
      status: 'PROCESSING',
      orderItems: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        total: item.price * item.quantity,
        product: {
          id: item.id,
          name: item.name,
          thumbnail: item.thumbnail,
        },
      })),
    };

    const placed = await placeOrder(orderPayload);
    setIsSubmitting(false);

    if (placed) {
      setCreatedOrder(placed);
      clearCart();
      setStep(3); // Confirmation step
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#f7f4ea]/80">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {step === 3 ? 'Order Confirmed!' : 'Express Checkout'}
            </h2>
            <p className="text-xs text-slate-500">
              {step === 1 && 'Step 1 of 2: Shipping Details'}
              {step === 2 && 'Step 2 of 2: Payment & Review'}
              {step === 3 && 'Thank you for shopping with TouchIT'}
            </p>
          </div>

          <button
            onClick={closeModals}
            className="p-2 rounded-full hover:bg-white text-slate-500 hover:text-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <form
              id="shipping-form"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                1. Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#b87c4c]"
                  />
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pt-3">
                2. Shipping Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                    formData.shippingMethod === 'Standard Delivery'
                      ? 'border-[#b87c4c] bg-[#ebd9d1]/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="Standard Delivery"
                      checked={formData.shippingMethod === 'Standard Delivery'}
                      onChange={handleInputChange}
                      className="accent-[#b87c4c]"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Standard Delivery</p>
                      <p className="text-xs text-slate-500">3-5 business days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                    formData.shippingMethod === 'Express Delivery'
                      ? 'border-[#b87c4c] bg-[#ebd9d1]/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="Express Delivery"
                      checked={formData.shippingMethod === 'Express Delivery'}
                      onChange={handleInputChange}
                      className="accent-[#b87c4c]"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Express Priority</p>
                      <p className="text-xs text-slate-500">1-2 business days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">$14.99</span>
                </label>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Select Payment Method
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex flex-col items-center gap-2 ${
                      formData.paymentMethod === method
                        ? 'border-[#b87c4c] bg-[#ebd9d1]/40 text-[#7c4820]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>{method}</span>
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'Credit Card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      name="cardNumber"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={formData.cardExp}
                        onChange={handleInputChange}
                        name="cardExp"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        name="cardCvc"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary box */}
              <div className="bg-[#f7f4ea] p-4 rounded-2xl border border-black/5 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-black/10">
                  <span>Total Due</span>
                  <span className="text-[#b87c4c]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && createdOrder && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Order #{createdOrder.orderId} Placed!
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
                Your order is confirmed and is currently being processed. A receipt has been saved to your account.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Status:</span>
                  <span className="font-bold text-amber-600 uppercase">
                    {createdOrder.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Amount:</span>
                  <span className="font-bold text-slate-900">
                    ${createdOrder.totalAmount?.toFixed(2) || totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping Address:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">
                    {createdOrder.shippingAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-bold text-emerald-600">
                    {createdOrder.paymentMethod} ({createdOrder.paymentStatus})
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    closeModals();
                    setActiveModal('orders');
                  }}
                  className="bg-[#b87c4c] hover:bg-[#9b643a] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition shadow"
                >
                  View My Orders
                </button>
                <button
                  onClick={closeModals}
                  className="bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800 font-bold py-2.5 px-6 rounded-xl text-sm transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 3 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2"
              >
                Back to Address
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Lock size={14} className="text-[#a8bba3]" />
                <span>256-Bit Encrypted Checkout</span>
              </div>
            )}

            {step === 1 ? (
              <button
                form="shipping-form"
                type="submit"
                className="bg-[#b87c4c] hover:bg-[#9b643a] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition flex items-center gap-2 shadow"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitOrder}
                className="bg-[#b87c4c] hover:bg-[#9b643a] disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition flex items-center gap-2 shadow"
              >
                <span>{isSubmitting ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}</span>
                <ShieldCheck size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
