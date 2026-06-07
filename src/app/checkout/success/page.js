'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('last_order_details');
    if (saved) {
      try {
        setOrderDetails(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing session order details:', e);
      }
    }
  }, []);

  const getEstimatedDelivery = (district) => {
    if (!district) return '2-3 business days';
    const isKigali = ['Gasabo', 'Kicukiro', 'Nyarugenge'].some(k => district.includes(k));
    return isKigali ? '24 Hours (Next Day Delivery)' : '2-3 Business Days (Inter-Province)';
  };

  return (
    <div className="success-page fade-in">
      <div className="container success-container">
        <div className="success-card card">
          <div className="success-icon-badge">🎉</div>
          
          <h1 className="success-title font-serif">Murakoze Cyane!</h1>
          <p className="success-subtitle">Thank you for your order. Your purchase has been processed successfully.</p>
          
          {orderDetails ? (
            <div className="receipt-area">
              <div className="receipt-header">
                <div className="receipt-meta-col">
                  <span className="meta-label">Order Reference</span>
                  <span className="meta-val highlight-ref">{orderDetails.orderId}</span>
                </div>
                <div className="receipt-meta-col">
                  <span className="meta-label">Payment Status</span>
                  <span className="meta-val payment-status-paid">PAID ({orderDetails.paymentMethod})</span>
                </div>
              </div>
              
              <div className="receipt-body">
                <h3 className="section-title-small">Delivery Information</h3>
                <div className="info-grid">
                  <div className="info-cell">
                    <span>Recipient</span>
                    <strong>{orderDetails.customer.name}</strong>
                  </div>
                  <div className="info-cell">
                    <span>Delivery Address</span>
                    <strong>{orderDetails.customer.address}, {orderDetails.customer.district} District</strong>
                  </div>
                  <div className="info-cell">
                    <span>Contact Phone</span>
                    <strong>{orderDetails.customer.phone}</strong>
                  </div>
                  <div className="info-cell">
                    <span>Estimated Delivery</span>
                    <strong style={{ color: 'var(--primary-color)' }}>
                      {getEstimatedDelivery(orderDetails.customer.district)}
                    </strong>
                  </div>
                </div>

                <h3 className="section-title-small" style={{ marginTop: '24px' }}>Items Purchased</h3>
                <div className="receipt-items">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="receipt-item-row">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="receipt-totals">
                    <div className="receipt-total-row">
                      <span>Subtotal</span>
                      <span>${(orderDetails.total / 1.18).toFixed(2)}</span>
                    </div>
                    <div className="receipt-total-row">
                      <span>VAT Tax (18%)</span>
                      <span>{(orderDetails.total - (orderDetails.total / 1.18)).toFixed(2)}</span>
                    </div>
                    <div className="receipt-total-row grand-total">
                      <span>Total Paid</span>
                      <span>${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-receipt">
              <p>Your order confirmation details could not be retrieved from the current session.</p>
            </div>
          )}

          <div className="success-actions">
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link href="/dashboard" className="btn btn-outline" style={{ borderColor: 'var(--secondary-color)', color: 'var(--text-main)' }}>
              Check Analytics Dashboard
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .success-page {
          padding: 80px 0;
          background-color: var(--bg-color);
        }
        .success-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .success-card {
          max-width: 680px;
          width: 100%;
          padding: 48px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .success-icon-badge {
          font-size: 56px;
          width: 90px;
          height: 90px;
          background-color: rgba(16, 185, 129, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .success-title {
          font-size: 36px;
          color: var(--primary-color);
          margin-bottom: 8px;
        }
        .success-subtitle {
          color: var(--text-muted);
          font-size: 16px;
          margin-bottom: 40px;
          max-width: 480px;
        }

        /* Receipt styling */
        .receipt-area {
          width: 100%;
          background-color: var(--bg-color);
          border: 1px solid var(--card-border);
          border-radius: var(--border-radius-md);
          text-align: left;
          margin-bottom: 40px;
          overflow: hidden;
        }
        .receipt-header {
          background-color: var(--primary-color);
          color: var(--text-light);
          padding: 24px;
          display: flex;
          justify-content: space-between;
          border-bottom: 4px solid var(--secondary-color);
        }
        .receipt-meta-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .meta-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.6);
        }
        .meta-val {
          font-weight: 700;
          font-size: 15px;
        }
        .highlight-ref {
          color: var(--secondary-color);
        }
        .payment-status-paid {
          color: #a7f3d0;
        }

        .receipt-body {
          padding: 32px;
        }
        .section-title-small {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--primary-color);
          margin-bottom: 16px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 6px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .info-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .info-cell span {
          font-size: 11px;
          color: var(--text-muted);
        }
        .info-cell strong {
          font-size: 14px;
          color: var(--text-main);
        }

        .receipt-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .receipt-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text-main);
        }
        
        .receipt-totals {
          border-top: 1px dashed var(--card-border);
          padding-top: 16px;
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-muted);
        }
        .grand-total {
          font-size: 18px;
          font-weight: 800;
          color: var(--primary-color);
          border-top: 1px solid var(--card-border);
          padding-top: 12px;
          margin-top: 4px;
        }

        .success-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .no-receipt {
          padding: 24px;
          color: var(--text-muted);
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .success-card {
            padding: 24px;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
