import React from 'react';
import Link from 'next/link';
import { getProductById, getProducts } from '@/lib/getProducts';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';

// AI-powered recommendation system
function getAIRecommendations(currentProduct, allProducts) {
  const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'in', 'on', 'at', 'to', 'for', 'of', 'by', 'with', 'from', 'this', 'that', 'features', 'traditional', 'rwandan']);
  
  const getWords = (str) => {
    return str.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  };

  const currentWordsName = getWords(currentProduct.name);
  const currentWordsDesc = getWords(currentProduct.description);

  return allProducts
    .filter(p => p.id !== currentProduct.id)
    .map(p => {
      let score = 0;
      
      // Category Match (Strong weight)
      if (p.category === currentProduct.category) {
        score += 12;
      }
      
      const pWordsName = getWords(p.name);
      const pWordsDesc = getWords(p.description);
      
      // Word overlap in name (Medium weight)
      pWordsName.forEach(w => {
        if (currentWordsName.includes(w)) score += 5;
        if (currentWordsDesc.includes(w)) score += 2;
      });

      // Word overlap in description (Low weight)
      pWordsDesc.forEach(w => {
        if (currentWordsName.includes(w)) score += 2;
        if (currentWordsDesc.includes(w)) score += 0.5;
      });

      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.product);
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 className="font-serif" style={{ color: 'var(--primary-color)' }}>Artifact Not Found</h1>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0 32px 0' }}>The product you are looking for does not exist in our heritage registry.</p>
        <Link href="/products" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const allProducts = await getProducts();
  const recommendedProducts = getAIRecommendations(product, allProducts);

  return (
    <div className="product-details-page fade-in">
      <div className="container">
        {/* Back Link */}
        <Link href="/products" className="back-link">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to collection
        </Link>

        {/* Product Grid */}
        <div className="product-grid-main">
          {/* Image */}
          <div className="details-image-area">
            <div className="details-image-wrapper">
              <img src={product.imageUrl} alt={product.name} className="details-img" />
              <span className="details-category-badge">{product.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="details-content-area">
            <div className="details-header">
              <span className="details-seller">Artisan: {product.sellerName}</span>
              <h1 className="details-title font-serif">{product.name}</h1>
              <div className="price-stock-row">
                <span className="details-price">${product.price.toFixed(2)}</span>
                <span className="details-stock">
                  {product.stock > 0 ? (
                    <span className="stock-label in-stock">In Stock ({product.stock} left)</span>
                  ) : (
                    <span className="stock-label out-of-stock">Out of Stock</span>
                  )}
                </span>
              </div>
            </div>

            <div className="details-body">
              <h3 className="section-subtitle-small">Story & Craftsmanship</h3>
              <p className="details-description">{product.description}</p>
              
              <div className="details-highlights">
                <div className="highlight-item">
                  <span className="highlight-icon">🌍</span>
                  <div>
                    <h4>100% Rwandan Made</h4>
                    <p>Sourced and crafted locally, supporting communities.</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">🌱</span>
                  <div>
                    <h4>Eco-Friendly Materials</h4>
                    <p>Sisal, sweet grass, and organic pigments.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Actions */}
            <AddToCartButton product={product} />
          </div>
        </div>

        {/* AI Recommendations */}
        <section className="recommendations-section">
          <div className="rec-header">
            <h2 className="font-serif">You Might Also Like</h2>
            <span className="ai-badge">AI Recommendations</span>
          </div>
          
          <div className="products-grid">
            {recommendedProducts.map((p) => (
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
        </section>
      </div>
    </div>
  );
}
