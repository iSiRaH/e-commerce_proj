import { useState } from 'react';
import {
  Mail,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import logo from '../../public/images/logo.png';
import siteName from '../../public/images/SiteName.png';

export default function Footer() {
  const { categories, setSelectedCategory } = useProducts();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Thank you for subscribing to TouchIT updates!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#3b2717] text-white/80 pt-16 pb-10 border-t border-black/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl text-amber-300">
              <Truck size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">Free Express Delivery</p>
              <p className="text-xs text-white/60">On all orders over $99</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl text-amber-300">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">2-Year Official Warranty</p>
              <p className="text-xs text-white/60">100% genuine products</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl text-amber-300">
              <RotateCcw size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">30-Day Hassle Returns</p>
              <p className="text-xs text-white/60">Instant refund guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl text-amber-300">
              <Headphones size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">24/7 Verified Support</p>
              <p className="text-xs text-white/60">Dedicated tech specialists</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="TouchIT" className="w-12 h-12 object-contain" />
              <img src={siteName} alt="TouchIT" className="w-32 brightness-200" />
            </div>

            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              TouchIT delivers state-of-the-art consumer technology, audio acoustics, smart wearables, and workspaces accessories directly to your doorstep.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-2">
                Subscribe for exclusive discounts & VIP releases
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-amber-300"
                />
                <button
                  type="submit"
                  className="bg-[#b87c4c] hover:bg-[#a36838] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 shadow-md"
                >
                  <Send size={15} />
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-amber-300 mt-2 flex items-center gap-1">
                  <CheckCircle2 size={13} /> You are subscribed!
                </p>
              )}
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id || cat.name}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#today-deals" className="hover:text-amber-300 transition">
                  Today's Deals
                </a>
              </li>
              <li>
                <a href="#trending-deals" className="hover:text-amber-300 transition">
                  Trending Gear
                </a>
              </li>
              <li>
                <span className="hover:text-amber-300 transition cursor-pointer">
                  Track Your Package
                </span>
              </li>
              <li>
                <span className="hover:text-amber-300 transition cursor-pointer">
                  Return & Exchange Policy
                </span>
              </li>
              <li>
                <span className="hover:text-amber-300 transition cursor-pointer">
                  Help Center & FAQs
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <div className="space-y-2 text-xs text-white/70">
              <p>TouchIT Global HQ</p>
              <p>support@touchit.com</p>
              <p>+1 (800) 555-TOUCH</p>
              <p className="text-[11px] text-white/50 pt-2">
                Mon - Fri: 8:00 AM - 9:00 PM EST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} TouchIT Corporation. All rights reserved.</p>

          <div className="flex items-center gap-4 text-white/60">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Security Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
