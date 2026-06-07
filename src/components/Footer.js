import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <h3 className="footer-title">Agaseke Heritage Market</h3>
          <p className="footer-desc">
            A premium e-commerce platform dedicated to empowering local Rwandan artisans, weavers, and coffee growers by connecting traditional heritage craftsmanship directly to the online marketplace.
          </p>
        </div>
        
        <div className="footer-links-group">
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <Link href="/products" className="footer-link">Shop Crafts</Link>
            <Link href="/products?category=Baskets" className="footer-link">Traditional Baskets</Link>
            <Link href="/products?category=Art" className="footer-link">Imigongo Art</Link>
            <Link href="/products?category=Coffee" className="footer-link">Specialty Coffee</Link>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">System</h4>
            <Link href="/dashboard" className="footer-link">Owner Dashboard</Link>
            <Link href="/cart" className="footer-link">My Shopping Cart</Link>
            <span className="footer-tag">Kigali, Rwanda</span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright">&copy; {new Date().getFullYear()} Agaseke Heritage Market. Built with pride in Rwanda.</p>
          <div className="footer-badges">
            <span className="footer-badge">MTN MoMo Enabled</span>
            <span className="footer-badge">Airtel Money Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
