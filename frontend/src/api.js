import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  getMedicines: (params = {}) => apiClient.get('/medicines', { params }),
  getMedicineById: (id) => apiClient.get(`/medicines/${id}`),
  createMedicine: (data) => apiClient.post('/medicines', data),
  updateMedicine: (id, data) => apiClient.put(`/medicines/${id}`, data),
  deleteMedicine: (id) => apiClient.delete(`/medicines/${id}`),
  searchMedicines: (q) => apiClient.get('/medicines/search', { params: { q } }),
  getStats: () => apiClient.get('/stats'),
  getCategories: () => apiClient.get('/categories'),
  getManufacturers: () => apiClient.get('/manufacturers'),
};

export default api;
