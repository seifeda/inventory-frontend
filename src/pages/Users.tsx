import React, { useState } from 'react';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { Plus, Edit, Trash2, User, Lock, Mail, UserPlus, UserX, Shield } from 'lucide-react';

const Users = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null);
  
  // Mock user data
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-06-15T10:30:00Z' },
    { id: 2, name: 'John Smith', email: 'john@example.com', role: 'Manager', status: 'Active', lastLogin: '2023-06-14T14:45:00Z' },
    { id: 3, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Warehouse Staff', status: 'Active', lastLogin: '2023-06-15T09:15:00Z' },
    { id: 4, name: 'Michael Brown', email: 'michael@example.com', role: 'Sales Rep', status: 'Inactive', lastLogin: '2023-05-30T11:20:00Z' },
    { id: 5, name: 'Emily Davis', email: 'emily@example.com', role: 'Purchasing Agent', status: 'Active', lastLogin: '2023-06-15T08:05:00Z' },
  ];
  
  // Table columns definition
  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'status', header: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    ) },
    { key: 'lastLogin', header: 'Last Login', sortable: true, render: (value: string) => new Date(value).toLocaleString() },
  ];
  
  // Action buttons for the table
  const actions = (
    <>
      <Button 
        variant="primary" 
        size="sm" 
        icon={Plus} 
        onClick={() => setIsAddModalOpen(true)}
      >
        Add User
      </Button>
    </>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <Button 
          variant="primary" 
          icon={UserPlus} 
          onClick={() => setIsAddModalOpen(true)}
        >
          Add User
        </Button>
      </div>
      
      {alert && (
        <Alert 
          variant={alert.type} 
          dismissible 
          onDismiss={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Total Users</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 text-center">
            <span className="text-3xl font-bold text-blue-600">{users.length}</span>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Roles</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Admin</span>
                <span className="text-sm font-medium text-gray-900">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Manager</span>
                <span className="text-sm font-medium text-gray-900">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Staff</span>
                <span className="text-sm font-medium text-gray-900">3</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <UserX className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Inactive Users</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 text-center">
            <span className="text-3xl font-bold text-red-600">{users.filter(user => user.status === 'Inactive').length}</span>
          </div>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        data={users}
        actions={actions}
        onRowClick={(row) => console.log('View user', row)}
        searchable
        onSearch={(query) => console.log('Search query:', query)}
        pagination={{
          totalPages: Math.ceil(users.length / 10) || 1,
          currentPage: 1,
          onPageChange: (page) => console.log('Page changed to', page)
        }}
      />
      
      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add User"
        size="md"
      >
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
              <option value="Sales Rep">Sales Rep</option>
              <option value="Purchasing Agent">Purchasing Agent</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="status"
              name="status"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              defaultChecked
            />
            <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setIsAddModalOpen(false);
                setAlert({ 
                  type: 'success', 
                  message: 'User created successfully. An invitation email has been sent.' 
                });
                // Hide alert after 3 seconds
                setTimeout(() => setAlert(null), 3000);
              }}
            >
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;