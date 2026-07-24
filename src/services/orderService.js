import api from './api';

export const orderService = {
  checkout: (data) => api.post('/orders/checkout', data),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getAllOrders: (params) => api.get('/orders/admin/all', { params }),
};
