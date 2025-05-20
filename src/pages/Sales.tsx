import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useSales } from '../context/SalesContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { Plus, Filter, Download, DollarSign, TrendingUp, Users, ShoppingBag, Refresh } from 'lucide-react';
import { CardContent, Typography, Grid, CircularProgress, Alert as MuiAlert, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subDays } from 'date-fns';
import salesService, { SalesReportDto, TopSellingItemDto, SalesByPaymentMethodDto, SalesByDayDto } from '../services/salesService';

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
  const { isLoading: isSalesLoading, error: salesError, report, getSalesReport } = useSales();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [formData, setFormData] = useState<CreateSaleDto>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    paymentMethod: '',
    notes: '',
    saleItems: []
  });
  const [selectedItems, setSelectedItems] = useState<{ id: number; quantity: number }[]>([]);
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  useEffect(() => {
    console.log('Inventory:', inventory);
    console.log('Selected Items:', selectedItems);
    console.log('Sales Report:', report);
    console.log('Loading States - Inventory:', isInventoryLoading, 'Sales:', isSalesLoading);
    console.log('Error:', salesError);
  }, [inventory, selectedItems, report, isInventoryLoading, isSalesLoading, salesError]);

  useEffect(() => {
    if (inventory && selectedItems.length === 0) {
      setSelectedItems(inventory.map(item => ({ id: item.id, quantity: 0 })));
    }
  }, [inventory]);

  const handleAddItem = (itemId: number) => {
    const existingItem = selectedItems.find(item => item.id === itemId);
    if (existingItem) {
      setAlert({ type: 'warning', message: 'Item already added to sale' });
      return;
    }
    setSelectedItems([...selectedItems, { id: itemId, quantity: 1 }]);
  };

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saleData = {
        ...formData,
        saleItems: selectedItems
          .filter(item => item.quantity > 0)
          .map(item => ({
            inventoryItemId: item.id,
            quantity: item.quantity
          }))
      };

      await salesService.createSale(saleData);
      setAlert({ type: 'success', message: 'Sale created successfully' });
      setIsAddModalOpen(false);
      setSelectedItems([]);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        paymentMethod: '',
        notes: '',
        saleItems: []
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create sale';
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const handleGenerateReport = async () => {
    try {
      setAlert(null);
      await getSalesReport(
        format(dateRange.start, 'yyyy-MM-dd'),
        format(dateRange.end, 'yyyy-MM-dd')
      );
      setIsInitialLoad(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await handleGenerateReport();
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  if (isInitialLoad && (isInventoryLoading || isSalesLoading)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="body1" ml={2}>Loading sales data...</Typography>
      </Box>
    );
  }

  if (salesError && !report) {
    return (
      <Box p={3}>
        <MuiAlert severity="error" sx={{ mb: 2 }}>
          Error loading sales data: {salesError}
        </MuiAlert>
        <Button 
        variant="contained" 
          color="primary" 
          onClick={handleGenerateReport}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="p-4">
        {alert && (
          <MuiAlert 
            severity={alert.type} 
            onClose={() => setAlert(null)}
            sx={{ mb: 2 }}
          >
            {alert.message}
          </MuiAlert>
        )}
        
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales</h1>
          <Button 
            variant="primary" 
            onClick={() => setIsAddModalOpen(true)}
            startIcon={<Plus size={18} />}
          >
            Add Sale
          </Button>
        </div>

        {/* Sales Report Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
          <div className="flex gap-4 mb-4 flex-wrap">
            <DatePicker
              label="Start Date"
              value={dateRange.start}
              onChange={(newValue) => setDateRange(prev => ({
                ...prev,
                start: newValue || new Date()
              }))}
              maxDate={dateRange.end || new Date()}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="End Date"
              value={dateRange.end}
              onChange={(newValue) => setDateRange(prev => ({
                ...prev,
                end: newValue || new Date()
              }))}
              minDate={dateRange.start}
              maxDate={new Date()}
              slotProps={{ textField: { size: 'small' } }}
            />
            <Button 
              variant="secondary" 
              onClick={handleGenerateReport}
              disabled={isSalesLoading}
              startIcon={isSalesLoading ? <CircularProgress size={20} /> : <Refresh size={18} />}
            >
              {isSalesLoading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          {!report ? (
            <MuiAlert severity="info">No report data available. Generate a report to view sales data.</MuiAlert>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <DollarSign size={20} className="mr-2" />
                      <Typography variant="h6">Total Sales</Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      ${report.totalSales?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {report.totalTransactions || 0} transactions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <TrendingUp size={20} className="mr-2" />
                      <Typography variant="h6">Avg. Order Value</Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      ${report.averageTransactionValue?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dateRange.start && dateRange.end && (
                        `${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Top Selling Items</Typography>
                    {report.topSellingItems.map((item: TopSellingItemDto) => (
                      <div key={item.inventoryItemId} className="mb-2">
                        <Typography variant="subtitle1">{item.itemName}</Typography>
                        <Typography>Quantity: {item.quantitySold}</Typography>
                        <Typography>Revenue: ${item.totalRevenue.toFixed(2)}</Typography>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Sales by Payment Method</Typography>
                    {report.salesByPaymentMethod.map((method: SalesByPaymentMethodDto) => (
                      <div key={method.paymentMethod} className="mb-2">
                        <Typography variant="subtitle1">{method.paymentMethod}</Typography>
                        <Typography>Count: {method.transactionCount}</Typography>
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
                    {report.salesByDay.map((sale: SalesByDayDto) => (
                      <div key={sale.date} className="mb-2">
                        <Typography variant="subtitle1">{new Date(sale.date).toLocaleDateString()}</Typography>
                        <Typography>Sales: {sale.transactionCount}</Typography>
                        <Typography>Revenue: ${sale.totalAmount.toFixed(2)}</Typography>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </div>

        {/* Add Sale Modal */}
        <Modal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Sale"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer Email</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer Phone</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select payment method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Items</label>
              <div className="space-y-2">
                {inventory.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-600"> - ${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleAddItem(item.id)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Selected Items</label>
              <div className="space-y-2">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{inventory.find(i => i.id === item.id)?.name}</span>
                      <span className="text-sm text-gray-600"> - Quantity: {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded"
                        min={1}
                      />
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Sale
              </Button>
            </div>
          </form>
        </Modal>

        {/* Alert */}
        {alert && (
          <Alert
            variant={alert.type}
            onDismiss={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default Sales;