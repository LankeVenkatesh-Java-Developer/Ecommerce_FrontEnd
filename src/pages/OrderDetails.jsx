import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { ORDER_STATUS } from '../utils/constants';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrderById(parseInt(id));
      setOrder(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      await orderService.cancelOrder(order.id);
      toast.success('Order cancelled successfully');
      fetchOrder();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel order';
      toast.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return <FaBox />;
      case ORDER_STATUS.CONFIRMED:
        return <FaCheckCircle />;
      case ORDER_STATUS.SHIPPED:
        return <FaTruck />;
      case ORDER_STATUS.DELIVERED:
        return <FaCheckCircle />;
      case ORDER_STATUS.CANCELLED:
        return <FaTimesCircle />;
      default:
        return <FaBox />;
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <div className="order-details-container">
        <ErrorMessage message={error || 'Order not found'} onDismiss={() => setError('')} />
        <Link to="/orders" className="back-link">
          <FaArrowLeft />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const statusSteps = [
    { key: ORDER_STATUS.PENDING, label: 'Pending' },
    { key: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
    { key: ORDER_STATUS.SHIPPED, label: 'Shipped' },
    { key: ORDER_STATUS.DELIVERED, label: 'Delivered' },
  ];

  const currentStatusIndex = statusSteps.findIndex((step) => step.key === order.status);

  return (
    <div className="order-details-container">
      <Link to="/orders" className="back-link">
        <FaArrowLeft />
        <span>Back to Orders</span>
      </Link>

      <div className="order-details">
        <div className="order-header">
          <div>
            <h1>Order #{order.id}</h1>
            <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="order-status-badge">
            <span
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {getStatusIcon(order.status)}
              <span>{order.status}</span>
            </span>
          </div>
        </div>

        {/* Order Progress */}
        {order.status !== ORDER_STATUS.CANCELLED && (
          <div className="order-progress">
            {statusSteps.map((step, index) => (
              <div
                key={step.key}
                className={`progress-step ${index <= currentStatusIndex ? 'active' : ''} ${
                  index === currentStatusIndex ? 'current' : ''
                }`}
              >
                <div className="step-icon">{index <= currentStatusIndex ? <FaCheckCircle /> : <FaBox />}</div>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="order-content">
          {/* Order Items */}
          <div className="order-section">
            <h2>Order Items</h2>
            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item.productId} className="order-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="item-details">
                    <Link to={`/products/${item.productId}`} className="item-name">
                      {item.name}
                    </Link>
                    <p className="item-qty">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="order-section">
            <h2>Shipping Address</h2>
            <div className="shipping-address">
              <p className="address-type">{order.shippingAddress.addressType}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="order-section">
            <h2>Payment Information</h2>
            <div className="payment-info">
              <div className="info-row">
                <span>Payment Method</span>
                <span className="info-value">
                  {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="info-row">
                <span>Payment Status</span>
                <span className="info-value">{order.paymentStatus || 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-section order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Actions */}
        {order.status === ORDER_STATUS.PENDING && (
          <div className="order-actions">
            <button
              className="cancel-order-btn"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? <Loading size="small" /> : 'Cancel Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
