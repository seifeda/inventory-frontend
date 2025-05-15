import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import { Plus, Filter, Download, FileText, CheckCircle, XCircle } from 'lucide-react';

const Purchases = () => {
  const { purchases, isLoading } = useInventory();
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Filter purchases by status
  const filteredPurchases = selectedStatus === 'all' 
    ? purchases 
    : purchases.filter(purchase => purchase.status === selectedStatus);
  
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };
  
  // Calculate totals
  const draftOrders = purchases.filter(order => order.status === 'Draft').length;
  const pendingOrders = purchases.filter(order => order.status === 'Pending').length;
  const approvedOrders = purchases.filter(order => order.status === 'Approved').length;
  const receivedOrders = purchases.filter(order => order.status === 'Received').length;
  
  const columns = [
    { key: 'poNumber', header: 'PO #', sortable: true },
    { key: 'supplier', header: 'Supplier', sortable: true },
    { key: 'date', header: 'Date', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'status', header: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Received' ? 'bg-green-100 text-green-800' :
        value === 'Approved' ? 'bg-blue-100 text-blue-800' :
        value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        value === 'Draft' ? 'bg-gray-100 text-gray-800' :
        'bg-red-100 text-red-800'
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
        onClick={() => console.log('Create purchase order')}
      >
        Create PO
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
        <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => console.log('Create purchase order')}
        >
          Create Purchase Order
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <button 
            className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              selectedStatus === 'all' ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStatusChange('all')}
          >
            <div className="text-3xl font-bold text-blue-600">{purchases.length}</div>
            <div className="text-sm text-gray-600">All Orders</div>
          </button>
        </Card>
        <Card>
          <button 
            className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              selectedStatus === 'Draft' ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStatusChange('Draft')}
          >
            <div className="text-3xl font-bold text-gray-600">{draftOrders}</div>
            <div className="text-sm text-gray-600">Draft</div>
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
              selectedStatus === 'Approved' ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStatusChange('Approved')}
          >
            <div className="text-3xl font-bold text-blue-600">{approvedOrders}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </button>
        </Card>
        <Card>
          <button 
            className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              selectedStatus === 'Received' ? 'bg-green-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStatusChange('Received')}
          >
            <div className="text-3xl font-bold text-green-600">{receivedOrders}</div>
            <div className="text-sm text-gray-600">Received</div>
          </button>
        </Card>
      </div>
      
      <Table 
        columns={columns} 
        data={filteredPurchases}
        actions={actions}
        onRowClick={(row) => console.log('View purchase order', row)}
        searchable
        onSearch={(query) => console.log('Search query:', query)}
        pagination={{
          totalPages: Math.ceil(filteredPurchases.length / 10) || 1,
          currentPage: 1,
          onPageChange: (page) => console.log('Page changed to', page)
        }}
      />
    </div>
  );
};

export default Purchases;