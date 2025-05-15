import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { Plus, Filter, Download, DollarSign, TrendingUp, Users, ShoppingBag } from 'lucide-react';

const Sales = () => {
  const { inventory, isLoading } = useInventory();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null);

  // Mock sales data
  const sales = [
    {
      id: 1,
      date: '2023-06-15T10:30:00Z',
      customer: 'Acme Corp',
      items: [
        { id: 1, name: 'Laptop', quantity: 2, price: 999.99 },
        { id: 2, name: 'Mouse', quantity: 5, price: 29.99 }
      ],
      total: 2129.93,
      status: 'Completed',
      paymentStatus: 'Paid'
    },
    {
      id: 2,
      date: '2023-06-14T15:45:00Z',
      customer: 'Tech Solutions Inc',
      items: [
        { id: 3, name: 'Monitor', quantity: 3, price: 299.99 }
      ],
      total: 899.97,
      status: 'Pending',
      paymentStatus: 'Unpaid'
    }
  ];

  const columns = [
    { key: 'id', header: 'Sale ID', sortable: true },
    { key: 'date', header: 'Date', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'customer', header: 'Customer', sortable: true },
    { key: 'total', header: 'Total', sortable: true, render: (value: number) => `$${value.toFixed(2)}` },
    { key: 'status', header: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {value}
      </span>
    )},
    { key: 'paymentStatus', header: 'Payment', sortable: true, render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )}
  ];

  const actions = (
    <>
      <Button 
        variant="primary" 
        size="sm" 
        icon={Plus} 
        onClick={() => setIsAddModalOpen(true)}
      >
        New Sale
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
        <h1 className="text-2xl font-semibold text-gray-900">Sales Management</h1>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setIsAddModalOpen(true)}
        >
          New Sale
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex flex-col items-center justify-center p-6">
            <DollarSign className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">$3,029.90</div>
            <div className="text-sm text-gray-500">Total Sales</div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center justify-center p-6">
            <ShoppingBag className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="text-sm text-gray-500">Total Orders</div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center justify-center p-6">
            <Users className="h-8 w-8 text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-500">Customers</div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center justify-center p-6">
            <TrendingUp className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">+12.5%</div>
            <div className="text-sm text-gray-500">Growth Rate</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p>Sales chart will be displayed here</p>
            </div>
          </div>
        </div>
      </Card>

      <Table 
        columns={columns} 
        data={sales}
        actions={actions}
        onRowClick={(row) => console.log('View sale', row)}
        searchable
        onSearch={(query) => console.log('Search query:', query)}
        pagination={{
          totalPages: Math.ceil(sales.length / 10) || 1,
          currentPage: 1,
          onPageChange: (page) => console.log('Page changed to', page)
        }}
      />

      {/* New Sale Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Sale"
        size="lg"
      >
        <form className="space-y-6">
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <select
              id="customer"
              name="customer"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select a customer</option>
              <option value="1">Acme Corp</option>
              <option value="2">Tech Solutions Inc</option>
              <option value="3">Global Industries</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Items
            </label>
            <div className="border border-gray-200 rounded-md p-4 space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                    <option value="">Select an item</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Plus}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsAddModalOpen(false);
                setAlert({
                  type: 'success',
                  message: 'Sale created successfully'
                });
                setTimeout(() => setAlert(null), 3000);
              }}
            >
              Create Sale
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;