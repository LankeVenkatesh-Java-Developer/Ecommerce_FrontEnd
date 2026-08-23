import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { setCart, clearCartSuccess } from '../store/slices/cartSlice';
import { cartService } from '../services/cartService';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

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
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button className="btn-danger-3d" onClick={handleClearCart} disabled={updating}>
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="card-3d-xl p-12 text-center">
          <FaShoppingCart className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started!</p>
          <Link to="/products" className="btn-primary-3d inline-flex items-center">
            <span>Continue Shopping</span>
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="card-3d p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <Link to={`/products/${item.productId}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="btn-secondary-3d w-8 h-8 p-0 flex items-center justify-center"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      className="btn-secondary-3d w-8 h-8 p-0 flex items-center justify-center"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity || updating}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="btn-danger-3d w-8 h-8 p-0 flex items-center justify-center"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={updating}
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card-3d p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>{cart.total >= 50 ? 'Free' : '$5.00'}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span>${(cart.total * 0.08).toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>
                    ${(cart.total + (cart.total >= 50 ? 0 : 5) + cart.total * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                className="btn-primary-3d w-full mb-4"
                onClick={handleCheckout}
                disabled={updating}
              >
                <span>Proceed to Checkout</span>
                <FaArrowRight className="ml-2" />
              </button>
              <Link to="/products" className="block text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
