const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialProducts = [
  {
    name: 'Authentic Conical Agaseke Basket',
    description: 'Traditional hand-woven Agaseke basket featuring iconic black and white zigzag geometric patterns. Handcrafted by weavers in the Southern Province of Rwanda using natural sisal fibers and sweet grass. Traditionally used for weddings, home decor, and storing dry foods.',
    price: 25.00,
    imageUrl: '/images/agaseke_basket.png',
    category: 'Baskets',
    stock: 15,
    sellerName: 'Southern Weavers Cooperative'
  },
  {
    name: 'Geometric Imigongo Art Painting',
    description: 'Stunning traditional Rwandan Imigongo canvas, handcrafted using organic clay and cow dung medium on a wooden panel. Painted with natural black, white, and red pigments in bold geometric spiraling patterns. A historic Royal art form originating from Gisaka in Eastern Rwanda.',
    price: 45.00,
    imageUrl: '/images/imigongo_art.png',
    category: 'Art',
    stock: 8,
    sellerName: 'Imigongo Heritage Collective'
  },
  {
    name: 'Virunga Bourbon Specialty Coffee (500g)',
    description: 'Single-origin premium Arabica coffee beans grown in the high-altitude volcanic soils of the Virunga Mountains in Northern Rwanda. Light-medium roast with notes of bright citrus, black tea, and sweet brown sugar. Fully washed process.',
    price: 18.50,
    imageUrl: '/images/rwanda_coffee.png',
    category: 'Coffee',
    stock: 50,
    sellerName: 'Virunga Farmers Union'
  },
  {
    name: 'Handmade Beaded Brass Necklace',
    description: 'A striking statement necklace featuring colorful glass seed beads arranged in traditional Rwandan patterns, combined with hand-hammered local brass. Fully adjustable, hypoallergenic, and crafted by independent artisans in Kigali.',
    price: 12.00,
    imageUrl: '/images/beaded_necklace.png',
    category: 'Accessories',
    stock: 22,
    sellerName: 'Kigali Creative Arts'
  },
  {
    name: 'Sisal Fiber Star Woven Bowl',
    description: 'A decorative woven bowl featuring a beautiful radiating star pattern, hand-woven from wild sisal fibers wrapped over sweet grass. Includes an attached loop on the back for easy wall hanging. Perfect for fruit display or wall collage art.',
    price: 20.00,
    imageUrl: '/images/woven_bowl.png',
    category: 'Baskets',
    stock: 30,
    sellerName: 'Amahoro Crafts Rwanda'
  }
];

async function main() {
  console.log('Start seeding products...');
  
  // Clear existing products
  await prisma.product.deleteMany({});
  console.log('Cleared existing products.');

  for (const p of initialProducts) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id} (${product.name})`);
  }
  
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
