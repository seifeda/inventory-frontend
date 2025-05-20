import React, { createContext, useContext, useState, useEffect } from 'react';
import salesService, { SalesReportDto } from '../services/salesService';
import { format, subDays } from 'date-fns';

interface SalesContextType {
  isLoading: boolean;
  error: string | null;
  report: SalesReportDto | null;
  getSalesReport: (startDate: string, endDate: string) => Promise<SalesReportDto>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<SalesReportDto | null>(null);

  const getSalesReport = async (startDate: string, endDate: string): Promise<SalesReportDto> => {
    setIsLoading(true);
    setError(null);
    try {
      const report = await salesService.getSalesReport(startDate, endDate);
      setReport(report);
      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sales report';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      try {
        await getSalesReport(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );
      } catch (err) {
        console.error('Failed to fetch initial sales data:', err);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <SalesContext.Provider value={{ isLoading, error, report, getSalesReport }}>
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