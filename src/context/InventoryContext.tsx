import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  costPrice: number;
  quantity: number;
  reorderPoint: number;
  location: string;
  supplier: string;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: { id: string; name: string; quantity: number; price: number }[];
  paymentStatus: 'Unpaid' | 'Paid' | 'Partial';
}

export interface Purchase {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  total: number;
  items: { id: string; name: string; quantity: number; price: number }[];
  paymentStatus: 'Unpaid' | 'Paid' | 'Partial';
}

interface InventoryContextType {
  inventory: InventoryItem[];
  suppliers: Supplier[];
  orders: Order[];
  purchases: Purchase[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Generate mock data
const generateMockInventory = (): InventoryItem[] => {
  const categories = ['Electronics', 'Office Supplies', 'Furniture', 'Raw Materials', 'Packaging'];
  const suppliers = ['Acme Supplies', 'Global Distribution Inc.', 'Tech Components Ltd.', 'Office Essentials Co.'];
  const locations = ['Main Warehouse', 'Secondary Warehouse', 'Store Room A', 'Store Room B'];
  
  return Array.from({ length: 20 }, (_, i) => {
    const quantity = Math.floor(Math.random() * 100);
    const reorderPoint = Math.floor(Math.random() * 20) + 5;
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    
    if (quantity === 0) {
      status = 'Out of Stock';
    } else if (quantity <= reorderPoint) {
      status = 'Low Stock';
    } else {
      status = 'In Stock';
    }
    
    return {
      id: `item-${i + 1}`,
      name: `Product ${i + 1}`,
      sku: `SKU-${1000 + i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `This is a description for Product ${i + 1}. It contains features and specifications.`,
      price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
      costPrice: parseFloat((Math.random() * 50 + 5).toFixed(2)),
      quantity,
      reorderPoint,
      location: locations[Math.floor(Math.random() * locations.length)],
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      status,
      image: i % 3 === 0 ? `https://placehold.co/200x200?text=Product+${i+1}` : undefined
    };
  });
};

const generateMockSuppliers = (): Supplier[] => {
  return [
    {
      id: 'sup-1',
      name: 'Acme Supplies',
      contactName: 'John Smith',
      email: 'john@acmesupplies.com',
      phone: '(555) 123-4567',
      address: '123 Supply St, Supplier City, SC 12345',
      status: 'Active'
    },
    {
      id: 'sup-2',
      name: 'Global Distribution Inc.',
      contactName: 'Sarah Johnson',
      email: 'sarah@globaldist.com',
      phone: '(555) 987-6543',
      address: '456 Global Ave, Distributor City, DC 67890',
      status: 'Active'
    },
    {
      id: 'sup-3',
      name: 'Tech Components Ltd.',
      contactName: 'David Lee',
      email: 'david@techcomponents.com',
      phone: '(555) 456-7890',
      address: '789 Tech Blvd, Component City, CC 34567',
      status: 'Active'
    },
    {
      id: 'sup-4',
      name: 'Office Essentials Co.',
      contactName: 'Emily Chen',
      email: 'emily@officeessentials.com',
      phone: '(555) 321-7654',
      address: '321 Office Rd, Supply Town, ST 89012',
      status: 'Inactive'
    }
  ];
};

const generateMockOrders = (): Order[] => {
  const customers = ['Acme Corporation', 'XYZ Ltd.', 'Global Enterprises', 'City Hospital', 'University of Technology'];
  const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentStatuses: Order['paymentStatus'][] = ['Unpaid', 'Paid', 'Partial'];
  
  return Array.from({ length: 15 }, (_, i) => {
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = Array.from({ length: itemCount }, (_, j) => ({
      id: `item-${j}`,
      name: `Product ${j + 1}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: parseFloat((Math.random() * 100 + 10).toFixed(2))
    }));
    
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    return {
      id: `order-${i + 1}`,
      orderNumber: `ORD-${2000 + i}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total: parseFloat(total.toFixed(2)),
      items,
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
    };
  });
};

const generateMockPurchases = (): Purchase[] => {
  const suppliers = ['Acme Supplies', 'Global Distribution Inc.', 'Tech Components Ltd.', 'Office Essentials Co.'];
  const statuses: Purchase['status'][] = ['Draft', 'Pending', 'Approved', 'Received', 'Cancelled'];
  const paymentStatuses: Purchase['paymentStatus'][] = ['Unpaid', 'Paid', 'Partial'];
  
  return Array.from({ length: 10 }, (_, i) => {
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = Array.from({ length: itemCount }, (_, j) => ({
      id: `item-${j}`,
      name: `Product ${j + 1}`,
      quantity: Math.floor(Math.random() * 10) + 1,
      price: parseFloat((Math.random() * 50 + 5).toFixed(2))
    }));
    
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    return {
      id: `purchase-${i + 1}`,
      poNumber: `PO-${3000 + i}`,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total: parseFloat(total.toFixed(2)),
      items,
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
    };
  });
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setInventory(generateMockInventory());
      setSuppliers(generateMockSuppliers());
      setOrders(generateMockOrders());
      setPurchases(generateMockPurchases());
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `item-${inventory.length + 1}`,
      lastUpdated: new Date().toISOString(),
      status: item.quantity === 0 
        ? 'Out of Stock' 
        : item.quantity <= item.reorderPoint 
          ? 'Low Stock' 
          : 'In Stock'
    };
    
    setInventory(prev => [...prev, newItem]);
  };
  
  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates, lastUpdated: new Date().toISOString() };
          
          // Recalculate status if quantity or reorderPoint changed
          if ('quantity' in updates || 'reorderPoint' in updates) {
            const quantity = 'quantity' in updates ? updates.quantity! : item.quantity;
            const reorderPoint = 'reorderPoint' in updates ? updates.reorderPoint! : item.reorderPoint;
            
            if (quantity === 0) {
              updatedItem.status = 'Out of Stock';
            } else if (quantity <= reorderPoint) {
              updatedItem.status = 'Low Stock';
            } else {
              updatedItem.status = 'In Stock';
            }
          }
          
          return updatedItem;
        }
        return item;
      });
    });
  };
  
  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };
  
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
        isLoading 
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