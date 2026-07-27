import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach JWT + guest cart id to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gully_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  let guestId = localStorage.getItem('gully_guest_id');
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('gully_guest_id', guestId);
  }
  config.headers['x-guest-id'] = guestId;

  return config;
});

// Normalize error messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
