import api from './api';

export const paymentService = {
  initiatePayment: (orderId) => api.post(`/payments/initiate`, { orderId }),
  getPaymentStatus: (orderId) => api.get(`/payments/status/${orderId}`),
};
