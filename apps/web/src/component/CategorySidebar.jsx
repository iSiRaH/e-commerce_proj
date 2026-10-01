import {
  Menu,
  Headphones,
  Watch,
  Camera,
  Sparkles,
  Keyboard,
  Smartphone,
  Home,
  Cpu,
  Layers,
  Check,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const ICON_MAP = {
  Audio: Headphones,
  Wearables: Watch,
  Cameras: Camera,
  Accessories: Sparkles,
  'Office & Desk': Keyboard,
  'Mobile Accessories': Smartphone,
  'Home Appliances': Home,
  Gadgets: Cpu,
};

export default function CategorySidebar({ showCategories, setShowCategories }) {
  const { categories, products, selectedCategory, setSelectedCategory } = useProducts();

  const getCount = (catName) => {
    return products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length;
  };

  return (
    <div className="w-full lg:w-[260px] shrink-0">
      {/* Category Toggle / Trigger Button */}
      <div
        onClick={() => setShowCategories(!showCategories)}
        className="bg-[#ebd9d1] hover:bg-[#dfc3b7] rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer shadow-sm hover:shadow transition-all border border-black/5"
      >
        <div className="flex items-center gap-3">
          <Menu size={20} className="text-slate-800" />
          <span className="font-bold text-sm md:text-base text-slate-800">
            Categories ({categories.length})
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-700 bg-white/70 px-2.5 py-1 rounded-full">
          {showCategories ? 'Hide' : 'Show'}
        </span>
      </div>

      {/* Categories Dropdown / List */}
      {showCategories && (
        <div className="flex flex-col gap-1.5 bg-white p-3 rounded-2xl shadow-lg border border-black/10 mt-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* All Categories Option */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              !selectedCategory
                ? 'bg-[#b87c4c] text-white shadow-sm'
                : 'text-slate-700 hover:bg-[#f7f4ea]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers size={17} />
              <span>All Products</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                !selectedCategory ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {products.length}
            </span>
          </button>

          <div className="border-t border-slate-100 my-1" />

          {/* 8 Real Backend Categories */}
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.name] || Layers;
            const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
            const count = getCount(cat.name);

            return (
              <button
                key={cat.id || cat.name}
                onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                  isSelected
                    ? 'bg-[#b87c4c] text-white font-bold shadow-sm'
                    : 'text-slate-700 hover:bg-[#f7f4ea]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon size={17} className={isSelected ? 'text-amber-200' : 'text-[#8da588]'} />
                  <span className="truncate">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
