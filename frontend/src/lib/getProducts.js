const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

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

export async function getProducts(category = null, search = null) {
  try {
    let url = `${BACKEND_API_URL}/products`;
    const params = [];
    if (category && category !== 'All') {
      params.push(`category=${encodeURIComponent(category)}`);
    }
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const products = await res.json();
    return products;
  } catch (error) {
    console.warn('Backend API not reachable, falling back to mock data:', error.message);
    return filterProducts(mockProducts, category, search);
  }
}

export async function getProductById(id) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/products/${id}`, { next: { revalidate: 10 } });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const product = await res.json();
    return product;
  } catch (error) {
    console.warn(`Backend API not reachable for product ${id}, falling back to mock data:`, error.message);
    return mockProducts.find(p => p.id === id) || null;
  }
}

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
