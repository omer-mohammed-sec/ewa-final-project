import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/getProducts';

export const dynamic = 'force-dynamic'; // Prevent static generation issue

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 3); // Take top 3 products

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-tagline">Preserving Heritage, Empowering Lives</span>
            <h1 className="hero-title font-serif">Handcrafted Rwandan Masterpieces</h1>
            <p className="hero-description">
              Discover the beauty of traditional Rwandan artistry. From the iconic conical Agaseke baskets to geometric Imigongo paintings and volcanic specialty coffee, each piece is handcrafted with love and carries a rich cultural story.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-primary">
                Shop the Collection
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link href="/dashboard" className="btn btn-outline" style={{ borderColor: 'var(--secondary-color)', color: 'var(--text-main)' }}>
                View System Analytics
              </Link>
            </div>
          </div>
          <div className="hero-image-area">
            <div className="hero-image-wrapper">
              <img src="/images/hero_crafts.png" alt="Rwandan Handicrafts Showcase" className="hero-img" />
              <div className="hero-image-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Purpose */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title font-serif">Crafted by Hand, Rich in Culture</h2>
            <p className="section-subtitle">
              Every purchase directly supports rural weaving cooperatives and independent artisans in Rwanda.
            </p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card card">
              <div className="benefit-icon">🌿</div>
              <h3>Natural Materials</h3>
              <p>Woven using locally harvested sisal fibers, sweet grass, banana leaves, and organic clay pigments.</p>
            </div>
            
            <div className="benefit-card card">
              <div className="benefit-icon">🤝</div>
              <h3>Artisan Empowerment</h3>
              <p>Fairtrade pricing that ensures local weavers and farmers receive sustainable incomes for their craftsmanship.</p>
            </div>
            
            <div className="benefit-card card">
              <div className="benefit-icon">🌋</div>
              <h3>Volcanic Soil Coffee</h3>
              <p>Specialty coffee grown on high-altitude mountain slopes, yielding rich floral notes and a smooth body.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation by Category */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title font-serif text-center">Shop by Heritage Category</h2>
          <div className="categories-grid">
            <Link href="/products?category=Baskets" className="category-card card">
              <div className="category-img-container">
                <img src="/images/agaseke_basket.png" alt="Baskets Category" />
              </div>
              <div className="category-overlay">
                <h3>Agaseke Baskets</h3>
                <span>View items &rarr;</span>
              </div>
            </Link>

            <Link href="/products?category=Art" className="category-card card">
              <div className="category-img-container">
                <img src="/images/imigongo_art.png" alt="Art Category" />
              </div>
              <div className="category-overlay">
                <h3>Imigongo Paintings</h3>
                <span>View items &rarr;</span>
              </div>
            </Link>

            <Link href="/products?category=Coffee" className="category-card card">
              <div className="category-img-container">
                <img src="/images/rwanda_coffee.png" alt="Coffee Category" />
              </div>
              <div className="category-overlay">
                <h3>Volcanic Coffee</h3>
                <span>View items &rarr;</span>
              </div>
            </Link>

            <Link href="/products?category=Accessories" className="category-card card">
              <div className="category-img-container">
                <img src="/images/beaded_necklace.png" alt="Accessories Category" />
              </div>
              <div className="category-overlay">
                <h3>Artisan Accessories</h3>
                <span>View items &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <h2 className="section-title font-serif">Featured Treasures</h2>
            <Link href="/products" className="view-all-link">View all products &rarr;</Link>
          </div>
          
          <div className="products-grid">
            {featuredProducts.map((p) => (
              <div key={p.id} className="product-card card">
                <Link href={`/products/${p.id}`} className="product-img-link">
                  <div className="product-img-wrapper">
                    <img src={p.imageUrl} alt={p.name} className="product-img" />
                    <span className="product-category-tag">{p.category}</span>
                  </div>
                </Link>
                <div className="product-info">
                  <h3 className="product-name">
                    <Link href={`/products/${p.id}`}>{p.name}</Link>
                  </h3>
                  <p className="product-seller">By {p.sellerName}</p>
                  <div className="product-meta">
                    <span className="product-price">${p.price.toFixed(2)}</span>
                    <Link href={`/products/${p.id}`} className="btn-buy">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
