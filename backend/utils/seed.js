require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const PLACEHOLDER_IMG = (seed) => `https://placehold.co/800x800/1B4332/F7F5F0?text=${encodeURIComponent(seed)}`;

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[seed] connected');

  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);
  console.log('[seed] cleared existing data');

  const admin = await User.create({
    name: 'GULLY Admin',
    email: 'admin@gullycricket.com',
    password: 'Admin@12345',
    role: 'admin',
    phone: '+92 300 0000000',
  });

  await User.create({
    name: 'Test Customer',
    email: 'customer@example.com',
    password: 'Customer@123',
    role: 'customer',
    phone: '+92 300 1111111',
  });

  const categoryDefs = [
    { name: 'Cricket Bats', description: 'English & Kashmir willow bats for every level.' },
    { name: 'Cricket Balls', description: 'Leather, tennis, and hardball options.' },
    { name: 'Batting Gloves', description: 'Protective, high-grip batting gloves.' },
    { name: 'Batting Pads', description: 'Lightweight leg guards for batsmen.' },
    { name: 'Wicketkeeping Gear', description: 'Gloves, pads, and inner gloves for keepers.' },
    { name: 'Helmets', description: 'ICC-spec protective helmets.' },
    { name: 'Cricket Bags', description: 'Kit bags and wheelie duffels.' },
    { name: 'Shoes', description: 'Spikes and rubber-sole cricket shoes.' },
    { name: 'Clothing', description: 'Jerseys, trousers, and training wear.' },
    { name: 'Accessories', description: 'Grips, bat stickers, abdo guards & more.' },
  ];

  const categories = await Category.insertMany(categoryDefs);
  const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));
  console.log(`[seed] created ${categories.length} categories`);

  const products = [
    {
      name: 'Willow Strike Pro English Willow Bat',
      category: catByName['Cricket Bats']._id,
      subCategory: 'English Willow Bats',
      description:
        'Grade 1 English willow bat hand-pressed for a traditional feel with a modern swell profile. Favoured by top-order batsmen for its punchy pickup and deep, consistent sweet spot.',
      shortDescription: 'Grade 1 English willow, hand-pressed, pro pickup.',
      specifications: new Map([
        ['Willow Grade', 'Grade 1 English Willow'],
        ['Handle', 'Sarawak cane, twin-spring'],
        ['Edge', '38mm'],
        ['Profile', 'Mid-to-low swell'],
      ]),
      basePrice: 28500,
      baseSalePrice: 24999,
      hasVariants: true,
      variants: [
        { attributes: new Map([['Handle', 'Short Handle'], ['Weight', '2lb 8oz']]), sku: 'GLY-BAT-WSP-SH-28', price: 28500, salePrice: 24999, stock: 6 },
        { attributes: new Map([['Handle', 'Short Handle'], ['Weight', '2lb 10oz']]), sku: 'GLY-BAT-WSP-SH-210', price: 28500, salePrice: 24999, stock: 4 },
        { attributes: new Map([['Handle', 'Harrow'], ['Weight', '2lb 4oz']]), sku: 'GLY-BAT-WSP-HW-24', price: 26500, salePrice: 22999, stock: 3 },
      ],
      images: [{ url: PLACEHOLDER_IMG('Willow+Strike+Pro'), isPrimary: true }],
      tags: ['bat', 'english willow', 'batting'],
      isFeatured: true,
      isBestSeller: true,
      weightGrams: 1150,
    },
    {
      name: 'Kashmir Edge Kashmir Willow Bat',
      category: catByName['Cricket Bats']._id,
      subCategory: 'Kashmir Willow Bats',
      description:
        'Durable Kashmir willow bat built for hard-hitting club and street cricket. Excellent value with a full-sized profile and reinforced edges for longevity.',
      shortDescription: 'Durable, affordable Kashmir willow bat.',
      specifications: new Map([['Willow Grade', 'Kashmir Willow'], ['Handle', 'Cane, single spring']]),
      basePrice: 6500,
      baseSalePrice: null,
      hasVariants: true,
      variants: [
        { attributes: new Map([['Weight', '2lb 9oz']]), sku: 'GLY-BAT-KE-29', price: 6500, stock: 20 },
        { attributes: new Map([['Weight', '2lb 11oz']]), sku: 'GLY-BAT-KE-211', price: 6500, stock: 15 },
      ],
      images: [{ url: PLACEHOLDER_IMG('Kashmir+Edge'), isPrimary: true }],
      tags: ['bat', 'kashmir willow'],
      isNewArrival: true,
      weightGrams: 1200,
    },
    {
      name: 'Redball Match Leather Cricket Ball',
      category: catByName['Cricket Balls']._id,
      description: 'Hand-stitched, four-piece leather ball built to hold seam and shape through a full 50-over spell.',
      shortDescription: 'Hand-stitched 4-piece leather match ball.',
      specifications: new Map([['Weight', '156g'], ['Material', 'Grade A leather']]),
      basePrice: 2200,
      hasVariants: false,
      sku: 'GLY-BALL-RM-156',
      stock: 60,
      images: [{ url: PLACEHOLDER_IMG('Redball+Match'), isPrimary: true }],
      tags: ['ball', 'leather'],
      isBestSeller: true,
      weightGrams: 156,
    },
    {
      name: 'Guard Flex Batting Gloves',
      category: catByName['Batting Gloves']._id,
      description: 'High-density foam padding with a pre-curved finger fit for a natural grip and superior impact protection.',
      shortDescription: 'Pre-curved batting gloves, pro protection.',
      specifications: new Map([['Material', 'PU leather palm, foam back']]),
      basePrice: 4800,
      baseSalePrice: 3999,
      hasVariants: true,
      variants: [
        { attributes: new Map([['Size', 'Youth']]), sku: 'GLY-GLV-GF-Y', price: 4200, salePrice: 3499, stock: 12 },
        { attributes: new Map([['Size', 'Men']]), sku: 'GLY-GLV-GF-M', price: 4800, salePrice: 3999, stock: 18 },
      ],
      images: [{ url: PLACEHOLDER_IMG('Guard+Flex+Gloves'), isPrimary: true }],
      tags: ['gloves', 'batting'],
      isFeatured: true,
      weightGrams: 300,
    },
    {
      name: 'Fortress Batting Pads',
      category: catByName['Batting Pads']._id,
      description: 'Lightweight three-section leg guards with high-density protection and a secure strap system.',
      shortDescription: 'Lightweight leg guards, secure fit.',
      basePrice: 6200,
      hasVariants: true,
      variants: [
        { attributes: new Map([['Size', 'Men']]), sku: 'GLY-PAD-FT-M', price: 6200, stock: 10 },
        { attributes: new Map([['Size', 'Youth']]), sku: 'GLY-PAD-FT-Y', price: 5200, stock: 8 },
      ],
      images: [{ url: PLACEHOLDER_IMG('Fortress+Pads'), isPrimary: true }],
      tags: ['pads', 'batting'],
      weightGrams: 900,
    },
    {
      name: 'Keeper Elite Wicketkeeping Gloves',
      category: catByName['Wicketkeeping Gear']._id,
      description: 'Extra padded pouch design for confident takes standing up or back, with reinforced webbing.',
      shortDescription: 'Extra-padded keeping gloves.',
      basePrice: 7500,
      hasVariants: false,
      sku: 'GLY-WK-KE-M',
      stock: 9,
      images: [{ url: PLACEHOLDER_IMG('Keeper+Elite'), isPrimary: true }],
      tags: ['wicketkeeping', 'gloves'],
      isNewArrival: true,
      weightGrams: 400,
    },
    {
      name: 'Titan Guard Batting Helmet',
      category: catByName['Helmets']._id,
      description: 'ICC-spec titanium steel grille with adjustable dial-fit shell, engineered for maximum ventilation.',
      shortDescription: 'ICC-spec titanium grille helmet.',
      basePrice: 8900,
      baseSalePrice: 7499,
      hasVariants: true,
      variants: [
        { attributes: new Map([['Size', 'S']]), sku: 'GLY-HLM-TG-S', price: 8900, salePrice: 7499, stock: 5 },
        { attributes: new Map([['Size', 'M']]), sku: 'GLY-HLM-TG-M', price: 8900, salePrice: 7499, stock: 7 },
        { attributes: new Map([['Size', 'L']]), sku: 'GLY-HLM-TG-L', price: 8900, salePrice: 7499, stock: 6 },
      ],
      images: [{ url: PLACEHOLDER_IMG('Titan+Guard'), isPrimary: true }],
      tags: ['helmet', 'protection'],
      isFeatured: true,
      isBestSeller: true,
      weightGrams: 750,
    },
    {
      name: 'Voyager Pro Kit Bag',
      category: catByName['Cricket Bags']._id,
      description: 'Wheeled duffel with a dedicated bat compartment, ventilated shoe pocket, and reinforced base.',
      shortDescription: 'Wheeled duffel, dedicated bat sleeve.',
      basePrice: 9800,
      hasVariants: false,
      sku: 'GLY-BAG-VP-1',
      stock: 14,
      images: [{ url: PLACEHOLDER_IMG('Voyager+Pro+Bag'), isPrimary: true }],
      tags: ['bag', 'kit bag'],
      isNewArrival: true,
      weightGrams: 2200,
    },
    {
      name: 'Groundspeed Rubber Cricket Shoes',
      category: catByName['Shoes']._id,
      description: 'Multi-directional rubber studs for grip on all surfaces, with a cushioned midsole for long spells in the field.',
      shortDescription: 'Rubber-stud shoes for all surfaces.',
      basePrice: 7200,
      hasVariants: true,
      variants: [
        { attributes: new Map([['Size', 'UK 7']]), sku: 'GLY-SHO-GS-7', price: 7200, stock: 8 },
        { attributes: new Map([['Size', 'UK 8']]), sku: 'GLY-SHO-GS-8', price: 7200, stock: 10 },
        { attributes: new Map([['Size', 'UK 9']]), sku: 'GLY-SHO-GS-9', price: 7200, stock: 9 },
        { attributes: new Map([['Size', 'UK 10']]), sku: 'GLY-SHO-GS-10', price: 7200, stock: 6 },
      ],
      images: [{ url: PLACEHOLDER_IMG('Groundspeed+Shoes'), isPrimary: true }],
      tags: ['shoes', 'footwear'],
      weightGrams: 850,
    },
    {
      name: 'Matchday Performance Jersey',
      category: catByName['Clothing']._id,
      description: 'Breathable moisture-wicking jersey built for long days in the field, with UPF sun protection.',
      shortDescription: 'Moisture-wicking match jersey.',
      basePrice: 3200,
      hasVariants: true,
      variants: [
        { attributes: new Map([['Size', 'M']]), sku: 'GLY-CLO-MJ-M', price: 3200, stock: 20 },
        { attributes: new Map([['Size', 'L']]), sku: 'GLY-CLO-MJ-L', price: 3200, stock: 18 },
        { attributes: new Map([['Size', 'XL']]), sku: 'GLY-CLO-MJ-XL', price: 3200, stock: 12 },
      ],
      images: [{ url: PLACEHOLDER_IMG('Matchday+Jersey'), isPrimary: true }],
      tags: ['clothing', 'jersey'],
      isNewArrival: true,
      weightGrams: 200,
    },
    {
      name: 'Grip Master Bat Grip (Pack of 3)',
      category: catByName['Accessories']._id,
      description: 'Tacky, shock-absorbing replacement grips for a locked-in feel through every shot.',
      shortDescription: 'Shock-absorbing bat grips, pack of 3.',
      basePrice: 900,
      hasVariants: false,
      sku: 'GLY-ACC-GM-3',
      stock: 40,
      images: [{ url: PLACEHOLDER_IMG('Grip+Master'), isPrimary: true }],
      tags: ['accessories', 'grip'],
      weightGrams: 60,
    },
    {
      name: 'Armour Abdominal Guard',
      category: catByName['Accessories']._id,
      description: 'Contoured protective guard with a breathable strap for secure, comfortable wear.',
      shortDescription: 'Contoured protective abdo guard.',
      basePrice: 1400,
      hasVariants: false,
      sku: 'GLY-ACC-AG-1',
      stock: 25,
      images: [{ url: PLACEHOLDER_IMG('Armour+Guard'), isPrimary: true }],
      tags: ['accessories', 'protection'],
      weightGrams: 150,
    },
  ];

  await Product.insertMany(products);
  console.log(`[seed] created ${products.length} products`);

  console.log('\n[seed] Done.');
  console.log('[seed] Admin login: admin@gullycricket.com / Admin@12345');
  console.log('[seed] Customer login: customer@example.com / Customer@123');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
