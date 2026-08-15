import { MerchandisingCampaign, Order, Product, ProductCategory } from '../domain/commerce';

export const categories: ProductCategory[] = [
  {
    slug: 'fresh-fruits',
    name: 'Fresh Fruits',
    shortName: 'Fruits',
    description: 'Seasonal varieties selected for authentic flavour and careful local delivery.',
    imageKey: 'fresh-fruits',
    availability: 'available',
    displayOrder: 1,
  },
  {
    slug: 'fresh-vegetables',
    name: 'Fresh Vegetables',
    shortName: 'Vegetables',
    description: 'Indian kitchen essentials in practical fixed packs, sourced for freshness.',
    imageKey: 'fresh-vegetables',
    availability: 'coming_soon',
    displayOrder: 2,
  },
  {
    slug: 'spices-pantry',
    name: 'Spices & Pantry',
    shortName: 'Pantry',
    description: 'Aromatic spices and trusted staples selected for everyday Indian cooking.',
    imageKey: 'spices-pantry',
    availability: 'coming_soon',
    displayOrder: 3,
  },
  {
    slug: 'gift-boxes',
    name: 'Festival & Gift Boxes',
    shortName: 'Gifts',
    description: 'Thoughtful seasonal collections designed for celebrations and sharing.',
    imageKey: 'gift-boxes',
    availability: 'coming_soon',
    displayOrder: 4,
  },
];

export const activeCampaign: MerchandisingCampaign = {
  id: 'mango-season-2026',
  eyebrow: 'THE SEASON’S FINEST · INDIA TO CANADA',
  title: 'Mango season has landed.',
  description: 'Exceptional Indian mangoes selected for flavour, handled with care and delivered across Toronto and the GTA.',
  category: 'fresh-fruits',
  status: 'active',
};

export const products: Product[] = [
  {
    id: 'alphonso-12',
    name: 'Alphonso Reserve',
    variety: 'Ratnagiri Alphonso',
    origin: 'Maharashtra, India',
    description: 'Exceptionally fragrant, naturally creamy and selected for a rich, lingering sweetness.',
    unitLabel: '12-count premium box',
    unitPriceCents: 5999,
    inventory: 42,
    imageKey: 'alphonso-box',
    active: true,
    category: 'fresh-fruits', availability: 'available', sku: 'UG-FR-ALP-12', sellBy: 'fixed_pack', storage: 'cool', tags: ['seasonal', 'mango', 'premium'],
  },
  {
    id: 'kesar-12',
    name: 'Kesar Orchard Box',
    variety: 'Gujarat Kesar',
    origin: 'Gujarat, India',
    description: 'Saffron-gold flesh with an intense aroma and smooth sweetness that defines the season.',
    unitLabel: '12-count orchard box',
    unitPriceCents: 5499,
    inventory: 18,
    imageKey: 'kesar-crate',
    active: true,
    category: 'fresh-fruits', availability: 'available', sku: 'UG-FR-KES-12', sellBy: 'fixed_pack', storage: 'cool', tags: ['seasonal', 'mango'],
  },
  {
    id: 'alphonso-6',
    name: 'Taste of Home Gift Box',
    variety: 'Ratnagiri Alphonso',
    origin: 'Maharashtra, India',
    description: 'Six hand-selected mangoes in an elegant presentation—made for gifting and first tastes.',
    unitLabel: '6-count gift box',
    unitPriceCents: 3299,
    inventory: 7,
    imageKey: 'alphonso-gift',
    active: true,
    category: 'gift-boxes', availability: 'available', sku: 'UG-GF-ALP-06', sellBy: 'fixed_pack', storage: 'cool', tags: ['seasonal', 'mango', 'gift'],
  },
];

export const demoOrders: Order[] = [
  {
    id: 'UG-1048',
    status: 'out_for_delivery',
    totalCents: 6778,
    deliveryCity: 'Mississauga',
    deliveryWindow: 'Today · 3:00–6:00 PM',
    eta: '4:35 PM',
    lineCount: 1,
  },
  {
    id: 'UG-1012',
    status: 'delivered',
    totalCents: 6214,
    deliveryCity: 'Toronto',
    deliveryWindow: 'August 2 · 1:00–4:00 PM',
    lineCount: 1,
  },
];
