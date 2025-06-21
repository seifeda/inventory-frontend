import React, { useState, useMemo, useEffect } from 'react';
import { useInventory, Supplier } from '../context/InventoryContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Filter, Download, Mail, Phone, MapPin, Edit, Trash2, Building2 } from 'lucide-react';

interface SupplierFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  isActive: boolean;
}

const Suppliers = () => {
  const { suppliers, isLoading, addSupplier, updateSupplier, error: apiError } = useInventory();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Memoized statistics to avoid recalculating on every render
  const supplierStats = useMemo(() => ({
    total: suppliers?.length || 0,
    active: suppliers?.filter(s => s.isActive).length || 0,
    inactive: suppliers?.filter(s => !s.isActive).length || 0
  }), [suppliers]);

  const columns = useMemo(() => [
    { key: 'name', header: 'Supplier Name', sortable: true },
    { key: 'contactPerson', header: 'Contact Person', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone', sortable: true },
    { 
      key: 'isActive', 
      header: 'Status', 
      sortable: true, 
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ) 
    },
  ], []);

  const actions = useMemo(() => (
    <>
      <Button 
        variant="primary" 
        size="sm" 
        icon={Plus} 
        onClick={() => {
          setCurrentSupplier(null);
          setIsFormModalOpen(true);
        }}
        aria-label="Add supplier"
      >
        Add Supplier
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        icon={Filter}
        onClick={() => console.log('Show filter')}
        aria-label="Filter suppliers"
      >
        Filter
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        icon={Download}
        onClick={() => console.log('Export')}
        aria-label="Export suppliers"
      >
        Export
      </Button>
    </>
  ), []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error for this field when it's changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    } else if (formData.contactPerson.length > 100) {
      newErrors.contactPerson = 'Contact person must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email must be less than 100 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (formData.phone.length > 20) {
      newErrors.phone = 'Phone must be less than 20 characters';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 200) {
      newErrors.address = 'Address must be less than 200 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.length > 100) {
      newErrors.city = 'City must be less than 100 characters';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    } else if (formData.country.length > 100) {
      newErrors.country = 'Country must be less than 100 characters';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (formData.postalCode.length > 20) {
      newErrors.postalCode = 'Postal code must be less than 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      postalCode: supplier.postalCode,
      isActive: supplier.isActive
    });
    setIsFormModalOpen(true);
  };

  const resetForm = () => {
    console.log('Resetting form');
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      isActive: true
    });
    setErrors({});
    setCurrentSupplier(null);
  };

  const [modalState, setModalState] = useState({
    isOpen: false,
    isResetting: false,
    error: null as string | null
  });

  const handleModalOpen = async () => {
    console.log('Opening modal');
    try {
      setModalState(prev => ({
        ...prev,
        isResetting: true,
        error: null
      }));
      
      // Reset form first
      resetForm();
      
      // Then open modal
      setModalState(prev => ({
        ...prev,
        isOpen: true,
        isResetting: false
      }));
    } catch (error) {
      console.error('Error opening modal:', error);
      setModalState(prev => ({
        ...prev,
        isResetting: false,
        error: 'Failed to open modal'
      }));
    }
  };

  const handleModalClose = () => {
    console.log('Closing modal');
    setModalState(prev => ({
      ...prev,
      isOpen: false,
      error: null
    }));
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    try {
      setModalState(prev => ({
        ...prev,
        isResetting: true,
        error: null
      }));

      if (currentSupplier) {
        console.log('Updating supplier:', currentSupplier.id);
        await updateSupplier(currentSupplier.id, formData);
      } else {
        console.log('Adding new supplier');
        await addSupplier(formData);
      }
      
      handleModalClose();
    } catch (error) {
      console.error('Failed to save supplier:', error);
      setModalState(prev => ({
        ...prev,
        isResetting: false,
        error: 'Failed to save supplier. Please try again.'
      }));
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save supplier. Please try again.'
      }));
    }
  };

  // Add useEffect to monitor modal state changes
  useEffect(() => {
    console.log('Modal state changed:', isFormModalOpen);
  }, [isFormModalOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" aria-label="Loading..."></div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {apiError}</div>
      </div>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-gray-600">No suppliers found</div>
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={handleModalOpen}
          disabled={isLoading || modalState.isResetting}
        >
          {isLoading || modalState.isResetting ? 'Loading...' : 'Add Your First Supplier'}
        </Button>
        {apiError && (
          <div className="text-red-600 text-sm mt-2">{apiError}</div>
        )}
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
          onClick={() => {
            resetForm();
            setIsFormModalOpen(true);
          }}
          aria-label="Add supplier"
        >
          Add Supplier
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-bold text-blue-600">{supplierStats.total}</div>
            <div className="text-sm text-gray-600">Total Suppliers</div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-bold text-green-600">{supplierStats.active}</div>
            <div className="text-sm text-gray-600">Active Suppliers</div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-bold text-red-600">{supplierStats.inactive}</div>
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
        rowActions={(row: Supplier) => (
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(row);
            }}
            aria-label={`Edit ${row.name}`}
          >
            Edit
          </Button>
        )}
        searchable
        onSearch={(query) => console.log('Search query:', query)}
        pagination={{
          totalPages: Math.ceil(suppliers.length / 10) || 1,
          currentPage: 1,
          onPageChange: (page) => console.log('Page changed to', page)
        }}
      />
      
      {/* View Supplier Modal */}
      {currentSupplier && (
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
                  setIsFormModalOpen(true);
                }}
              >
                Edit Supplier
              </Button>
            </div>
          }
        >
          <SupplierDetails supplier={currentSupplier} />
        </Modal>
      )}
      
      {/* Add/Edit Supplier Modal */}
      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          title={currentSupplier ? "Edit Supplier" : "Add Supplier"}
          size="lg"
        >
          {modalState.error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {modalState.error}
            </div>
          )}
          <SupplierForm 
            formData={formData}
            errors={errors}
            isLoading={isLoading || modalState.isResetting}
            isEdit={!!currentSupplier}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
          />
        </Modal>
      )}
    </div>
  );
};

// Extracted Supplier Details Component
const SupplierDetails = ({ supplier }: { supplier: Supplier }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{supplier.contactPerson}</p>
          <div className={`mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${
            supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {supplier.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2 space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">{supplier.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">{supplier.phone}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <span className="text-sm text-gray-700">{supplier.address}</span>
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
  );
};

// Extracted Supplier Form Component
interface SupplierFormProps {
  formData: SupplierFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  isEdit: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const SupplierForm = ({
  formData,
  errors,
  isLoading,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: SupplierFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{errors.submit}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.name ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Person *</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.contactPerson ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.email ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.phone ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.address ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.city ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.country ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code *</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.postalCode ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Saving...' : (isEdit ? 'Update Supplier' : 'Add Supplier')}
        </Button>
      </div>
    </form>
  );
};

export default Suppliers;