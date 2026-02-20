import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userApi = {
  getAll: () => api.get('/users'),
  create: (user) => api.post('/users', user),
};

// Resource APIs
export const resourceApi = {
  getAll: () => api.get('/resources'),
  create: (resource) => api.post('/resources', resource),
  update: (id, resource) => api.put(`/resources/${id}`, resource),
  delete: (id) => api.delete(`/resources/${id}`),
};

// Booking APIs
export const bookingApi = {
  getAll: () => api.get('/bookings'),
  create: (userId, resourceId, booking) =>
    api.post(`/bookings?userId=${userId}&resourceId=${resourceId}`, booking),
  updateStatus: (id, status) =>
    api.put(`/bookings/${id}/status?status=${status}`),
  getByUser: (userId) => api.get(`/bookings/user/${userId}`),
  getByResource: (resourceId) => api.get(`/bookings/resource/${resourceId}`),
  checkAvailability: (resourceId, date, timeSlot) =>
    api.get(`/bookings/check-availability?resourceId=${resourceId}&date=${date}&timeSlot=${timeSlot}`),
};

export default api;
