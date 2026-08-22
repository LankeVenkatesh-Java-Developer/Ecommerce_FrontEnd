import React, { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import Loading from '../../components/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersData, productsData] = await Promise.all([
        orderService.getOrders(0), // Get all orders for demo
        productService.getAllProducts({ pageSize: 1 }),
      ]);

      const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);

      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        totalProducts: productsData.total,
        totalUsers: 150, // Mock value
      });

      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Welcome to your admin dashboard</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
            <span className="stat-change positive">
              <FaArrowUp /> 12.5%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <span className="stat-change positive">
              <FaArrowUp /> 8.2%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <FaBox />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <span className="stat-change positive">
              <FaArrowUp /> 5.1%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <span className="stat-change negative">
              <FaArrowDown /> 2.3%
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <h2>Recent Orders</h2>
        <div className="recent-orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>User {order.userId}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div className="empty-state">No recent orders</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn">
            <FaBox />
            <span>Add New Product</span>
          </button>
          <button className="action-btn">
            <FaTags />
            <span>Add Category</span>
          </button>
          <button className="action-btn">
            <FaChartBar />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
