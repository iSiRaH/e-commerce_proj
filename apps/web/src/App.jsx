import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SellerPortal from './pages/SellerPortal';
import AdminDashboard from './pages/AdminDashboard';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

// Dynamic Role-Based Index Page Component
function RoleBasedIndex() {
  const { isSeller, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ea] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#b87c4c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. Admin Index -> Admin Dashboard
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // 2. Seller Index -> Seller Merchant Portal
  if (isSeller) {
    return <SellerPortal />;
  }

  // 3. Buyer Index -> Customer Shopping Storefront
  return <Home />;
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <Router>
              <Routes>
                {/* Dynamic Role-Based Index: Displays unique index page for Buyer, Seller, or Admin */}
                <Route path="/" element={<RoleBasedIndex />} />

                {/* Direct dedicated routes */}
                <Route path="/shop" element={<Home />} />
                <Route path="/product/:id" element={<Home />} />
                <Route path="/seller" element={<SellerPortal />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Catch-all fallback to Role Index */}
                <Route path="*" element={<RoleBasedIndex />} />
              </Routes>
            </Router>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
