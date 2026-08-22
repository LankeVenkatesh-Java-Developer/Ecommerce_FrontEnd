import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaEye, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { ORDER_STATUS } from '../utils/constants';
import './Orders.css';

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(user.id);
      setOrders(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(orderId);
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel order';
      toast.error(errorMessage);
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return '#f59e0b';
      case ORDER_STATUS.CONFIRMED:
        return '#3498db';
      case ORDER_STATUS.SHIPPED:
        return '#9b59b6';
      case ORDER_STATUS.DELIVERED:
        return '#48bb78';
      case ORDER_STATUS.CANCELLED:
        return '#e74c3c';
      default:
        return '#718096';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {orders.length === 0 ? (
        <div className="empty-orders">
          <FaBox className="empty-icon" />
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="browse-products-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div className="order-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.productId} className="order-item-preview">
                    <img src={item.imageUrl} alt={item.name} />
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="more-items">+{order.items.length - 3} more</span>
                )}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">${order.total.toFixed(2)}</span>
                </div>
                <div className="order-actions">
                  <Link to={`/orders/${order.id}`} className="view-order-btn">
                    <FaEye />
                    <span>View Details</span>
                  </Link>
                  {order.status === ORDER_STATUS.PENDING && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelling === order.id}
                    >
                      {cancelling === order.id ? (
                        <Loading size="small" />
                      ) : (
                        <>
                          <FaTimes />
                          <span>Cancel</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
