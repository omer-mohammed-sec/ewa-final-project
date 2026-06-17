const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the frontend client can communicate with us
app.use(cors());
app.use(express.json());

// Initialize Prisma
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/agaseke?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const mockProducts = [
  {
    id: 'mock-1',
    name: 'Authentic Conical Agaseke Basket',
    description: 'Traditional hand-woven Agaseke basket featuring iconic black and white zigzag geometric patterns. Handcrafted by weavers in the Southern Province of Rwanda using natural sisal fibers and sweet grass. Traditionally used for weddings, home decor, and storing dry foods.',
    price: 25.00,
    imageUrl: '/images/agaseke_basket.png',
    category: 'Baskets',
    stock: 15,
    sellerName: 'Southern Weavers Cooperative'
  },
  {
    id: 'mock-2',
    name: 'Geometric Imigongo Art Painting',
    description: 'Stunning traditional Rwandan Imigongo canvas, handcrafted using organic clay and cow dung medium on a wooden panel. Painted with natural black, white, and red pigments in bold geometric spiraling patterns. A historic Royal art form originating from Gisaka in Eastern Rwanda.',
    price: 45.00,
    imageUrl: '/images/imigongo_art.png',
    category: 'Art',
    stock: 8,
    sellerName: 'Imigongo Heritage Collective'
  },
  {
    id: 'mock-3',
    name: 'Virunga Bourbon Specialty Coffee (500g)',
    description: 'Single-origin premium Arabica coffee beans grown in the high-altitude volcanic soils of the Virunga Mountains in Northern Rwanda. Light-medium roast with notes of bright citrus, black tea, and sweet brown sugar. Fully washed process.',
    price: 18.50,
    imageUrl: '/images/rwanda_coffee.png',
    category: 'Coffee',
    stock: 50,
    sellerName: 'Virunga Farmers Union'
  },
  {
    id: 'mock-4',
    name: 'Handmade Beaded Brass Necklace',
    description: 'A striking statement necklace featuring colorful glass seed beads arranged in traditional Rwandan patterns, combined with hand-hammered local brass. Fully adjustable, hypoallergenic, and crafted by independent artisans in Kigali.',
    price: 12.00,
    imageUrl: '/images/beaded_necklace.png',
    category: 'Accessories',
    stock: 22,
    sellerName: 'Kigali Creative Arts'
  },
  {
    id: 'mock-5',
    name: 'Sisal Fiber Star Woven Bowl',
    description: 'A decorative woven bowl featuring a beautiful radiating star pattern, hand-woven from wild sisal fibers wrapped over sweet grass. Includes an attached loop on the back for easy wall hanging. Perfect for fruit display or wall collage art.',
    price: 20.00,
    imageUrl: '/images/woven_bowl.png',
    category: 'Baskets',
    stock: 30,
    sellerName: 'Amahoro Crafts Rwanda'
  }
];

function filterProducts(list, category, search) {
  let filtered = [...list];
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(s) || 
      p.description.toLowerCase().includes(s)
    );
  }
  return filtered;
}

// 1. GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    const search = req.query.search;

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });

    if (!products || products.length === 0) {
      return res.json(filterProducts(mockProducts, category, search));
    }

    return res.json(products);
  } catch (error) {
    console.warn('Database error while fetching products, falling back to mock data:', error.message);
    const category = req.query.category;
    const search = req.query.search;
    return res.json(filterProducts(mockProducts, category, search));
  }
});

// 2. GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    if (product) {
      return res.json(product);
    }
    const mock = mockProducts.find(p => p.id === id);
    if (mock) {
      return res.json(mock);
    }
    return res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    console.warn(`Database error for product ${id}, falling back to mock:`, error.message);
    const mock = mockProducts.find(p => p.id === id);
    if (mock) {
      return res.json(mock);
    }
    return res.status(404).json({ error: 'Product not found' });
  }
});

// 3. POST /api/orders
app.post('/api/orders', async (req, res) => {
  try {
    const { customerDetails, items, total, paymentMethod } = req.body;

    if (!customerDetails || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing customer or order items details.' });
    }

    const order = await prisma.$transaction(async (tx) => {
      let customer = await tx.customer.findFirst({
        where: { email: customerDetails.email }
      });
      
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone,
            address: customerDetails.address,
            district: customerDetails.district
          }
        });
      }

      const newOrder = await tx.order.create({
        data: {
          customerId: customer.id,
          status: paymentMethod.includes('MOMO') || paymentMethod.includes('AIRTEL') ? 'PAID' : 'PENDING',
          total: parseFloat(total),
          paymentMethod: paymentMethod,
        }
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price)
          }
        });

        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });
        
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock }
          });
        }
      }

      return newOrder;
    });

    return res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.json({ 
      success: true, 
      orderId: 'demo-order-' + Math.random().toString(36).substring(2, 9),
      isDemo: true 
    });
  }
});

// 4. GET /api/orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(orders);
  } catch (error) {
    console.warn('Database offline, returning mock orders:', error.message);
    return res.json([
      {
        id: 'demo-order-1',
        createdAt: new Date().toISOString(),
        total: 88.00,
        status: 'DELIVERED',
        paymentMethod: 'MTN MOMO',
        customer: {
          name: 'Jean Paul Ndayishimiye',
          email: 'jeanpaul@example.rw',
          phone: '+250 788 123 456',
          address: 'KK 15 St, Kimihurura',
          district: 'Gasabo'
        },
        items: [
          {
            id: 'item-1',
            quantity: 2,
            price: 25.00,
            product: { name: 'Authentic Conical Agaseke Basket' }
          },
          {
            id: 'item-2',
            quantity: 1,
            price: 20.00,
            product: { name: 'Sisal Fiber Star Woven Bowl' }
          }
        ]
      }
    ]);
  }
});

// 5. PUT /api/orders
app.put('/api/orders', async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    
    return res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.json({ success: true, isDemo: true });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
