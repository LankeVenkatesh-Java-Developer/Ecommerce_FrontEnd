// Placeholder service with mock data - to be replaced with real backend API calls
import { ORDER_ENDPOINTS } from '../api/endpoints';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants';

// Mock orders data (stored in localStorage for persistence)
const getOrdersFromStorage = () => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

const saveOrdersToStorage = (orders) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const orderService = {
  createOrder: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const orders = getOrdersFromStorage();
    const newOrder = {
      id: orders.length + 1,
      userId: orderData.userId,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost || 0,
      tax: orderData.tax || 0,
      total: orderData.total,
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveOrdersToStorage(orders);

    return newOrder;
  },

  getOrders: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const orders = getOrdersFromStorage();
    return orders.filter(order => order.userId === userId);
  },

  getOrderById: async (orderId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const orders = getOrdersFromStorage();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  },

  updateOrderStatus: async (orderId, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex > -1) {
      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      saveOrdersToStorage(orders);
      return orders[orderIndex];
    }

    throw new Error('Order not found');
  },

  cancelOrder: async (orderId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex > -1) {
      orders[orderIndex].status = ORDER_STATUS.CANCELLED;
      orders[orderIndex].updatedAt = new Date().toISOString();
      saveOrdersToStorage(orders);
      return orders[orderIndex];
    }

    throw new Error('Order not found');
  },
};
