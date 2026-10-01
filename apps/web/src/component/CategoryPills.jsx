import {
  Headphones,
  Watch,
  Camera,
  Sparkles,
  Keyboard,
  Smartphone,
  Home,
  Cpu,
  Layers,
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

export default function CategoryPills() {
  const { categories, selectedCategory, setSelectedCategory } = useProducts();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none my-4">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition shadow-sm ${
          !selectedCategory
            ? 'bg-[#b87c4c] text-white shadow-md'
            : 'bg-[#ebd9d1] text-slate-800 hover:bg-[#dfc3b7]'
        }`}
      >
        <Layers size={15} />
        <span>All</span>
      </button>

      {categories.map((cat) => {
        const Icon = ICON_MAP[cat.name] || Layers;
        const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();

        return (
          <button
            key={cat.id || cat.name}
            onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition shadow-sm ${
              isSelected
                ? 'bg-[#b87c4c] text-white shadow-md'
                : 'bg-[#ebd9d1] text-slate-800 hover:bg-[#dfc3b7]'
            }`}
          >
            <Icon size={15} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
