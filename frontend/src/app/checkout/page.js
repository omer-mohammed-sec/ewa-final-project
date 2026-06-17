'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartSubtotal, getCartTax, getCartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: 'Gasabo',
  });

  const [paymentMethod, setPaymentMethod] = useState('MTN_MOMO');
  const [isSimulatingMoMo, setIsSimulatingMoMo] = useState(false);
  const [momoPin, setMomoPin] = useState('');
  const [momoError, setMomoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const districts = [
    'Gasabo (Kigali)',
    'Kicukiro (Kigali)',
    'Nyarugenge (Kigali)',
    'Musanze (Northern)',
    'Rubavu (Western)',
    'Huye (Southern)',
    'Rwamagana (Eastern)',
    'Gicumbi (Northern)',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCheckout = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) return;

    if (paymentMethod === 'MTN_MOMO' || paymentMethod === 'AIRTEL_MONEY') {
      // Open Mobile Money USSD Simulator
      setIsSimulatingMoMo(true);
      setMomoPin('');
      setMomoError('');
    } else {
      // Standard Card / PayPal direct checkout submit
      await placeOrder();
    }
  };

  const handleMomoPinSubmit = async () => {
    if (momoPin === '1234') {
      setIsSubmitting(true);
      setMomoError('');
      // Simulate network request delay
      setTimeout(async () => {
        await placeOrder();
      }, 1000);
    } else {
      setMomoError('Invalid PIN! Please try again. (Tip: Use 1234 for demo)');
    }
  };

  const placeOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        customerDetails: formData,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getCartTotal(),
        paymentMethod: paymentMethod === 'MTN_MOMO' ? 'MTN MOMO' : 
                       paymentMethod === 'AIRTEL_MONEY' ? 'AIRTEL MONEY' : 
                       paymentMethod === 'CARD' ? 'CREDIT CARD' : 'PAYPAL',
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      
      if (data.success) {
        // Store customer details in session for success screen display
        sessionStorage.setItem('last_order_details', JSON.stringify({
          orderId: data.orderId,
          customer: formData,
          total: getCartTotal(),
          items: cart,
          paymentMethod: orderData.paymentMethod
        }));
        
        clearCart();
        router.push('/checkout/success');
      } else {
        alert('Checkout failed: ' + (data.error || 'Server error'));
      }
    } catch (e) {
      console.error(e);
      alert('Network checkout error occurred');
    } finally {
      setIsSubmitting(false);
      setIsSimulatingMoMo(false);
    }
  };

  const isEmpty = cart.length === 0;

  return (
    <div className="checkout-page fade-in">
      <div className="container">
        <h1 className="checkout-title font-serif">Secure Checkout</h1>

        {isEmpty ? (
          <div className="empty-checkout card">
            <h2>Your cart is empty</h2>
            <p>You cannot checkout with an empty cart.</p>
            <Link href="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Back to Collection
            </Link>
          </div>
        ) : (
          <div className="checkout-grid">
            {/* Delivery/Payment Form */}
            <form onSubmit={handleSubmitCheckout} className="checkout-form-container">
              <div className="form-section card">
                <h2 className="section-heading font-serif">1. Delivery Details</h2>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Jean Paul Ndayishimiye"
                    className="form-control"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. jeanpaul@domain.rw"
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number (MTN / Airtel)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 0788123456"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group address-group">
                    <label className="form-label" htmlFor="address">Delivery Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. KK 15 St, House 24, Kimihurura"
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group district-group">
                    <label className="form-label" htmlFor="district">Rwandan District</label>
                    <select
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d.split(' ')[0]}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="form-section card" style={{ marginTop: '24px' }}>
                <h2 className="section-heading font-serif">2. Payment Method</h2>
                
                <div className="payment-options-grid">
                  <label className={`payment-option-card card ${paymentMethod === 'MTN_MOMO' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MTN_MOMO"
                      checked={paymentMethod === 'MTN_MOMO'}
                      onChange={() => setPaymentMethod('MTN_MOMO')}
                      className="payment-radio"
                    />
                    <div className="payment-details">
                      <span className="payment-icon">📱</span>
                      <div className="payment-texts">
                        <h3>MTN Mobile Money</h3>
                        <p>Simulate instant MoMo push payment</p>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-option-card card ${paymentMethod === 'AIRTEL_MONEY' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="AIRTEL_MONEY"
                      checked={paymentMethod === 'AIRTEL_MONEY'}
                      onChange={() => setPaymentMethod('AIRTEL_MONEY')}
                      className="payment-radio"
                    />
                    <div className="payment-details">
                      <span className="payment-icon">📲</span>
                      <div className="payment-texts">
                        <h3>Airtel Money</h3>
                        <p>Simulate Airtel Money USSD checkout</p>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-option-card card ${paymentMethod === 'CARD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="payment-radio"
                    />
                    <div className="payment-details">
                      <span className="payment-icon">💳</span>
                      <div className="payment-texts">
                        <h3>Credit / Debit Card</h3>
                        <p>Visa, MasterCard, or UnionPay</p>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-option-card card ${paymentMethod === 'PAYPAL' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAYPAL"
                      checked={paymentMethod === 'PAYPAL'}
                      onChange={() => setPaymentMethod('PAYPAL')}
                      className="payment-radio"
                    />
                    <div className="payment-details">
                      <span className="payment-icon">💸</span>
                      <div className="payment-texts">
                        <h3>PayPal</h3>
                        <p>Pay securely with your PayPal account</p>
                      </div>
                    </div>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-submit-checkout"
                >
                  {isSubmitting ? 'Processing Order...' : 'Place Secure Order'}
                </button>
              </div>
            </form>

            {/* Order Summary Summary Panel */}
            <div className="checkout-summary-container">
              <div className="checkout-summary-card card">
                <h3 className="summary-title font-serif">Review Order</h3>
                
                <div className="checkout-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="checkout-item-row">
                      <span className="item-qty-name">
                        <strong className="item-qty">{item.quantity}x</strong> {item.name}
                      </span>
                      <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="checkout-totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${getCartSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>VAT Tax (18%)</span>
                    <span>${getCartTax().toFixed(2)}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Grand Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MTN / Airtel USSD Mobile Money PIN Simulator Dialog Modal */}
      {isSimulatingMoMo && (
        <div className="ussd-modal-overlay">
          <div className="ussd-phone-mockup fade-in">
            <div className="ussd-phone-screen">
              <div className="ussd-carrier-row">
                <span>{paymentMethod === 'MTN_MOMO' ? 'MTN Rwanda' : 'Airtel RW'}</span>
                <span>📶 🔋 100%</span>
              </div>
              
              <div className="ussd-dialog-box">
                <div className="ussd-dialog-title">
                  {paymentMethod === 'MTN_MOMO' ? 'MTN Mobile Money' : 'Airtel Money'}
                </div>
                
                <div className="ussd-dialog-content">
                  <p>Pay Agaseke Heritage Market</p>
                  <p>Amount: <strong>${getCartTotal().toFixed(2)}</strong></p>
                  <p>Ref: ORDER-{Math.floor(Math.random() * 90000) + 10000}</p>
                  <p className="ussd-prompt">Enter 4-digit MoMo PIN to authorize transaction:</p>
                  
                  <input
                    type="password"
                    maxLength={4}
                    value={momoPin}
                    onChange={(e) => setMomoPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter PIN"
                    className="ussd-input"
                    disabled={isSubmitting}
                    autoFocus
                  />
                  
                  {momoError && <div className="ussd-error-msg">{momoError}</div>}
                  <div className="ussd-hint">(Demo PIN: 1234)</div>
                </div>
                
                <div className="ussd-dialog-actions">
                  <button
                    type="button"
                    onClick={() => setIsSimulatingMoMo(false)}
                    className="ussd-btn ussd-btn-cancel"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleMomoPinSubmit}
                    className="ussd-btn ussd-btn-send"
                    disabled={isSubmitting || momoPin.length < 4}
                  >
                    {isSubmitting ? 'Confirming...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .checkout-page {
          padding: 60px 0 80px 0;
        }
        .checkout-title {
          font-size: 36px;
          color: var(--primary-color);
          margin-bottom: 32px;
        }
        
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
          align-items: start;
        }

        .form-section {
          padding: 32px;
        }
        .section-heading {
          font-size: 22px;
          color: var(--primary-color);
          margin-bottom: 24px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .address-group {
          flex: 2;
        }
        .district-group {
          flex: 1;
        }

        /* Payment Options Grid */
        .payment-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }
        .payment-option-card {
          position: relative;
          padding: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .payment-option-card.selected {
          border-color: var(--primary-color);
          background-color: rgba(12, 66, 37, 0.02);
          box-shadow: var(--shadow-sm);
        }
        .payment-radio {
          position: absolute;
          top: 16px;
          right: 16px;
          accent-color: var(--primary-color);
        }
        .payment-details {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .payment-icon {
          font-size: 32px;
        }
        .payment-texts h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 2px;
        }
        .payment-texts p {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.3;
        }
        .btn-submit-checkout {
          width: 100%;
          padding: 14px;
        }

        /* Review Order Panel */
        .checkout-summary-card {
          padding: 32px;
        }
        .summary-title {
          font-size: 20px;
          color: var(--primary-color);
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .checkout-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .checkout-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text-main);
        }
        .item-qty {
          color: var(--accent-color);
        }
        .checkout-totals {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text-muted);
        }
        .total-row {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          border-top: 1px dashed var(--card-border);
          padding-top: 14px;
          margin-top: 8px;
        }

        /* USSD Modal Overlay */
        .ussd-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .ussd-phone-mockup {
          width: 320px;
          height: auto;
          background-color: #2b2b2b;
          border-radius: 36px;
          padding: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 4px solid #474747;
        }
        .ussd-phone-screen {
          background-color: #0c0e0d;
          border-radius: 24px;
          height: 480px;
          color: #fff;
          padding: 16px;
          display: flex;
          flex-direction: column;
          position: relative;
          font-family: monospace, sans-serif;
        }
        .ussd-carrier-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #8c8c8c;
          margin-bottom: 80px;
        }
        
        .ussd-dialog-box {
          background-color: #f3f3f3;
          border-radius: 12px;
          color: #000;
          padding: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
        }
        .ussd-dialog-title {
          font-weight: 800;
          font-size: 15px;
          margin-bottom: 12px;
          border-bottom: 2px solid #dfa116;
          padding-bottom: 4px;
          color: #0c4225;
        }
        .ussd-dialog-content {
          font-size: 12px;
          line-height: 1.5;
        }
        .ussd-prompt {
          margin-top: 8px;
          font-weight: 700;
        }
        .ussd-input {
          width: 100%;
          padding: 8px;
          font-size: 16px;
          letter-spacing: 6px;
          text-align: center;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin: 8px 0;
          background-color: #fff;
          color: #000;
        }
        .ussd-error-msg {
          color: red;
          font-size: 10px;
          font-weight: 700;
          margin-top: 4px;
          text-align: center;
        }
        .ussd-hint {
          color: #666;
          font-size: 9px;
          text-align: center;
          margin-top: 4px;
        }
        .ussd-dialog-actions {
          display: flex;
          border-top: 1px solid #ccc;
          margin-top: 16px;
          padding-top: 8px;
          gap: 12px;
        }
        .ussd-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          border-radius: 4px;
        }
        .ussd-btn:hover {
          background-color: #e6e6e6;
        }
        .ussd-btn-send {
          color: #0c4225;
        }
        .ussd-btn-cancel {
          color: #c2410c;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .payment-options-grid {
            grid-template-columns: 1fr;
          }
          .form-section {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
