import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useSales } from '../context/SalesContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { Plus, Filter, Download, DollarSign, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { CardContent, Typography, Grid, CircularProgress, Alert as MuiAlert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { SalesReportDto, TopSellingItemDto, SalesByPaymentMethodDto, SalesByDateDto } from '../services/salesService';

interface SaleItem {
  itemId: number;
  quantity: number;
  unitPrice: number;
}

interface CreateSaleDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  notes: string;
  saleItems: SaleItem[];
}

const Sales: React.FC = () => {
  const { inventory, isLoading: isInventoryLoading } = useInventory();
  const { getSalesReport, isLoading: isSalesLoading, error } = useSales();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null);
  const [formData, setFormData] = useState<CreateSaleDto>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    paymentMethod: '',
    notes: '',
    saleItems: []
  });
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [report, setReport] = useState<SalesReportDto | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (startDate && endDate) {
        try {
          const data = await getSalesReport(
            format(startDate, 'yyyy-MM-dd'),
            format(endDate, 'yyyy-MM-dd')
          );
          setReport(data);
        } catch (err) {
          console.error('Error fetching sales report:', err);
        }
      }
    };

    fetchReport();
  }, [startDate, endDate, getSalesReport]);

  if (isInventoryLoading || isSalesLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <MuiAlert severity="error">{error}</MuiAlert>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Sales Report
        </Typography>

        <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue: Date | null) => setStartDate(newValue)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue: Date | null) => setEndDate(newValue)}
            />
          </Grid>
        </Grid>

        {report && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Sales</Typography>
                  <Typography variant="h4">{report.totalSales}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4">${report.totalRevenue.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Average Order Value</Typography>
                  <Typography variant="h4">${report.averageOrderValue.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Top Selling Items</Typography>
                  <Grid container spacing={2}>
                    {report.topSellingItems.map((item: TopSellingItemDto) => (
                      <Grid item xs={12} sm={6} md={4} key={item.itemId}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1">{item.itemName}</Typography>
                            <Typography>Quantity: {item.quantitySold}</Typography>
                            <Typography>Revenue: ${item.totalRevenue.toFixed(2)}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Sales by Payment Method</Typography>
                  {report.salesByPaymentMethod.map((method: SalesByPaymentMethodDto) => (
                    <div key={method.paymentMethod} style={{ marginBottom: '10px' }}>
                      <Typography variant="subtitle1">{method.paymentMethod}</Typography>
                      <Typography>Count: {method.count}</Typography>
                      <Typography>Amount: ${method.totalAmount.toFixed(2)}</Typography>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Sales by Date</Typography>
                  {report.salesByDate.map((sale: SalesByDateDto) => (
                    <div key={sale.date} style={{ marginBottom: '10px' }}>
                      <Typography variant="subtitle1">{new Date(sale.date).toLocaleDateString()}</Typography>
                      <Typography>Sales: {sale.totalSales}</Typography>
                      <Typography>Revenue: ${sale.totalRevenue.toFixed(2)}</Typography>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default Sales;