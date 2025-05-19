import { apiService } from './api';
import { API_ENDPOINTS } from '../config';

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  totalAmount: number;
  notes: string;
  items: PurchaseOrderItem[];
  supplier?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  inventoryItemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  inventoryItem?: {
    id: number;
    name: string;
    sku: string;
  };
}

export interface CreatePurchaseOrderDto {
  supplierId: number;
  expectedDeliveryDate: string;
  notes: string;
  items: {
    inventoryItemId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdatePurchaseOrderDto extends Partial<CreatePurchaseOrderDto> {
  status?: PurchaseOrder['status'];
}

const purchaseService = {
  // Get all purchase orders
  getAllOrders: async (): Promise<PurchaseOrder[]> => {
    const response = await apiService.get<PurchaseOrder[]>(API_ENDPOINTS.purchases.orders);
    return response;
  },

  // Get purchase order by ID
  getOrderById: async (id: number): Promise<PurchaseOrder> => {
    const response = await apiService.get<PurchaseOrder>(`${API_ENDPOINTS.purchases.orders}/${id}`);
    return response;
  },

  // Create new purchase order
  createOrder: async (orderData: CreatePurchaseOrderDto): Promise<PurchaseOrder> => {
    const response = await apiService.post<PurchaseOrder>(API_ENDPOINTS.purchases.orders, orderData);
    return response;
  },

  // Update purchase order
  updateOrder: async (id: number, orderData: UpdatePurchaseOrderDto): Promise<PurchaseOrder> => {
    const response = await apiService.put<PurchaseOrder>(`${API_ENDPOINTS.purchases.orders}/${id}`, orderData);
    return response;
  },

  // Delete purchase order
  deleteOrder: async (id: number): Promise<void> => {
    await apiService.delete(`${API_ENDPOINTS.purchases.orders}/${id}`);
  },

  // Get orders by status
  getOrdersByStatus: async (status: PurchaseOrder['status']): Promise<PurchaseOrder[]> => {
    const response = await apiService.get<PurchaseOrder[]>(`${API_ENDPOINTS.purchases.orders}/status/${status}`);
    return response;
  },

  // Get orders by supplier
  getOrdersBySupplier: async (supplierId: number): Promise<PurchaseOrder[]> => {
    const response = await apiService.get<PurchaseOrder[]>(`${API_ENDPOINTS.purchases.orders}/supplier/${supplierId}`);
    return response;
  },

  // Update order status
  updateOrderStatus: async (id: number, status: PurchaseOrder['status']): Promise<PurchaseOrder> => {
    const response = await apiService.put<PurchaseOrder>(`${API_ENDPOINTS.purchases.orders}/${id}/status`, { status });
    return response;
  }
};

export default purchaseService; 