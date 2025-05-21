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
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
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
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.suppliers.base}`);
      setSuppliers(response.data);
    } catch (err) {
      setError('Failed to fetch suppliers');
      console.error('Error fetching suppliers:', err);
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

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchInventory(),
          fetchSuppliers(),
          fetchOrders(),
          fetchPurchases()
        ]);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
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