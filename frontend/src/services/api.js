import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

const transactionService = {
  getAll: (params) => api.get('/transactions', { params }),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getCategories: () => api.get('/transactions/categories'),
};

const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

const userService = {
  getAll: () => api.get('/users'),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
};

export { authService, transactionService, analyticsService, userService };

export default api;
