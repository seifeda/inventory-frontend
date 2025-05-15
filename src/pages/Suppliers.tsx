import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Filter, Download, Mail, Phone, MapPin, Edit, Trash2, Building2 } from 'lucide-react';

const Suppliers = () => {
  const { suppliers, isLoading } = useInventory();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<any>(null);
  
  const columns = [
    { key: 'name', header: 'Supplier Name', sortable: true },
    { key: 'contactName', header: 'Contact Person', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone', sortable: true },
    { key: 'status', header: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
        onClick={() => setIsFormModalOpen(true)}
      >
        Add Supplier
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
        <h1 className="text-2xl font-semibold text-gray-900">Supplier Management</h1>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setIsFormModalOpen(true)}
        >
          Add Supplier
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-bold text-blue-600">{suppliers.length}</div>
            <div className="text-sm text-gray-600">Total Suppliers</div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-bold text-green-600">{suppliers.filter(s => s.status === 'Active').length}</div>
            <div className="text-sm text-gray-600">Active Suppliers</div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-bold text-red-600">{suppliers.filter(s => s.status === 'Inactive').length}</div>
            <div className="text-sm text-gray-600">Inactive Suppliers</div>
          </div>
        </Card>
      </div>
      
      <Table 
        columns={columns} 
        data={suppliers}
        actions={actions}
        onRowClick={(row) => {
          setCurrentSupplier(row);
          setIsViewModalOpen(true);
        }}
        searchable
        onSearch={(query) => console.log('Search query:', query)}
        pagination={{
          totalPages: Math.ceil(suppliers.length / 10) || 1,
          currentPage: 1,
          onPageChange: (page) => console.log('Page changed to', page)
        }}
      />
      
      {/* View Supplier Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Supplier Details"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </Button>
            <Button 
              variant="primary" 
              icon={Edit}
              onClick={() => {
                setIsViewModalOpen(false);
                setCurrentSupplier(currentSupplier);
                setIsFormModalOpen(true);
              }}
            >
              Edit Supplier
            </Button>
          </div>
        }
      >
        {currentSupplier && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{currentSupplier.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{currentSupplier.contactName}</p>
                <div className={`mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${
                  currentSupplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {currentSupplier.status}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{currentSupplier.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{currentSupplier.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">{currentSupplier.address}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Orders</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-lg font-semibold">24</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Open Orders</p>
                    <p className="text-lg font-semibold">3</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className="text-lg font-semibold">$12,450.00</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Last Order</p>
                    <p className="text-lg font-semibold">2 days ago</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Supplied Products</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-2 flex justify-between">
                      <span className="text-sm text-gray-600">Printer Paper</span>
                      <span className="text-sm text-gray-800 font-medium">$24.99</span>
                    </li>
                    <li className="py-2 flex justify-between">
                      <span className="text-sm text-gray-600">Office Desk</span>
                      <span className="text-sm text-gray-800 font-medium">$349.99</span>
                    </li>
                    <li className="py-2 flex justify-between">
                      <span className="text-sm text-gray-600">Filing Cabinet</span>
                      <span className="text-sm text-gray-800 font-medium">$129.99</span>
                    </li>
                  </ul>
                  <div className="mt-2 text-center">
                    <button className="text-xs text-blue-600 font-medium">
                      View all products
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Add/Edit Supplier Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={currentSupplier ? "Edit Supplier" : "Add Supplier"}
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Supplier Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={currentSupplier?.name || ''}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                Contact Person
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="contactName"
                  id="contactName"
                  defaultValue={currentSupplier?.contactName || ''}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={currentSupplier?.email || ''}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  defaultValue={currentSupplier?.phone || ''}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  defaultValue={currentSupplier?.address || ''}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  defaultValue={currentSupplier?.status || 'Active'}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {currentSupplier ? 'Update Supplier' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;