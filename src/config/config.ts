export const API_URL = 'http://localhost:5282';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh-token',
    me: '/api/auth/me'
  },
  inventory: {
    items: '/api/inventory/items',
    categories: '/api/inventory/categories',
    suppliers: '/api/inventory/suppliers'
  },

}; 