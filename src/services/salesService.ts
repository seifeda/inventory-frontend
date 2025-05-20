import apiService from './api';
import { API_ENDPOINTS } from '../config';

export interface SalesReportDto {
  startDate: string;
  endDate: string;
  totalSales: number;
  totalTransactions: number;
  averageTransactionValue: number;
  topSellingItems: TopSellingItemDto[];
  salesByPaymentMethod: SalesByPaymentMethodDto[];
  salesByDay: SalesByDayDto[];
}

export interface TopSellingItemDto {
  inventoryItemId: number;
  itemName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface SalesByPaymentMethodDto {
  paymentMethod: string;
  totalAmount: number;
  transactionCount: number;
}

export interface SalesByDayDto {
  date: string;
  totalAmount: number;
  transactionCount: number;
}

export interface CreateSaleDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  notes: string;
  saleItems: Array<{
    inventoryItemId: number;
    quantity: number;
  }>;
}

export interface Sale {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  notes: string;
  totalAmount: number;
  saleDate: string;
  status: string;
  saleItems: Array<{
    inventoryItemId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

const salesService = {
  async getSalesReport(startDate: string, endDate: string): Promise<SalesReportDto> {
    try {
      const response = await apiService.get<SalesReportDto>(API_ENDPOINTS.sales.report, {
        params: {
          startDate,
          endDate
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw new Error('Failed to fetch sales report. Please try again later.');
    }
  },

  async getSalesByDateRange(startDate: string, endDate: string): Promise<SalesByDayDto[]> {
    try {
      const response = await apiService.get<SalesByDayDto[]>(API_ENDPOINTS.sales.dateRange, {
        params: {
          startDate,
          endDate
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching sales by date range:', error);
      throw new Error('Failed to fetch sales by date range. Please try again later.');
    }
  },

  async getSalesByPaymentMethod(startDate: string, endDate: string): Promise<SalesByPaymentMethodDto[]> {
    try {
      const response = await apiService.get<SalesByPaymentMethodDto[]>(API_ENDPOINTS.sales.paymentMethod, {
        params: {
          startDate,
          endDate
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching sales by payment method:', error);
      throw new Error('Failed to fetch sales by payment method. Please try again later.');
    }
  },

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    try {
      const response = await apiService.post<Sale>(API_ENDPOINTS.sales.base, saleData);
      return response;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw new Error('Failed to create sale');
    }
  }
};

export default salesService;