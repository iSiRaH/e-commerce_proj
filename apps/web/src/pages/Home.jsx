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
  const todayDeals = Array(8).fill(0);
  const trendingDeals = Array(8).fill(0);

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
          <div className="w-full lg:w-[250px]">
            {/* Menu Button */}
            <div className="bg-[#ebd9d1] rounded-full px-5 py-3 flex justify-end mb-4">
              <Menu size={24} />
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-2">
              <Frame text="CatItem1" />
              <Frame text="CatItem2" />
              <Frame text="CatItem3" />
              <Frame text="CatItem4" />
              <Frame text="CatItem5" />
              <Frame text="CatItem6" />
              <Frame text="CatItem7" />
              <Frame text="CatItem8" />
            </div>
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
                {todayDeals.map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-[#d9d9d9] rounded-md"
                  ></div>
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
                {trendingDeals.map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-[#d9d9d9] rounded-md"
                  ></div>
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