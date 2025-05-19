import { apiService } from './api';
import { API_ENDPOINTS } from '../config';

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactPerson: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactPerson: string;
  notes: string;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {}

export interface SupplierContact {
  id: number;
  supplierId: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

const supplierService = {
  // Get all suppliers
  getAllSuppliers: async (): Promise<Supplier[]> => {
    const response = await apiService.get<Supplier[]>(API_ENDPOINTS.suppliers.base);
    return response;
  },

  // Get supplier by ID
  getSupplierById: async (id: number): Promise<Supplier> => {
    const response = await apiService.get<Supplier>(`${API_ENDPOINTS.suppliers.base}/${id}`);
    return response;
  },

  // Create new supplier
  createSupplier: async (supplierData: CreateSupplierDto): Promise<Supplier> => {
    const response = await apiService.post<Supplier>(API_ENDPOINTS.suppliers.base, supplierData);
    return response;
  },

  // Update supplier
  updateSupplier: async (id: number, supplierData: UpdateSupplierDto): Promise<Supplier> => {
    const response = await apiService.put<Supplier>(`${API_ENDPOINTS.suppliers.base}/${id}`, supplierData);
    return response;
  },

  // Delete supplier
  deleteSupplier: async (id: number): Promise<void> => {
    await apiService.delete(`${API_ENDPOINTS.suppliers.base}/${id}`);
  },

  // Get supplier contacts
  getSupplierContacts: async (supplierId: number): Promise<SupplierContact[]> => {
    const response = await apiService.get<SupplierContact[]>(`${API_ENDPOINTS.suppliers.contacts}/${supplierId}`);
    return response;
  },

  // Add supplier contact
  addSupplierContact: async (supplierId: number, contactData: Omit<SupplierContact, 'id' | 'supplierId'>): Promise<SupplierContact> => {
    const response = await apiService.post<SupplierContact>(`${API_ENDPOINTS.suppliers.contacts}/${supplierId}`, contactData);
    return response;
  },

  // Update supplier contact
  updateSupplierContact: async (supplierId: number, contactId: number, contactData: Partial<Omit<SupplierContact, 'id' | 'supplierId'>>): Promise<SupplierContact> => {
    const response = await apiService.put<SupplierContact>(`${API_ENDPOINTS.suppliers.contacts}/${supplierId}/${contactId}`, contactData);
    return response;
  },

  // Delete supplier contact
  deleteSupplierContact: async (supplierId: number, contactId: number): Promise<void> => {
    await apiService.delete(`${API_ENDPOINTS.suppliers.contacts}/${supplierId}/${contactId}`);
  }
};

export default supplierService; 