// Placeholder service with mock data - to be replaced with real backend API calls
import { PAYMENT_ENDPOINTS } from '../api/endpoints';
import { PAYMENT_STATUS } from '../utils/constants';

export const paymentService = {
  createPayment: async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate payment processing
    const payment = {
      id: `PAY-${Date.now()}`,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: 'USD',
      paymentMethod: paymentData.paymentMethod,
      status: PAYMENT_STATUS.COMPLETED,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return payment;
  },

  verifyPayment: async (paymentId) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    // Simulate payment verification
    const payment = {
      id: paymentId,
      status: PAYMENT_STATUS.COMPLETED,
      verifiedAt: new Date().toISOString(),
    };

    return payment;
  },

  processRefund: async (paymentId, amount) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simulate refund processing
    const refund = {
      id: `REF-${Date.now()}`,
      paymentId: paymentId,
      amount: amount,
      status: 'PROCESSED',
      processedAt: new Date().toISOString(),
    };

    return refund;
  },
};
