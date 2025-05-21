export const API_URL = 'http://localhost:5282';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh-token'
  },
  inventory: {
    base: '/api/inventory',
    items: '/api/inventory',
    categories: '/api/inventory/categories',
    lowStock: '/api/inventory/low-stock'
  },
  purchases: {
    base: '/api/purchase',
    orders: '/api/purchase',
    suppliers: '/api/purchase/suppliers',
    status: '/api/purchase/status'
  },
  orders: {
    base: '/api/order',
    status: '/api/order/status',
    customer: '/api/order/customer'
  },
  suppliers: {
    base: '/api/supplier',
    contacts: '/api/supplier/contacts',
    status: '/api/supplier/status'
  },
  users: {
    base: '/api/users',
    roles: '/api/users/roles',
    permissions: '/api/users/permissions',
    status: '/api/users/status'
  },
  reports: {
    base: '/api/reports',
    sales: '/api/reports/sales',
    inventory: '/api/reports/inventory',
    purchases: '/api/reports/purchases',
    dashboard: '/api/reports/dashboard'
  }
}; 