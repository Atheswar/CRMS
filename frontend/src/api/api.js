import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const getUsersAPI = () => api.get('/users');
export const createUserAPI = (user) => api.post('/users', user);
export const deleteUserAPI = (id) => api.delete(`/users/${id}`);

// Resource APIs
export const getResourcesAPI = () => api.get('/resources');
export const createResourceAPI = (resource) => api.post('/resources', resource);
export const updateResourceAPI = (id, resource) => api.put(`/resources/${id}`, resource);
export const deleteResourceAPI = (id) => api.delete(`/resources/${id}`);

// Booking APIs
export const getBookingsAPI = () => api.get('/bookings');
export const createBookingAPI = (userId, resourceId, booking) =>
  api.post(`/bookings?userId=${userId}&resourceId=${resourceId}`, booking);
export const updateBookingStatusAPI = (id, status) =>
  api.put(`/bookings/${id}/status?status=${status}`);
export const deleteBookingAPI = (id) => api.delete(`/bookings/${id}`);
export const getBookingsByUserAPI = (userId) => api.get(`/bookings/user/${userId}`);
export const getBookingsByResourceAPI = (resourceId) => api.get(`/bookings/resource/${resourceId}`);
export const checkAvailabilityAPI = (resourceId, date, timeSlot) =>
  api.get(`/bookings/check-availability?resourceId=${resourceId}&date=${date}&timeSlot=${timeSlot}`);

export default api;
