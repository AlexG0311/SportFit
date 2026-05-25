import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        AsyncStorage.removeItem('auth_token');
      }
      return Promise.reject({
        status,
        message: data?.detail || data?.message || 'Error del servidor',
      });
    }
    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Sin conexión al servidor',
      });
    }
    return Promise.reject({
      status: -1,
      message: error.message || 'Error desconocido',
    });
  }
);

export default api;
