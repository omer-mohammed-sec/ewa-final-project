'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Visual feedback
    const btn = document.getElementById('add-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '✨ Added to Cart! ✨';
      btn.style.backgroundColor = 'var(--success-color)';
      btn.style.borderColor = 'var(--success-color)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
      }, 1500);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="add-to-cart-container">
      {!isOutOfStock && (
        <div className="quantity-selector">
          <button onClick={decrement} className="qty-btn" aria-label="Decrease quantity">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span className="qty-display">{quantity}</span>
          <button onClick={increment} className="qty-btn" aria-label="Increase quantity">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      )}

      <button
        id="add-btn"
        onClick={handleAddToCart}
        className="btn btn-primary btn-add"
        disabled={isOutOfStock}
      >
        {isOutOfStock ? (
          'Out of Stock'
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to Shopping Cart
          </>
        )}
      </button>

      <style jsx>{`
        .add-to-cart-container {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          background-color: var(--bg-color);
          border: 1px solid var(--card-border);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
        }
        .qty-btn {
          background: none;
          border: none;
          padding: 12px 16px;
          cursor: pointer;
          color: var(--text-main);
          transition: var(--transition-smooth);
        }
        .qty-btn:hover {
          background-color: var(--card-border);
        }
        .qty-display {
          font-weight: 700;
          font-size: 16px;
          min-width: 40px;
          text-align: center;
          color: var(--text-main);
        }
        .btn-add {
          flex: 1;
          min-width: 200px;
          transition: var(--transition-smooth);
        }
      `}</style>
    </div>
  );
}
