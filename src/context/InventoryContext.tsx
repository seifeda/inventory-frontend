import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL, API_ENDPOINTS } from '../config';
import axios from 'axios';

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  costPrice: number;
  quantity: number;
  reorderPoint: number;
  location: string;
  supplierId: number;
  supplier?: Supplier;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
}

export interface Supplier {
  id: number;
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

export interface CreateSupplierDto {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {
  isActive?: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: { id: number; name: string; quantity: number; price: number }[];
  paymentStatus: 'Unpaid' | 'Paid' | 'Partial';
}

export interface Purchase {
  id: number;
  poNumber: string;
  supplier: string;
  date: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  total: number;
  items: { id: number; name: string; quantity: number; price: number }[];
  paymentStatus: 'Unpaid' | 'Paid' | 'Partial';
}

interface InventoryContextType {
  inventory: InventoryItem[];
  suppliers: Supplier[];
  orders: Order[];
  purchases: Purchase[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => Promise<void>;
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: number) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: number, supplier: Partial<Supplier>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.inventory.items}`);
      setInventory(response.data);
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error('Error fetching inventory:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      console.log('Fetching suppliers from:', `${API_URL}${API_ENDPOINTS.suppliers.base}`);
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.suppliers.base}`);
      console.log('Suppliers response:', response.data);
      
      if (Array.isArray(response.data)) {
        setSuppliers(response.data);
      } else {
        console.error('Invalid suppliers data format:', response.data);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          console.log('No suppliers found - this is expected for a new system');
          setSuppliers([]);
        } else {
          console.error('API Error:', err.response?.status, err.response?.data);
          setError(err.response?.data?.message || 'Failed to fetch suppliers');
        }
      } else {
        setError('Failed to fetch suppliers');
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.orders.base}`);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.purchases.orders}`);
      setPurchases(response.data);
    } catch (err) {
      setError('Failed to fetch purchases');
      console.error('Error fetching purchases:', err);
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}${API_ENDPOINTS.inventory.items}`, item);
      setInventory(prev => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError('Failed to add inventory item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateInventoryItem = async (id: number, updates: Partial<InventoryItem>) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${API_URL}${API_ENDPOINTS.inventory.items}/${id}`, updates);
      setInventory(prev => prev.map(item => item.id === id ? response.data : item));
      setError(null);
    } catch (err) {
      setError('Failed to update inventory item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInventoryItem = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}${API_ENDPOINTS.inventory.items}/${id}`);
      setInventory(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete inventory item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    try {
      setIsLoading(true);
      const url = `${API_URL}${API_ENDPOINTS.suppliers.base}`;
      console.log('Sending request to:', url);
      console.log('With data:', supplier);
      
      const response = await axios.post(url, supplier);
      console.log('Response:', response.data);
      
      setSuppliers(prev => [...prev, response.data]);
      setError(null);
    } catch (err) {
      console.error('Error adding supplier:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED') {
          setError('Could not connect to the server. Please make sure the backend is running.');
        } else if (err.response?.status === 400) {
          setError('Invalid supplier data. Please check all required fields.');
        } else if (err.response?.status === 409) {
          setError('A supplier with this email or name already exists.');
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response?.data?.message || 'Failed to add supplier');
        }
      } else {
        setError('Failed to add supplier');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSupplier = async (id: number, supplier: Partial<Supplier>) => {
    try {
      setIsLoading(true);
      console.log('Updating supplier:', id, supplier);
      const response = await axios.put(`${API_URL}${API_ENDPOINTS.suppliers.base}/${id}`, supplier);
      console.log('Update response:', response.data);
      setSuppliers(prev => prev.map(s => s.id === id ? response.data : s));
      setError(null);
    } catch (err) {
      console.error('Error updating supplier:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to update supplier');
      } else {
        setError('Failed to update supplier');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Check if backend is accessible
        console.log('Checking backend connectivity...');
        try {
          await axios.get(`${API_URL}/health`);
          console.log('Backend is accessible');
        } catch (healthErr) {
          console.error('Health check failed:', healthErr);
          if (axios.isAxiosError(healthErr)) {
            if (healthErr.code === 'ECONNREFUSED') {
              throw new Error('Cannot connect to the server. Please make sure the backend is running on port 5282.');
            }
            if (healthErr.response?.status === 404) {
              console.log('Health endpoint not found, but server is running');
            } else {
              throw new Error(`Server error: ${healthErr.response?.status} ${healthErr.response?.statusText}`);
            }
          } else {
            throw new Error('Failed to connect to the server');
          }
        }
        
        console.log('Fetching data from endpoints:', {
          inventory: `${API_URL}${API_ENDPOINTS.inventory.items}`,
          suppliers: `${API_URL}${API_ENDPOINTS.suppliers.base}`,
          orders: `${API_URL}${API_ENDPOINTS.orders.base}`,
          purchases: `${API_URL}${API_ENDPOINTS.purchases.orders}`
        });

        await Promise.all([
          fetchInventory(),
          fetchSuppliers(),
          fetchOrders(),
          fetchPurchases()
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNREFUSED') {
            setError('Cannot connect to the server. Please make sure the backend is running on port 5282.');
          } else if (err.response) {
            setError(`Server error: ${err.response.status} ${err.response.statusText}`);
          } else {
            setError('Failed to connect to the server');
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <InventoryContext.Provider 
      value={{ 
        inventory, 
        suppliers, 
        orders, 
        purchases, 
        addInventoryItem, 
        updateInventoryItem, 
        deleteInventoryItem,
        addSupplier,
        updateSupplier,
        isLoading,
        error
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};