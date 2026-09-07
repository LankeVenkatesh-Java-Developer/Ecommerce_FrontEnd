import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaTruck, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { cartService } from '../services/cartService';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [cart, setCart] = useState({ items: [], total: 0 });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cartData, addressesData] = await Promise.all([
        cartService.getCart(null),
        userService.getAddresses(user.id),
      ]);
      setCart(cartData);
      setAddresses(addressesData);

      const defaultAddress = addressesData.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (addressesData.length > 0) {
        setSelectedAddress(addressesData[0].id);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return false;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (!cardDetails.cardName) {
        toast.error('Please enter the cardholder name');
        return false;
      }
      if (!cardDetails.expiryDate) {
        toast.error('Please enter the expiry date');
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    setError('');

    try {
      const shippingAddress = addresses.find((addr) => addr.id === selectedAddress);

      const orderData = {
        userId: user.id,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentMethod,
        subtotal: cart.total,
        shippingCost: cart.total >= 50 ? 0 : 5,
        tax: cart.total * 0.08,
        total: cart.total + (cart.total >= 50 ? 0 : 5) + cart.total * 0.08,
      };

      const order = await orderService.createOrder(orderData);
      
      await cartService.clearCart(null);
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to place order';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some products before checkout</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = cart.total >= 50 ? 0 : 5;
  const tax = cart.total * 0.08;
  const total = cart.total + shippingCost + tax;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="checkout-layout">
        {/* Left Column - Forms */}
        <div className="checkout-forms">
          {/* Shipping Address */}
          <div className="checkout-section">
            <h2><FaMapMarkerAlt /> Shipping Address</h2>
            {addresses.length === 0 ? (
              <div className="no-address">
                <p>No addresses found. Please add an address.</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/profile')}
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="address-list">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`address-option ${selectedAddress === address.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddress === address.id}
                      onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                    />
                    <div className="address-content">
                      <div className="address-type">{address.addressType}</div>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h2><FaCreditCard /> Payment Method</h2>
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-icon">
                  <FaCreditCard />
                </div>
                <div className="payment-info">
                  <span className="payment-label">Credit/Debit Card</span>
                  <span className="payment-desc">Pay securely with your card</span>
                </div>
              </label>
              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="payment-info">
                  <span className="payment-label">Cash on Delivery</span>
                  <span className="payment-desc">Pay when you receive</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-details">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={cardDetails.cardName}
                    onChange={handleCardChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.items.map((item) => (
              <div key={item.productId} className="summary-item">
                <div className="item-image-wrapper">
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/60?text=Product'} 
                    alt={item.name}
                    className="item-thumb"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60?text=Product';
                    }}
                  />
                </div>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">x{item.quantity}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={processing || !selectedAddress}
          >
            {processing ? <Loading size="small" /> : 'Place Order'}
          </button>
          <p className="secure-notice">
            <FaTruck /> Free shipping on orders over $50
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
