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
    price: initialData?.price || '',
    costPrice: initialData?.costPrice || '',
    quantity: initialData?.quantity || '',
    reorderPoint: initialData?.reorderPoint || '',
    location: initialData?.location || '',
    supplier: initialData?.supplier || '',
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
    
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    }
    
    if (formData.costPrice && isNaN(Number(formData.costPrice))) {
      newErrors.costPrice = 'Cost price must be a number';
    }
    
    if (formData.quantity && isNaN(Number(formData.quantity))) {
      newErrors.quantity = 'Quantity must be a number';
    }
    
    if (formData.reorderPoint && isNaN(Number(formData.reorderPoint))) {
      newErrors.reorderPoint = 'Reorder point must be a number';
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
    'Acme Supplies',
    'Global Distribution Inc.',
    'Tech Components Ltd.',
    'Office Essentials Co.',
    'Premium Materials'
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
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
            Supplier
          </label>
          <select
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Selling Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className={`block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.price ? 'border-red-300' : ''
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
        </div>
        
        <div>
          <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
            Cost Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="costPrice"
              id="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              className={`block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.costPrice ? 'border-red-300' : ''
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.costPrice && <p className="mt-2 text-sm text-red-600">{errors.costPrice}</p>}
        </div>
        
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="text"
            name="quantity"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.quantity ? 'border-red-300' : ''
            }`}
          />
          {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity}</p>}
        </div>
        
        <div>
          <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
            Reorder Point
          </label>
          <input
            type="text"
            name="reorderPoint"
            id="reorderPoint"
            value={formData.reorderPoint}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.reorderPoint ? 'border-red-300' : ''
            }`}
          />
          {errors.reorderPoint && <p className="mt-2 text-sm text-red-600">{errors.reorderPoint}</p>}
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