import apiService from './api';
import { API_ENDPOINTS } from '../config';

export interface SalesReportDto {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: TopSellingItemDto[];
  salesByPaymentMethod: SalesByPaymentMethodDto[];
  salesByDate: SalesByDateDto[];
}

export interface TopSellingItemDto {
  itemId: number;
  itemName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface SalesByPaymentMethodDto {
  paymentMethod: string;
  count: number;
  totalAmount: number;
}

export interface SalesByDateDto {
  date: string;
  totalSales: number;
  totalRevenue: number;
}

const salesService = {
  async getSalesReport(startDate: string, endDate: string): Promise<SalesReportDto> {
    try {
      const response = await apiService.get<SalesReportDto>(API_ENDPOINTS.sales.report, {
        startDate,
        endDate
      });
      return response;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw new Error('Failed to fetch sales report');
    }
  },

  async getSalesByDateRange(startDate: string, endDate: string): Promise<SalesByDateDto[]> {
    try {
      const response = await apiService.get<SalesByDateDto[]>(API_ENDPOINTS.sales.dateRange, {
        startDate,
        endDate
      });
      return response;
    } catch (error) {
      console.error('Error fetching sales by date range:', error);
      throw new Error('Failed to fetch sales by date range');
    }
  },

  async getSalesByPaymentMethod(startDate: string, endDate: string): Promise<SalesByPaymentMethodDto[]> {
    try {
      const response = await apiService.get<SalesByPaymentMethodDto[]>(API_ENDPOINTS.sales.paymentMethod, {
        startDate,
        endDate
      });
      return response;
    } catch (error) {
      console.error('Error fetching sales by payment method:', error);
      throw new Error('Failed to fetch sales by payment method');
    }
  }
};

export default salesService; 