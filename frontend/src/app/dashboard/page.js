'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

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

  // Load orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      console.error(e);
      alert('Network error updating status');
    }
  };

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Category counts
  const categoryCounts = {};
  orders.forEach(order => {
    if (order.status !== 'CANCELLED') {
      order.items?.forEach(item => {
        const cat = item.product?.category || 'Baskets';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
      });
    }
  });

  // If empty category, fill with mock counts
  if (Object.keys(categoryCounts).length === 0) {
    categoryCounts['Baskets'] = 14;
    categoryCounts['Art'] = 6;
    categoryCounts['Coffee'] = 22;
    categoryCounts['Accessories'] = 9;
  }

  // Render SVG Sales Bar Chart
  const categoriesList = Object.keys(categoryCounts);
  const countsList = Object.values(categoryCounts);
  const maxCount = Math.max(...countsList, 1);

  return (
    <div className="dashboard-page fade-in">
      <div className="container">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title font-serif">Management Portal</h1>
            <p className="dashboard-subtitle">Monitor shop activities, sales reports, and customer shipments.</p>
          </div>
          
          <div className="tab-buttons">
            <button
              onClick={() => setActiveTab('orders')}
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            >
              Order Registry ({totalOrders})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              Sales Analytics
            </button>
          </div>
        </div>

        {/* Metrics Widgets Row */}
        <div className="metrics-grid">
          <div className="metric-card card">
            <div className="metric-header-row">
              <span className="metric-label">Total Revenue</span>
              <span className="metric-icon">💰</span>
            </div>
            <div className="metric-value">${totalRevenue.toFixed(2)}</div>
            <div className="metric-footer">Includes 18% VAT standard</div>
          </div>
          
          <div className="metric-card card">
            <div className="metric-header-row">
              <span className="metric-label">Completed Orders</span>
              <span className="metric-icon">📦</span>
            </div>
            <div className="metric-value">{totalOrders}</div>
            <div className="metric-footer">Across all provinces</div>
          </div>
          
          <div className="metric-card card">
            <div className="metric-header-row">
              <span className="metric-label">Average Ticket</span>
              <span className="metric-icon">🏷️</span>
            </div>
            <div className="metric-value">${avgOrderValue.toFixed(2)}</div>
            <div className="metric-footer">Calculated per customer order</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Retrieving portal database records...</p>
          </div>
        ) : activeTab === 'orders' ? (
          /* Order Registry Table View */
          <div className="orders-table-wrapper card">
            <div className="card-table-title font-serif">Incoming Order Pipeline</div>
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer / District</th>
                    <th>Date Placed</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Order Items</th>
                    <th>Status Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-table-data">
                        No orders recorded yet in system database.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id}>
                        <td className="order-id-cell font-mono">{o.id.substring(0, 13)}</td>
                        <td>
                          <div className="customer-cell">
                            <strong>{o.customer?.name}</strong>
                            <span>{o.customer?.district} Province</span>
                          </div>
                        </td>
                        <td className="date-cell">
                          {new Date(o.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <span className="method-badge">{o.paymentMethod}</span>
                        </td>
                        <td className="amount-cell">${o.total.toFixed(2)}</td>
                        <td>
                          <div className="items-summary-list">
                            {o.items?.map((item, idx) => (
                              <span key={idx} className="item-summary-pill">
                                {item.quantity}x {item.product?.name.substring(0, 20)}...
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`status-select status-${o.status.toLowerCase()}`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Sales Analytics Charts View */
          <div className="analytics-charts-grid">
            {/* SVG Category Bar Chart */}
            <div className="chart-card card">
              <h3 className="chart-title font-serif">Volume Sold by Category</h3>
              <div className="svg-chart-container">
                <svg viewBox="0 0 400 240" className="svg-chart">
                  {/* Grid Lines */}
                  <line x1="50" y1="30" x2="370" y2="30" stroke="#eee" />
                  <line x1="50" y1="80" x2="370" y2="80" stroke="#eee" />
                  <line x1="50" y1="130" x2="370" y2="130" stroke="#eee" />
                  <line x1="50" y1="180" x2="370" y2="180" stroke="#ccc" strokeWidth="2" />
                  
                  {/* Bars */}
                  {categoriesList.map((cat, idx) => {
                    const count = categoryCounts[cat];
                    const barHeight = (count / maxCount) * 120;
                    const barWidth = 40;
                    const x = 75 + idx * 75;
                    const y = 180 - barHeight;
                    
                    return (
                      <g key={cat}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          fill="var(--primary-color)"
                          rx="4"
                          className="chart-bar"
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="700"
                          fill="var(--text-main)"
                        >
                          {count}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y="200"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill="var(--text-muted)"
                        >
                          {cat}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Y Axis Labels */}
                  <text x="40" y="34" textAnchor="end" fontSize="10" fill="#999">Max</text>
                  <text x="40" y="105" textAnchor="end" fontSize="10" fill="#999">Mid</text>
                  <text x="40" y="184" textAnchor="end" fontSize="10" fill="#999">0</text>
                </svg>
              </div>
            </div>

            {/* Geographical Distribution */}
            <div className="chart-card card">
              <h3 className="chart-title font-serif">Delivery Province Distribution</h3>
              <div className="geo-distribution-list">
                {districts.map((d) => {
                  const districtName = d.split(' ')[0];
                  const matchCount = orders.filter(o => o.customer?.district === districtName).length;
                  const percent = orders.length > 0 ? (matchCount / orders.length) * 100 : 0;
                  
                  return (
                    <div key={d} className="geo-row">
                      <div className="geo-meta">
                        <span className="geo-name">{d}</span>
                        <span className="geo-count">{matchCount} orders ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="geo-progress-bar-bg">
                        <div className="geo-progress-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 60px 0 80px 0;
          background-color: var(--bg-color);
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 24px;
        }
        .dashboard-title {
          font-size: 36px;
          color: var(--primary-color);
          margin-bottom: 6px;
        }
        .dashboard-subtitle {
          color: var(--text-muted);
          font-size: 15px;
        }

        .tab-buttons {
          display: flex;
          gap: 12px;
          background-color: var(--card-bg);
          padding: 6px;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--card-border);
        }
        .tab-btn {
          border: none;
          background: none;
          padding: 10px 20px;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          color: var(--text-muted);
          transition: var(--transition-smooth);
        }
        .tab-btn.active {
          background-color: var(--primary-color);
          color: var(--text-light);
        }

        /* Metrics Row */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 40px;
        }
        .metric-card {
          padding: 24px;
          background-color: var(--card-bg);
        }
        .metric-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .metric-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .metric-icon {
          font-size: 20px;
        }
        .metric-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--primary-color);
          margin-bottom: 8px;
        }
        .metric-footer {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Loading Spinner */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 0;
          gap: 16px;
          color: var(--text-muted);
        }

        /* Orders Table */
        .orders-table-wrapper {
          padding: 32px;
          background-color: var(--card-bg);
        }
        .card-table-title {
          font-size: 22px;
          color: var(--primary-color);
          margin-bottom: 24px;
        }
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        .orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .orders-table th {
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          padding: 16px;
          border-bottom: 2px solid var(--card-border);
        }
        .orders-table td {
          padding: 16px;
          border-bottom: 1px solid var(--card-border);
          font-size: 14px;
        }
        .orders-table tr:hover td {
          background-color: rgba(12, 66, 37, 0.01);
        }
        .order-id-cell {
          font-size: 11px;
          color: var(--text-muted);
        }
        .customer-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .customer-cell span {
          font-size: 11px;
          color: var(--text-muted);
        }
        .date-cell {
          color: var(--text-muted);
        }
        .method-badge {
          background-color: rgba(229, 169, 25, 0.1);
          color: #b5810d;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .amount-cell {
          font-weight: 700;
          color: var(--text-main);
        }
        .items-summary-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .item-summary-pill {
          font-size: 11px;
          color: var(--text-muted);
          background-color: var(--bg-color);
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .no-table-data {
          text-align: center;
          color: var(--text-muted);
          padding: 40px !important;
        }

        /* Status Dropdown Selector */
        .status-select {
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 11px;
          border: 1px solid #ccc;
          outline: none;
          cursor: pointer;
        }
        .status-select.status-pending {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
          border-color: rgba(245, 158, 11, 0.3);
        }
        .status-select.status-paid {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
          border-color: rgba(16, 185, 129, 0.3);
        }
        .status-select.status-shipped {
          background-color: rgba(12, 66, 37, 0.1);
          color: var(--primary-color);
          border-color: rgba(12, 66, 37, 0.3);
        }
        .status-select.status-delivered {
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.3);
        }

        /* Analytics Tab Charts */
        .analytics-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        .chart-card {
          padding: 32px;
        }
        .chart-title {
          font-size: 20px;
          color: var(--primary-color);
          margin-bottom: 24px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 12px;
        }
        .svg-chart-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .svg-chart {
          width: 100%;
          max-width: 400px;
          height: auto;
        }
        .chart-bar {
          transition: transform 0.3s ease;
          transform-origin: bottom;
        }
        .chart-bar:hover {
          filter: brightness(1.1);
          transform: scaleY(1.02);
        }

        /* Geo distribution list */
        .geo-distribution-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .geo-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .geo-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        .geo-name {
          font-weight: 700;
          color: var(--text-main);
        }
        .geo-count {
          color: var(--text-muted);
        }
        .geo-progress-bar-bg {
          width: 100%;
          height: 8px;
          background-color: var(--bg-color);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid var(--card-border);
        }
        .geo-progress-fill {
          height: 100%;
          background-color: var(--secondary-color);
          border-radius: 4px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .analytics-charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
