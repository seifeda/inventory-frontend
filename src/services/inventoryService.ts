import { apiService } from './api';
import { API_ENDPOINTS } from '../config';

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  reorderPoint: number;
  supplierId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItemDto {
  name: string;
  sku: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  reorderPoint: number;
  supplierId: number;
}

export interface UpdateInventoryItemDto extends Partial<CreateInventoryItemDto> {}

export interface InventoryCategory {
  id: number;
  name: string;
  description: string;
}

const inventoryService = {
  // Get all inventory items
  getAllItems: async (): Promise<InventoryItem[]> => {
    const response = await apiService.get<InventoryItem[]>(API_ENDPOINTS.inventory.items);
    return response;
  },

  // Get inventory item by ID
  getItemById: async (id: number): Promise<InventoryItem> => {
    const response = await apiService.get<InventoryItem>(`${API_ENDPOINTS.inventory.items}/${id}`);
    return response;
  },

  // Create new inventory item
  createItem: async (itemData: CreateInventoryItemDto): Promise<InventoryItem> => {
    const response = await apiService.post<InventoryItem>(API_ENDPOINTS.inventory.items, itemData);
    return response;
  },

  // Update inventory item
  updateItem: async (id: number, itemData: UpdateInventoryItemDto): Promise<InventoryItem> => {
    const response = await apiService.put<InventoryItem>(`${API_ENDPOINTS.inventory.items}/${id}`, itemData);
    return response;
  },

  // Delete inventory item
  deleteItem: async (id: number): Promise<void> => {
    await apiService.delete(`${API_ENDPOINTS.inventory.items}/${id}`);
  },

  // Get all categories
  getCategories: async (): Promise<InventoryCategory[]> => {
    const response = await apiService.get<InventoryCategory[]>(API_ENDPOINTS.inventory.categories);
    return response;
  },

  // Create new category
  createCategory: async (categoryData: Omit<InventoryCategory, 'id'>): Promise<InventoryCategory> => {
    const response = await apiService.post<InventoryCategory>(API_ENDPOINTS.inventory.categories, categoryData);
    return response;
  },

  // Update inventory quantity
  updateQuantity: async (id: number, quantity: number): Promise<InventoryItem> => {
    const response = await apiService.put<InventoryItem>(`${API_ENDPOINTS.inventory.items}/${id}/quantity`, { quantity });
    return response;
  },

  // Get low stock items
  getLowStockItems: async (): Promise<InventoryItem[]> => {
    const response = await apiService.get<InventoryItem[]>(`${API_ENDPOINTS.inventory.items}/low-stock`);
    return response;
  }
};

export default inventoryService; 