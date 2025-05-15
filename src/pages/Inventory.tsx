import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InventoryItemForm from '../components/InventoryItemForm';
import Alert from '../components/Alert';
import { Plus, Filter, Download, Trash2, Edit, Eye, ArrowUpDown } from 'lucide-react';

const Inventory = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, isLoading } = useInventory();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we should open the add modal from URL query param
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('action') === 'add') {
      setIsAddModalOpen(true);
      // Clean up URL
      navigate('/inventory', { replace: true });
    }
  }, [location, navigate]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...inventory];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.sku.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredInventory(filtered);
  }, [inventory, categoryFilter, statusFilter, searchQuery]);
  
  const handleAddItem = (data: any) => {
    addInventoryItem(data);
    setIsAddModalOpen(false);
    setAlert({ type: 'success', message: 'Item added successfully' });
    // Hide alert after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };
  
  const handleUpdateItem = (data: any) => {
    if (currentItem) {
      updateInventoryItem(currentItem.id, data);
      setIsEditModalOpen(false);
      setAlert({ type: 'success', message: 'Item updated successfully' });
      // Hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    }
  };
  
  const handleDeleteItem = () => {
    if (currentItem) {
      deleteInventoryItem(currentItem.id);
      setIsDeleteModalOpen(false);
      setAlert({ type: 'success', message: 'Item deleted successfully' });
      // Hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    }
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Get unique categories for filter
  const categories = ['all', ...new Set(inventory.map(item => item.category))];
  
  // Table columns definition
  const columns = [
    { key: 'sku', header: 'SKU', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'quantity', header: 'Quantity', sortable: true },
    { key: 'price', header: 'Price', sortable: true, render: (value: number) => `$${value.toFixed(2)}` },
    { key: 'status', header: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'In Stock' ? 'bg-green-100 text-green-800' :
        value === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
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
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Item
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
  
  // Row actions
  const rowActions = (row: any) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="xs" 
        icon={Eye}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentItem(row);
          setIsViewModalOpen(true);
        }}
      >
        View
      </Button>
      <Button 
        variant="outline" 
        size="xs" 
        icon={Edit}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentItem(row);
          setIsEditModalOpen(true);
        }}
      >
        Edit
      </Button>
      <Button 
        variant="outline" 
        size="xs" 
        icon={Trash2}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentItem(row);
          setIsDeleteModalOpen(true);
        }}
      >
        Delete
      </Button>
    </div>
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
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Item
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
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-60">
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Categories</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-60">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        data={filteredInventory}
        actions={actions}
        onRowClick={(row) => {
          setCurrentItem(row);
          setIsViewModalOpen(true);
        }}
        searchable
        onSearch={handleSearch}
        pagination={{
          totalPages: Math.ceil(filteredInventory.length / 10) || 1,
          currentPage: 1,
          onPageChange: (page) => console.log('Page changed to', page)
        }}
      />
      
      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Inventory Item"
        size="lg"
      >
        <InventoryItemForm
          onSubmit={handleAddItem}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
      
      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Inventory Item"
        size="lg"
      >
        {currentItem && (
          <InventoryItemForm
            onSubmit={handleUpdateItem}
            onCancel={() => setIsEditModalOpen(false)}
            initialData={currentItem}
          />
        )}
      </Modal>
      
      {/* View Item Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Item Details"
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
                setIsEditModalOpen(true);
              }}
            >
              Edit Item
            </Button>
          </div>
        }
      >
        {currentItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 col-span-2 md:col-span-1">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{currentItem.name}</h3>
                <p className="text-sm text-gray-500">SKU: {currentItem.sku}</p>
              </div>
              
              {currentItem.image && (
                <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                  <img src={currentItem.image} alt={currentItem.name} className="w-full h-full object-contain" />
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-700">Description</h4>
                <p className="text-sm text-gray-600 mt-1">{currentItem.description || 'No description available.'}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Stock Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="text-sm font-medium">{currentItem.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className={`text-sm font-medium ${
                      currentItem.status === 'In Stock' ? 'text-green-600' :
                      currentItem.status === 'Low Stock' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {currentItem.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reorder Point</p>
                    <p className="text-sm font-medium">{currentItem.reorderPoint}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium">{currentItem.location || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Selling Price</p>
                    <p className="text-sm font-medium">${currentItem.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost Price</p>
                    <p className="text-sm font-medium">${currentItem.costPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Profit Margin</p>
                    <p className="text-sm font-medium">
                      {(((currentItem.price - currentItem.costPrice) / currentItem.price) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Value</p>
                    <p className="text-sm font-medium">${(currentItem.quantity * currentItem.price).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium">{currentItem.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Supplier</p>
                    <p className="text-sm font-medium">{currentItem.supplier || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium">{new Date(currentItem.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Inventory Item"
        size="sm"
        footer={
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              icon={Trash2}
              onClick={handleDeleteItem}
            >
              Delete
            </Button>
          </div>
        }
      >
        {currentItem && (
          <div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{currentItem.name}</strong>? This action cannot be undone.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;