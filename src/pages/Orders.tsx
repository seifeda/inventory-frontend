import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import { Plus, Filter, Download, FileText, Truck, Ban } from 'lucide-react';

const Orders = () => {
  const { orders, isLoading } = useInventory();
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Filter orders by status
  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);
  
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };
  
  // Calculate totals
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const processingOrders = orders.filter(order => order.status === 'Processing').length;
  const shippedOrders = orders.filter(order => order.status === 'Shipped').length;
  const completedOrders = orders.filter(order => order.status === 'Delivered').length;
  
  const columns = [
    { key: 'orderNumber', header: 'Order #', sortable: true },
    { key: 'customer', header: 'Customer', sortable: true },
    { key: 'date', header: 'Date', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'status', header: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Delivered' ? 'bg-green-100 text-green-800' :
        value === 'Shipped' ? 'bg-blue-100 text-blue-800' :
        value === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
        value === 'Cancelled' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    ) },
    { key: 'total', header: 'Total', sortable: true, render: (value: number) => `$${value.toFixed(2)}` },
    { key: 'paymentStatus', header: 'Payment', sortable: true, render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Paid' ? 'bg-green-100 text-green-800' :
        value === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    ) },
  ];
  
  // Action buttons for the table
  const actions = (
    <>
      <Button 
        variant="primary" 
        size="sm" 
        icon={Plus} 
        onClick={() => console.log('Create order')}
      >
        Create Order
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        icon={Filter}
        onClick={() => console.log('Show filter')}
      >
        Filter
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        icon={Download}
        onClick={() => console.log('Export')}
      >
        Export
      </Button>
    </>
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Order Management</h1>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => console.log('Create order')}
        >
          Create Order
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <button 
            className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              selectedStatus === 'all' ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStatusChange('all')}
          >
            <div className="text-3xl font-bold text-blue-600">{orders.length}</div>
            <div className="text-sm text-gray-600">All Orders</div>
          </button>
        </Card>
        <Card>
          <button 
            className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              selectedStatus === 'Pending' ? 'bg-yellow-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStatusChange('Pending')}
          >
            <div className="text-3xl font-bold text-yellow-600">{pendingOrders}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </button>
        </Card>
        <Card>
          <button 
            className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              selectedStatus === 'Processing' ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStatusChange('Processing')}
          >
            <div className="text-3xl font-bold text-blue-600">{processingOrders}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </button>
        </Card>
        <Card>
          <button 
            className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              selectedStatus === 'Delivered' ? 'bg-green-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStatusChange('Delivered')}
          >
            <div className="text-3xl font-bold text-green-600">{completedOrders}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </button>
        </Card>
      </div>
      
      <Table 
        columns={columns} 
        data={filteredOrders}
        actions={actions}
        onRowClick={(row) => console.log('View order', row)}
        searchable
        onSearch={(query) => console.log('Search query:', query)}
        pagination={{
          totalPages: Math.ceil(filteredOrders.length / 10) || 1,
          currentPage: 1,
          onPageChange: (page) => console.log('Page changed to', page)
        }}
      />
    </div>
  );
};

export default Orders;