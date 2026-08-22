// Placeholder service with mock data - to be replaced with real backend API calls
import { CART_ENDPOINTS } from '../api/endpoints';

// Mock cart data (stored in localStorage for persistence)
const getCartFromStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : { items: [], total: 0 };
};

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const cartService = {
  getCart: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const cart = getCartFromStorage();
    return cart;
  },

  addToCart: async (userId, product, quantity = 1) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const cart = getCartFromStorage();

    const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
        stockQuantity: product.stockQuantity,
      });
    }

    cart.total = calculateTotal(cart.items);
    saveCartToStorage(cart);

    return cart;
  },

  updateCartItem: async (userId, itemId, quantity) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const cart = getCartFromStorage();

    const itemIndex = cart.items.findIndex(item => item.productId === itemId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }

      cart.total = calculateTotal(cart.items);
      saveCartToStorage(cart);
    }

    return cart;
  },

  removeCartItem: async (userId, itemId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const cart = getCartFromStorage();

    const itemIndex = cart.items.findIndex(item => item.productId === itemId);

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      cart.total = calculateTotal(cart.items);
      saveCartToStorage(cart);
    }

    return cart;
  },

  clearCart: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const cart = { items: [], total: 0 };
    saveCartToStorage(cart);
    return cart;
  },

  getCartItemCount: () => {
    const cart = getCartFromStorage();
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  },
};
