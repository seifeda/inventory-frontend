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
  sales: {
    base: '/api/sales',
    report: '/api/sales/report',
    dateRange: '/api/sales/date-range',
    paymentMethod: '/api/sales/payment-method'
  }
}; 