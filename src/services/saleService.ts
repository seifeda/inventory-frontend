import { API_URL, API_ENDPOINTS } from '../config';
import axios from 'axios';

export interface SaleItem {
  id: number;
  saleId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: number;
  saleDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  notes: string;
  totalAmount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  saleItems: SaleItem[];
}

export interface CreateSaleDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  notes: string;
  saleItems: {
    itemId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface SalesReportDto {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: {
    itemId: number;
    itemName: string;
    quantitySold: number;
    totalRevenue: number;
  }[];
  salesByPaymentMethod: {
    paymentMethod: string;
    count: number;
    totalAmount: number;
  }[];
  salesByDate: {
    date: string;
    totalSales: number;
    totalRevenue: number;
  }[];
}

const saleService = {
  async getAllSales(): Promise<Sale[]> {
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.sales.base}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw new Error('Failed to fetch sales');
    }
  },

  async getSaleById(id: number): Promise<Sale> {
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.sales.base}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sale ${id}:`, error);
      throw new Error('Failed to fetch sale');
    }
  },

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    try {
      const response = await axios.post(`${API_URL}${API_ENDPOINTS.sales.base}`, saleData);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw new Error('Failed to create sale');
    }
  },

  async updateSale(id: number, saleData: Partial<CreateSaleDto>): Promise<Sale> {
    try {
      const response = await axios.put(`${API_URL}${API_ENDPOINTS.sales.base}/${id}`, saleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating sale ${id}:`, error);
      throw new Error('Failed to update sale');
    }
  },

  async deleteSale(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}${API_ENDPOINTS.sales.base}/${id}`);
    } catch (error) {
      console.error(`Error deleting sale ${id}:`, error);
      throw new Error('Failed to delete sale');
    }
  },

  async getSalesReport(startDate: string, endDate: string): Promise<SalesReportDto> {
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.sales.report}`, {
        params: {
          startDate,
          endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw new Error('Failed to fetch sales report');
    }
  },

  // Get sales by date range
  getSalesByDateRange: async (startDate: string, endDate: string): Promise<Sale[]> => {
    const response = await axios.get(`${API_URL}/api/sales/date-range`, {
      params: { startDate, endDate }
    });
    return response.data.data;
  },

  // Get sales by payment method
  getSalesByPaymentMethod: async (paymentMethod: string): Promise<Sale[]> => {
    const response = await axios.get(`${API_URL}/api/sales/payment-method/${paymentMethod}`);
    return response.data.data;
  }
};

export default saleService; 