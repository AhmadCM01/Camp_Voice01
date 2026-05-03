import axios from 'axios';
import { API_URL } from '../config/env';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    
    const customMessage = error.response?.data?.detail;
    if (customMessage) {
      return Promise.reject(new Error(customMessage));
    }
    if (!error.response) {
      return Promise.reject(
        new Error('Network Error: API server is unreachable. Check API base URL and backend status.')
      );
    }
    return Promise.reject(error);
  }
);

export default api;
