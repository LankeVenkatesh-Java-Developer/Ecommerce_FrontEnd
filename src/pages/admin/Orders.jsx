import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import adminManagementService from '../../services/adminManagementService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminManagementService.getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminManagementService.updateOrder(orderId, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await adminManagementService.cancelOrder(orderId);
        await fetchOrders();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="admin-orders">
      <div className="page-header">
        <h1>Order Management</h1>
        <p>View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by order number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.orderNumber || order.id}</td>
                  <td>{order.customerName || `User ${order.userId}`}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(order)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {order.status === 'PENDING' && (
                      <button
                        className="btn-confirm"
                        onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                        title="Confirm Order"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelOrder(order.id)}
                        title="Cancel Order"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <div className="info-group">
                  <label>Order Number:</label>
                  <span>#{selectedOrder.orderNumber || selectedOrder.id}</span>
                </div>
                <div className="info-group">
                  <label>Customer:</label>
                  <span>{selectedOrder.customerName || `User ${selectedOrder.userId}`}</span>
                </div>
                <div className="info-group">
                  <label>Date:</label>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
                <div className="info-group">
                  <label>Status:</label>
                  <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="info-group">
                  <label>Total Amount:</label>
                  <span>${selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="order-items">
                  <h3>Order Items</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productName || `Product ${item.productId}`}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price?.toFixed(2) || '0.00'}</td>
                          <td>${(item.quantity * item.price)?.toFixed(2) || '0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedOrder.shippingAddress && (
                <div className="shipping-info">
                  <h3>Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p>{selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
