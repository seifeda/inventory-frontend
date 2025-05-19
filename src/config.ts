export const API_URL = 'http://localhost:5282';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh-token'
  },
  inventory: {
    base: '/api/inventory',
    items: '/api/inventory/items',
    categories: '/api/inventory/categories',
    lowStock: '/api/inventory/low-stock'
  },
  sales: {
    base: '/api/sales',
    report: '/api/sales/report',
    dateRange: '/api/sales/date-range',
    paymentMethod: '/api/sales/payment-method'
  },
  purchases: {
    base: '/api/purchases',
    orders: '/api/purchases/orders',
    suppliers: '/api/purchases/suppliers',
    status: '/api/purchases/status'
  },
  orders: {
    base: '/api/orders',
    status: '/api/orders/status',
    customer: '/api/orders/customer'
  },
  suppliers: {
    base: '/api/suppliers',
    contacts: '/api/suppliers/contacts',
    status: '/api/suppliers/status'
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