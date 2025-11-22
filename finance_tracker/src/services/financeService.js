import axios from 'axios';

const API_URL = 'http://localhost:5000/api/finance';

// Set up axios defaults
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getFinancialSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching financial summary:', error.response?.data || error.message);
    throw error;
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error.response?.data || error.message);
    throw error;
  }
};

export const updateBudget = async (total) => {
  try {
    const response = await api.put('/budget', { total });
    return response.data;
  } catch (error) {
    console.error('Error updating budget:', error.response?.data || error.message);
    throw error;
  }
};

export const getRecentTransactions = async (limit = 10) => {
  try {
    const response = await api.get(`/transactions/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent transactions:', error.response?.data || error.message);
    throw error;
  }
};
