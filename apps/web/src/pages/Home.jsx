import { useState } from "react";
import {
  Menu,
  User,
  ShoppingCart,
  Search,
} from "lucide-react";

import Frame from "../component/ProductFrame";

import logo from "../../public/images/logo.png";
import siteName from "../../public/images/SiteName.png";

const Home = () => {
  const [showCategories, setShowCategories] = useState(false);
  // Sample products for Today Deals
  const todayDeals = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 129.99,
      originalPrice: 169.99,
      discount: 25,
      rating: 4.8,
      reviews: 324,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
      isBestseller: true,
      isNew: true,
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 199.99,
      originalPrice: 299.99,
      discount: 33,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: true,
    },
    {
      id: 3,
      name: "Ultra HD Camera",
      price: 799.99,
      originalPrice: 999.99,
      discount: 20,
      rating: 4.9,
      reviews: 489,
      image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=1200&auto=format&fit=crop",
      isBestseller: true,
      isNew: false,
    },
    {
      id: 4,
      name: "Portable Speaker",
      price: 79.99,
      originalPrice: 129.99,
      discount: 38,
      rating: 4.5,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1589003077984-894e133814c9?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: false,
    },
    {
      id: 5,
      name: "Wireless Earbuds",
      price: 89.99,
      originalPrice: 149.99,
      discount: 40,
      rating: 4.7,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop",
      isBestseller: true,
      isNew: true,
    },
    {
      id: 6,
      name: "Phone Tripod",
      price: 29.99,
      originalPrice: 49.99,
      discount: 40,
      rating: 4.4,
      reviews: 123,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: false,
    },
    {
      id: 7,
      name: "USB-C Hub",
      price: 49.99,
      originalPrice: 79.99,
      discount: 37,
      rating: 4.6,
      reviews: 345,
      image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: true,
    },
    {
      id: 8,
      name: "Phone Stand",
      price: 19.99,
      originalPrice: 34.99,
      discount: 43,
      rating: 4.3,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1563394566578-f8fae67fa0fb?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: false,
    },
  ];

  // Sample products for Trending Deals
  const trendingDeals = [
    {
      id: 9,
      name: "Mechanical Keyboard",
      price: 149.99,
      originalPrice: 199.99,
      discount: 25,
      rating: 4.8,
      reviews: 421,
      image: "https://images.unsplash.com/photo-1587829191301-dc798b83add3?q=80&w=1200&auto=format&fit=crop",
      isBestseller: true,
      isNew: true,
    },
    {
      id: 10,
      name: "Gaming Mouse",
      price: 59.99,
      originalPrice: 99.99,
      discount: 40,
      rating: 4.7,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: false,
    },
    {
      id: 11,
      name: "Monitor Stand",
      price: 89.99,
      originalPrice: 139.99,
      discount: 36,
      rating: 4.5,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: true,
    },
    {
      id: 12,
      name: "Desk Lamp",
      price: 45.99,
      originalPrice: 79.99,
      discount: 42,
      rating: 4.6,
      reviews: 267,
      image: "https://images.unsplash.com/photo-1565636192335-14c01e2335d6?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: false,
    },
    {
      id: 13,
      name: "Phone Case",
      price: 24.99,
      originalPrice: 49.99,
      discount: 50,
      rating: 4.4,
      reviews: 534,
      image: "https://images.unsplash.com/photo-1606933248051-5ce42bebce85?q=80&w=1200&auto=format&fit=crop",
      isBestseller: true,
      isNew: false,
    },
    {
      id: 14,
      name: "Screen Protector",
      price: 14.99,
      originalPrice: 29.99,
      discount: 50,
      rating: 4.5,
      reviews: 678,
      image: "https://images.unsplash.com/photo-1600163509057-ba94a3db4b18?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: true,
    },
    {
      id: 15,
      name: "Cable Organizer",
      price: 12.99,
      originalPrice: 24.99,
      discount: 48,
      rating: 4.3,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1200&auto=format&fit=crop",
      isBestseller: false,
      isNew: false,
    },
    {
      id: 16,
      name: "Webcam",
      price: 99.99,
      originalPrice: 159.99,
      discount: 37,
      rating: 4.7,
      reviews: 289,
      image: "https://images.unsplash.com/photo-1587826922334-403e5d63b672?q=80&w=1200&auto=format&fit=crop",
      isBestseller: true,
      isNew: true,
    },
  ];

  return (
    <div className="bg-[#f7f4ea] min-h-screen w-full overflow-x-hidden">
      {/* Top Bar */}
      <div className="w-full bg-[#a8bba3] py-4 px-4 text-center">
        <p className="font-medium text-sm md:text-lg lg:text-2xl text-black">
          Welcome! TouchIT. Touch. Shop. Done.
        </p>
      </div>

      {/* Header */}
      <div className="w-full px-4 md:px-8 lg:px-16 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Logo"
              className="w-16 md:w-20 lg:w-24 object-contain"
            />

            <div>
              <img
                src={siteName}
                alt="Site Name"
                className="w-32 md:w-40 lg:w-44 object-contain"
              />

              <p className="text-[#a8bba3] text-xs md:text-sm mt-1">
                Touch. Shop. Done.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full lg:max-w-2xl">
            <div className="flex items-center bg-[#f7f4ea] border border-black rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search whatever you need..."
                className="w-full px-5 py-3 bg-transparent outline-none text-sm md:text-base"
              />

              <button className="bg-[#9d96cb] px-5 py-3 flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Account Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="bg-[#ebd9d1] rounded-full px-5 py-2 font-semibold">
              Login
            </button>

            <button className="bg-[#ebd9d1] rounded-full px-5 py-2 font-semibold">
              Sign In
            </button>

            <button className="bg-[#ebd9d1] rounded-full px-5 py-2 font-semibold flex items-center gap-2">
              <User size={20} />
              My Account
            </button>

            <button className="bg-[#ebd9d1] rounded-full px-5 py-2 font-semibold flex items-center gap-2">
              <ShoppingCart size={20} />
              Cart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Category Sidebar */}
          <div 
            className="w-full lg:w-[250px]"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            {/* Menu Button */}
            <div
              className="bg-[#ebd9d1] rounded-full px-4 py-2 flex items-center justify-between mb-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
              onClick={() => setShowCategories(!showCategories)}
            >
              <div className="flex items-center gap-3">
                <Menu size={20} />
                <span className="font-semibold text-sm md:text-base text-black">
                  All Categories
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700 bg-white/60 px-3 py-1 rounded-full">
                  {showCategories ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* Categories */}
            {showCategories && (
              <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-md border border-black/10 mt-2">
                <Frame text="CatItem1" isCategory={true} />
                <Frame text="CatItem2" isCategory={true} />
                <Frame text="CatItem3" isCategory={true} />
                <Frame text="CatItem4" isCategory={true} />
                <Frame text="CatItem5" isCategory={true} />
                <Frame text="CatItem6" isCategory={true} />
                <Frame text="CatItem7" isCategory={true} />
                <Frame text="CatItem8" isCategory={true} />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Nav Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              {["Home", "Product", "About", "Contact"].map((item) => (
                <button
                  key={item}
                  className="bg-[#ebd9d1] rounded-full px-6 py-3 font-semibold text-lg"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Hero Banner */}
            <div className="w-full h-[220px] md:h-[300px] bg-[#b87c4c] rounded-[40px] mb-8"></div>

            {/* Today Deals */}
            <div className="mb-10">
              <div className="bg-[#a8bba3] rounded-lg px-4 py-2 w-full md:w-[300px] mb-4">
                <h2 className="font-semibold text-lg">
                  Today deal’s
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-4">
                {todayDeals.map((product) => (
                  <div key={product.id}>
                    <Frame product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Deals */}
            <div className="mb-10">
              <div className="bg-[#a8bba3] rounded-lg px-4 py-2 w-full md:w-[300px] mb-4">
                <h2 className="font-semibold text-lg">
                  Trending deal’s
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-4">
                {trendingDeals.map((product) => (
                  <div key={product.id}>
                    <Frame product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full h-[120px] bg-[#b87c4c] mt-10"></div>
    </div>
  );
};

export default Home;