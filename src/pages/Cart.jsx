import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { setCart, clearCartSuccess } from '../store/slices/cartSlice';
import { cartService } from '../services/cartService';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const [cart, setCartState] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart(null);
      setCartState(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      const updatedCart = await cartService.updateCartItem(null, productId, newQuantity);
      setCartState(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to update quantity:', err);
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm('Remove this item from cart?')) return;

    setUpdating(true);
    try {
      const updatedCart = await cartService.removeCartItem(null, productId);
      setCartState(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Failed to remove item:', err);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) return;

    setUpdating(true);
    try {
      await cartService.clearCart(null);
      setCartState({ items: [], total: 0 });
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Cart cleared');
    } catch (err) {
      console.error('Failed to clear cart:', err);
      toast.error('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    navigate('/checkout');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button className="clear-cart-btn" onClick={handleClearCart} disabled={updating}>
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <FaShoppingCart className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="continue-shopping-btn">
            <span>Continue Shopping</span>
            <FaArrowRight />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="item-details">
                  <Link to={`/products/${item.productId}`} className="item-name">
                    {item.name}
                  </Link>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updating}
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stockQuantity || updating}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.productId)}
                  disabled={updating}
                  title="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{cart.total >= 50 ? 'Free' : '$5.00'}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${(cart.total * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>
                ${(cart.total + (cart.total >= 50 ? 0 : 5) + cart.total * 0.08).toFixed(2)}
              </span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={updating}
            >
              <span>Proceed to Checkout</span>
              <FaArrowRight />
            </button>
            <Link to="/products" className="continue-shopping-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
