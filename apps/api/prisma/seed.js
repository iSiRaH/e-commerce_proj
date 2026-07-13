const prisma = require('../src/config/connectDb');

const categoriesData = [
  {
    name: 'Audio',
    slug: 'audio',
    description: 'High-quality headphones, earbuds, speakers, and audio gear.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smart watches, fitness bands, and wearable technology.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Cameras',
    slug: 'cameras',
    description: 'Professional cameras, webcams, lenses, and photography equipment.',
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Everyday gadgets, stands, tripods, hubs, and connectors.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Office & Desk',
    slug: 'office-desk',
    description: 'Keyboards, mice, desk lamps, and workspaces organization.',
    image: 'https://images.unsplash.com/photo-1587829191301-dc798b83add3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Mobile Accessories',
    slug: 'mobile-accessories',
    description: 'Cases, screen protectors, and chargers for your smartphones.',
    image: 'https://images.unsplash.com/photo-1606933248051-5ce42bebce85?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Home Appliances',
    slug: 'home-appliances',
    description: 'Smart home automation, appliances, and accessories.',
    image: 'https://images.unsplash.com/photo-1565636192335-14c01e2335d6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Gadgets',
    slug: 'gadgets',
    description: 'Smart gadgets, tools, and tech novelties.',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1200&auto=format&fit=crop',
  },
];

const productsData = [
  // Today's Deals
  {
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'Experience studio-quality audio with active noise cancellation and 40-hour battery life.',
    price: 129.99,
    discount: 25.0,
    brand: 'AudioTech',
    category: 'Audio',
    sku: 'AUDIO-HEAD-01',
    stockQty: 50,
    weight: 0.3,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Stay connected and track your vitals with cellular connectivity and water resistance up to 50m.',
    price: 199.99,
    discount: 33.0,
    brand: 'WearTech',
    category: 'Wearables',
    sku: 'WEAR-SW-02',
    stockQty: 30,
    weight: 0.1,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Ultra HD Camera',
    slug: 'ultra-hd-camera',
    description: 'Capture stunning landscapes and details with 4K video capabilities and continuous autofocus.',
    price: 799.99,
    discount: 20.0,
    brand: 'CamTech',
    category: 'Cameras',
    sku: 'CAM-UHD-03',
    stockQty: 15,
    weight: 0.8,
    thumbnail: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Portable Speaker',
    slug: 'portable-speaker',
    description: 'Compact wireless Bluetooth speaker delivering deep bass and 360-degree sound distribution.',
    price: 79.99,
    discount: 38.0,
    brand: 'AudioTech',
    category: 'Audio',
    sku: 'AUDIO-SPK-04',
    stockQty: 80,
    weight: 0.5,
    thumbnail: 'https://images.unsplash.com/photo-1589003077984-894e133814c9?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    description: 'Ergonomic, secure-fit in-ear headphones with touch controls and IPX7 sweat/water resistance.',
    price: 89.99,
    discount: 40.0,
    brand: 'AudioTech',
    category: 'Audio',
    sku: 'AUDIO-EAR-05',
    stockQty: 60,
    weight: 0.05,
    thumbnail: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Phone Tripod',
    slug: 'phone-tripod',
    description: 'Extendable tripod stand with bluetooth remote control for stable photography and video recording.',
    price: 29.99,
    discount: 40.0,
    brand: 'AccessTech',
    category: 'Accessories',
    sku: 'ACC-TRIP-06',
    stockQty: 100,
    weight: 0.2,
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'USB-C Hub',
    slug: 'usb-c-hub',
    description: '8-in-1 multi-port adapter with 4K HDMI, SD card reader, USB 3.0 ports, and Power Delivery passthrough.',
    price: 49.99,
    discount: 37.0,
    brand: 'AccessTech',
    category: 'Accessories',
    sku: 'ACC-HUB-07',
    stockQty: 120,
    weight: 0.1,
    thumbnail: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Phone Stand',
    slug: 'phone-stand',
    description: 'Adjustable, sturdy aluminum desktop phone cradle holder for video calls, reading, and watching movies.',
    price: 19.99,
    discount: 43.0,
    brand: 'AccessTech',
    category: 'Accessories',
    sku: 'ACC-STAND-08',
    stockQty: 200,
    weight: 0.15,
    thumbnail: 'https://images.unsplash.com/photo-1563394566578-f8fae67fa0fb?q=80&w=1200&auto=format&fit=crop',
  },
  // Trending Deals
  {
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description: 'Tactile mechanical keyboard with customized RGB lighting effects and hot-swappable key switches.',
    price: 149.99,
    discount: 25.0,
    brand: 'KeyTech',
    category: 'Office & Desk',
    sku: 'OFF-KEY-09',
    stockQty: 40,
    weight: 1.0,
    thumbnail: 'https://images.unsplash.com/photo-1587829191301-dc798b83add3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Gaming Mouse',
    slug: 'gaming-mouse',
    description: 'High-precision tracking mouse with adjustable DPI sensor and ergonomic grips for marathon gaming sessions.',
    price: 59.99,
    discount: 40.0,
    brand: 'KeyTech',
    category: 'Office & Desk',
    sku: 'OFF-MOUS-10',
    stockQty: 95,
    weight: 0.12,
    thumbnail: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Monitor Stand',
    slug: 'monitor-stand',
    description: 'Ergonomic wooden desk shelf and dual monitor stand riser with drawer compartments.',
    price: 89.99,
    discount: 36.0,
    brand: 'DeskTech',
    category: 'Office & Desk',
    sku: 'OFF-MON-11',
    stockQty: 25,
    weight: 2.5,
    thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Desk Lamp',
    slug: 'desk-lamp',
    description: 'Dimmable smart LED desk light with wireless charging dock and adjustable arms.',
    price: 45.99,
    discount: 42.0,
    brand: 'DeskTech',
    category: 'Office & Desk',
    sku: 'OFF-LAMP-12',
    stockQty: 50,
    weight: 0.9,
    thumbnail: 'https://images.unsplash.com/photo-1565636192335-14c01e2335d6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Phone Case',
    slug: 'phone-case',
    description: 'Shock-proof clear protective case with MagSafe compatibility and yellowing resistance.',
    price: 24.99,
    discount: 50.0,
    brand: 'CaseTech',
    category: 'Mobile Accessories',
    sku: 'ACC-CASE-13',
    stockQty: 150,
    weight: 0.03,
    thumbnail: 'https://images.unsplash.com/photo-1606933248051-5ce42bebce85?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Screen Protector',
    slug: 'screen-protector',
    description: 'Ultra-thin 9H hardness tempered glass shield with bubble-free installation frames.',
    price: 14.99,
    discount: 50.0,
    brand: 'CaseTech',
    category: 'Mobile Accessories',
    sku: 'ACC-PROT-14',
    stockQty: 300,
    weight: 0.01,
    thumbnail: 'https://images.unsplash.com/photo-1600163509057-ba94a3db4b18?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Cable Organizer',
    slug: 'cable-organizer',
    description: 'Silicone self-adhesive cable management holder clips for clean office workspaces.',
    price: 12.99,
    discount: 48.0,
    brand: 'DeskTech',
    category: 'Office & Desk',
    sku: 'OFF-ORG-15',
    stockQty: 180,
    weight: 0.05,
    thumbnail: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Webcam',
    slug: 'webcam',
    description: '1080p full HD desktop camera with autofocus, dual noise-reducing stereo microphones.',
    price: 99.99,
    discount: 37.0,
    brand: 'CamTech',
    category: 'Cameras',
    sku: 'CAM-WEB-16',
    stockQty: 45,
    weight: 0.25,
    thumbnail: 'https://images.unsplash.com/photo-1587826922334-403e5d63b672?q=80&w=1200&auto=format&fit=crop',
  },
];

async function main() {
  console.log('Clearing database tables...');
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  
  console.log('Seeding categories...');
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    console.log(`Seeded category: ${created.name}`);
  }

  console.log('Seeding products...');
  for (const prod of productsData) {
    const created = await prisma.product.create({ data: prod });
    console.log(`Seeded product: ${created.name}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
