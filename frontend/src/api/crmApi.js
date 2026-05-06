import axios from 'axios';
import { authStorage } from './auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clearSession();
    }
    return Promise.reject(error);
  }
);

const unwrap = (request) => request.then((response) => response.data);

export const crmApi = {
  auth: {
    login: (payload) => unwrap(apiClient.post('/auth/login', payload))
  },
  users: {
    list: () => unwrap(apiClient.get('/users')),
    get: (id) => unwrap(apiClient.get(`/users/${id}`)),
    create: (payload) => unwrap(apiClient.post('/users', payload)),
    update: (id, payload) => unwrap(apiClient.put(`/users/${id}`, payload)),
    remove: (id) => unwrap(apiClient.delete(`/users/${id}`))
  },
  customers: {
    list: () => unwrap(apiClient.get('/customers')),
    get: (id) => unwrap(apiClient.get(`/customers/${id}`)),
    create: (payload) => unwrap(apiClient.post('/customers', payload)),
    update: (id, payload) => unwrap(apiClient.put(`/customers/${id}`, payload)),
    remove: (id) => unwrap(apiClient.delete(`/customers/${id}`))
  },
  deals: {
    list: () => unwrap(apiClient.get('/deals')),
    get: (id) => unwrap(apiClient.get(`/deals/${id}`)),
    create: (payload) => unwrap(apiClient.post('/deals', payload)),
    update: (id, payload) => unwrap(apiClient.put(`/deals/${id}`, payload)),
    remove: (id) => unwrap(apiClient.delete(`/deals/${id}`))
  },
  tasks: {
    list: () => unwrap(apiClient.get('/tasks')),
    get: (id) => unwrap(apiClient.get(`/tasks/${id}`)),
    create: (payload) => unwrap(apiClient.post('/tasks', payload)),
    update: (id, payload) => unwrap(apiClient.put(`/tasks/${id}`, payload)),
    remove: (id) => unwrap(apiClient.delete(`/tasks/${id}`))
  },
  activities: {
    list: () => unwrap(apiClient.get('/activities')),
    get: (id) => unwrap(apiClient.get(`/activities/${id}`)),
    create: (payload) => unwrap(apiClient.post('/activities', payload)),
    update: (id, payload) => unwrap(apiClient.put(`/activities/${id}`, payload)),
    remove: (id) => unwrap(apiClient.delete(`/activities/${id}`))
  }
};

export default apiClient;
