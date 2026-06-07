'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    getCartTax,
    getCartTotal,
  } = useCart();

  const isEmpty = cart.length === 0;

  return (
    <div className="cart-page fade-in">
      <div className="container">
        <h1 className="cart-title font-serif">Your Shopping Cart</h1>

        {isEmpty ? (
          <div className="empty-cart card">
            <div className="empty-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>You haven't added any handcrafted Rwandan treasures to your cart yet.</p>
            <Link href="/products" className="btn btn-primary" style={{ marginTop: '24px' }}>
              Browse Heritage Collection
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Cart Items List */}
            <div className="cart-items-container">
              {cart.map((item) => (
                <div key={item.id} className="cart-item card">
                  <div className="item-img-wrapper">
                    <img src={item.imageUrl} alt={item.name} className="item-img" />
                  </div>
                  
                  <div className="item-details">
                    <div className="item-header">
                      <span className="item-category">{item.category}</span>
                      <h3 className="item-name">
                        <Link href={`/products/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="item-seller">Seller: {item.sellerName}</p>
                    </div>
                    
                    <div className="item-actions-row">
                      {/* Quantity Selector */}
                      <div className="quantity-selector">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="3" fill="none">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="3" fill="none">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button onClick={() => removeFromCart(item.id)} className="btn-remove">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-pricing">
                    <span className="unit-price">${item.price.toFixed(2)} each</span>
                    <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary Panel */}
            <div className="cart-summary-container">
              <div className="cart-summary-card card">
                <h3 className="summary-title font-serif">Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${getCartSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <div className="summary-row-label-group">
                    <span>VAT Tax</span>
                    <span className="vat-tag">18% RRA Standard</span>
                  </div>
                  <span>${getCartTax().toFixed(2)}</span>
                </div>
                
                <div className="summary-row delivery-row">
                  <span>Delivery fee</span>
                  <span className="delivery-free">FREE</span>
                </div>
                
                <div className="summary-total-row">
                  <span>Grand Total</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                
                <Link href="/checkout" className="btn btn-primary btn-checkout">
                  Proceed to Checkout
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                
                <div className="summary-guarantees">
                  <div className="guarantee-item">
                    <span>🔒</span> Secure transaction
                  </div>
                  <div className="guarantee-item">
                    <span>🇷🇼</span> Authentic certified craft source
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-page {
          padding: 60px 0 80px 0;
        }
        .cart-title {
          font-size: 36px;
          color: var(--primary-color);
          margin-bottom: 32px;
        }

        /* Empty Cart */
        .empty-cart {
          text-align: center;
          padding: 80px 40px;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-icon {
          font-size: 56px;
          margin-bottom: 24px;
        }
        .empty-cart h2 {
          font-size: 26px;
          color: var(--primary-color);
          margin-bottom: 12px;
        }
        .empty-cart p {
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.6;
        }

        /* Cart Grid Layout */
        .cart-grid {
          display: grid;
          grid-template-columns: 1.6fr 0.9fr;
          gap: 32px;
          align-items: start;
        }

        /* Cart Items */
        .cart-items-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .cart-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          padding: 20px;
          align-items: center;
        }
        .item-img-wrapper {
          width: 100px;
          height: 100px;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background-color: #f0ede6;
          border: 1px solid var(--card-border);
        }
        .item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          gap: 16px;
        }
        .item-category {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .item-name {
          font-size: 17px;
          font-weight: 700;
          color: var(--primary-color);
          margin: 2px 0;
        }
        .item-seller {
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .item-actions-row {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          background-color: var(--bg-color);
          border: 1px solid var(--card-border);
          border-radius: var(--border-radius-sm);
        }
        .qty-btn {
          background: none;
          border: none;
          padding: 6px 12px;
          cursor: pointer;
          color: var(--text-main);
          transition: var(--transition-smooth);
        }
        .qty-btn:hover {
          background-color: var(--card-border);
        }
        .qty-display {
          font-weight: 700;
          font-size: 14px;
          min-width: 24px;
          text-align: center;
        }
        .btn-remove {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }
        .btn-remove:hover {
          color: var(--error-color);
        }

        .item-pricing {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .unit-price {
          font-size: 12px;
          color: var(--text-muted);
        }
        .total-price {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
        }

        /* Cart Summary Panel */
        .cart-summary-card {
          padding: 32px;
        }
        .summary-title {
          font-size: 22px;
          color: var(--primary-color);
          margin-bottom: 24px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 16px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          margin-bottom: 16px;
          color: var(--text-muted);
        }
        .summary-row-label-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .vat-tag {
          font-size: 9px;
          background-color: rgba(12, 66, 37, 0.08);
          color: var(--primary-color);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }
        .delivery-row {
          padding-bottom: 16px;
          border-bottom: 1px solid var(--card-border);
        }
        .delivery-free {
          color: var(--success-color);
          font-weight: 700;
        }
        .summary-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
          margin: 20px 0 28px 0;
        }
        .btn-checkout {
          width: 100%;
          padding: 14px;
        }
        .summary-guarantees {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 12px;
          color: var(--text-muted);
        }
        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .cart-item {
            grid-template-columns: 1fr;
            text-align: center;
            justify-items: center;
            gap: 16px;
          }
          .item-details {
            align-items: center;
          }
          .item-pricing {
            align-items: center;
            border-top: 1px dashed var(--card-border);
            padding-top: 16px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
