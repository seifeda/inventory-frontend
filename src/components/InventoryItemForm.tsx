import React, { useState } from 'react';
import Button from './Button';
import { Save, X } from 'lucide-react';

interface InventoryItemFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isLoading?: boolean;
}

const InventoryItemForm = ({ onSubmit, onCancel, initialData, isLoading = false }: InventoryItemFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    unitPrice: initialData?.unitPrice || '',
    quantityInStock: initialData?.quantityInStock || '',
    minimumStockLevel: initialData?.minimumStockLevel || '',
    supplierId: initialData?.supplierId || '',
    location: initialData?.location || '',
    image: initialData?.image || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    if (formData.unitPrice && isNaN(Number(formData.unitPrice))) {
      newErrors.unitPrice = 'Unit price must be a number';
    }
    
    if (formData.quantityInStock && isNaN(Number(formData.quantityInStock))) {
      newErrors.quantityInStock = 'Quantity in stock must be a number';
    }
    
    if (formData.minimumStockLevel && isNaN(Number(formData.minimumStockLevel))) {
      newErrors.minimumStockLevel = 'Minimum stock level must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  const categories = [
    'Electronics',
    'Office Supplies',
    'Furniture',
    'Kitchen',
    'Apparel',
    'Raw Materials',
    'Packaging',
    'Tools',
    'Books',
    'Other'
  ];
  
  const suppliers = [
    { id: 1, name: 'Acme Supplies' },
    { id: 2, name: 'Global Distribution Inc.' },
    { id: 3, name: 'Tech Components Ltd.' },
    { id: 4, name: 'Office Essentials Co.' },
    { id: 5, name: 'Premium Materials' }
  ];
  
  const locations = [
    'Main Warehouse',
    'Secondary Warehouse',
    'Store Room A',
    'Store Room B',
    'Showroom',
    'Office Storage'
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Item Name*
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.name ? 'border-red-300' : ''
            }`}
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
            SKU*
          </label>
          <input
            type="text"
            name="sku"
            id="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.sku ? 'border-red-300' : ''
            }`}
          />
          {errors.sku && <p className="mt-2 text-sm text-red-600">{errors.sku}</p>}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category*
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.category ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
        </div>
        
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
            Supplier
          </label>
          <select
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
            Unit Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="unitPrice"
              id="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              className={`block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.unitPrice ? 'border-red-300' : ''
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.unitPrice && <p className="mt-2 text-sm text-red-600">{errors.unitPrice}</p>}
        </div>
        
        <div>
          <label htmlFor="quantityInStock" className="block text-sm font-medium text-gray-700">
            Quantity in Stock
          </label>
          <input
            type="text"
            name="quantityInStock"
            id="quantityInStock"
            value={formData.quantityInStock}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.quantityInStock ? 'border-red-300' : ''
            }`}
          />
          {errors.quantityInStock && <p className="mt-2 text-sm text-red-600">{errors.quantityInStock}</p>}
        </div>
        
        <div>
          <label htmlFor="minimumStockLevel" className="block text-sm font-medium text-gray-700">
            Minimum Stock Level
          </label>
          <input
            type="text"
            name="minimumStockLevel"
            id="minimumStockLevel"
            value={formData.minimumStockLevel}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.minimumStockLevel ? 'border-red-300' : ''
            }`}
          />
          {errors.minimumStockLevel && <p className="mt-2 text-sm text-red-600">{errors.minimumStockLevel}</p>}
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Storage Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a location</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            id="image"
            value={formData.image}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          icon={X}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={Save}
        >
          {initialData ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryItemForm;