import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowRight, FaMinus, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { setCart } from '../store/slices/cartSlice';
import { cartService } from '../services/cartService';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cart, setCartState] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
      const data = await cartService.getCart(user?.id);
      setCartState(data);
      dispatch(setCart(data));
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
      const updatedCart = await cartService.updateCartItem(user?.id, productId, newQuantity);
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
      const updatedCart = await cartService.removeCartItem(user?.id, productId);
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
      await cartService.clearCart(user?.id);
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
        <div className="card-3d-xl p-16 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FaShoppingCart className="text-5xl text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to add some amazing products!
          </p>
          <Link to="/products" className="btn-primary-3d inline-flex items-center text-lg px-8 py-4">
            <span>Start Shopping</span>
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="card-3d p-6 group hover:shadow-3d-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Link to={`/products/${item.productId}`} className="block">
                      <img 
                        src={item.imageUrl || 'https://via.placeholder.com/100?text=Product'} 
                        alt={item.name} 
                        className="w-28 h-28 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100?text=Product';
                        }}
                      />
                    </Link>
                  </div>
                  <div className="flex-1">
                    <Link to={`/products/${item.productId}`} className="font-semibold text-lg text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{item.brand || 'Product'}</p>
                    {item.sku && <p className="text-gray-400 dark:text-gray-500 text-xs mb-2">SKU: {item.sku}</p>}
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
                      <button
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating}
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-900 dark:text-white text-lg">{item.quantity}</span>
                      <button
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stockQuantity || updating}
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      className="btn-danger-3d w-12 h-12 p-0 flex items-center justify-center rounded-xl hover:scale-110 transition-transform"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={updating}
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card-3d-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">${(cart.total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={`font-semibold ${(cart.total || 0) >= 50 ? 'text-green-500' : ''}`}>
                    {(cart.total || 0) >= 50 ? 'Free' : '$5.00'}
                  </span>
                </div>
                {(cart.total || 0) < 50 && (
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Add ${(50 - (cart.total || 0)).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${((cart.total || 0) * 0.08).toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-2xl">
                    ${((cart.total || 0) + ((cart.total || 0) >= 50 ? 0 : 5) + (cart.total || 0) * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                className="btn-primary-3d w-full mb-4 text-lg py-4"
                onClick={handleCheckout}
                disabled={updating}
              >
                <span>Proceed to Checkout</span>
                <FaArrowRight className="ml-2" />
              </button>
              <Link to="/products" className="block text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">
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
