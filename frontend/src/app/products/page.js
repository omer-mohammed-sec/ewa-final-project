import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/getProducts';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const activeCategory = params.category || 'All';
  const searchQuery = params.search || '';

  const products = await getProducts(activeCategory, searchQuery);

  const categories = ['All', 'Baskets', 'Art', 'Coffee', 'Accessories'];

  return (
    <div className="products-page fade-in">
      <div className="container">
        {/* Page Header */}
        <div className="products-header">
          <h1 className="page-title font-serif">Heritage Collection</h1>
          <p className="page-subtitle">Browse our curated selection of hand-crafted Rwandan treasures.</p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          {/* Categories Navigation */}
          <div className="categories-tabs">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={`/products?category=${cat}${searchQuery ? `&search=${searchQuery}` : ''}`}
                  className={`category-tab ${isActive ? 'active' : ''}`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Search Box */}
          <form action="/products" method="GET" className="search-form">
            <input type="hidden" name="category" value={activeCategory} />
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={searchQuery}
              className="search-input"
            />
            <button type="submit" className="search-submit" aria-label="Submit search">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        {/* Product Listings */}
        {products.length === 0 ? (
          <div className="no-results card">
            <div className="no-results-icon">🏺</div>
            <h2>No Treasures Found</h2>
            <p>We couldn't find any products matching your selection. Try adjusting your filters or search query.</p>
            <Link href="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card card">
                <Link href={`/products/${p.id}`} className="product-img-link">
                  <div className="product-img-wrapper">
                    <img src={p.imageUrl} alt={p.name} className="product-img" />
                    <span className="product-category-tag">{p.category}</span>
                  </div>
                </Link>
                <div className="product-info">
                  <span className="product-stock-status">
                    {p.stock > 0 ? (
                      <span className="stock-in">● {p.stock} in stock</span>
                    ) : (
                      <span className="stock-out">● Out of stock</span>
                    )}
                  </span>
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
        )}
      </div>
    </div>
  );
}
