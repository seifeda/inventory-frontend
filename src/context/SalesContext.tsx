import React, { createContext, useContext, useState } from 'react';
import salesService, { SalesReportDto } from '../services/salesService';

interface SalesContextType {
  isLoading: boolean;
  error: string | null;
  getSalesReport: (startDate: string, endDate: string) => Promise<SalesReportDto>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSalesReport = async (startDate: string, endDate: string): Promise<SalesReportDto> => {
    setIsLoading(true);
    setError(null);
    try {
      const report = await salesService.getSalesReport(startDate, endDate);
      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sales report';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SalesContext.Provider value={{ isLoading, error, getSalesReport }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
}; 