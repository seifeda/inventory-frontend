import React, { useState } from 'react';
import { useSales } from '../context/SalesContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { BarChart, Calendar, Download, FileText, Filter, PieChart, TrendingUp } from 'lucide-react';

const Reports = () => {
  const { getSalesReport } = useSales();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const reportTypes = [
    { id: 'inventory', name: 'Inventory Status', icon: BarChart, description: 'Current inventory levels, stock value, and slow-moving items' },
    { id: 'sales', name: 'Sales Analysis', icon: TrendingUp, description: 'Sales data by product, customer, and time period' },
    { id: 'purchasing', name: 'Purchase Orders', icon: FileText, description: 'Purchase order trends and supplier analytics' },
    { id: 'expenses', name: 'Expense Report', icon: PieChart, description: 'Cost breakdowns by category and time period' },
  ];

  const handleGenerateReport = async () => {
    if (selectedReport === 'sales') {
      try {
        setIsLoading(true);
        setError(null);
        
        // Calculate date range based on selected period
        const endDate = new Date();
        const startDate = new Date();
        
        switch (selectedPeriod) {
          case 'week':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(endDate.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(endDate.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
          default:
            startDate.setMonth(endDate.getMonth() - 1);
        }
        
        const report = await getSalesReport(
          startDate.toISOString(),
          endDate.toISOString()
        );
        
        setReportData(report);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate report');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={Filter}
            onClick={() => console.log('Show filter')}
          >
            Filter
          </Button>
          <Button
            variant="outline"
            icon={Download}
            onClick={() => console.log('Export')}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className={`cursor-pointer transition-colors ${
              selectedReport === report.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <report.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedReport && (
        <Card>
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {reportTypes.find(r => r.id === selectedReport)?.name} Report
              </h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                    Time Period
                  </label>
                  <select
                    id="period"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 3 Months</option>
                    <option value="year">Last 12 Months</option>
                  </select>
                </div>
                
                {selectedReport === 'sales' && (
                  <>
                    <div>
                      <label htmlFor="salesType" className="block text-sm font-medium text-gray-700">
                        Report Type
                      </label>
                      <select
                        id="salesType"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="product">By Product</option>
                        <option value="customer">By Customer</option>
                        <option value="time">By Time Period</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="includeGraphs" className="block text-sm font-medium text-gray-700">
                        Include Visualizations
                      </label>
                      <select
                        id="includeGraphs"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {reportData && selectedReport === 'sales' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Card>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {reportData.totalSales}
                      </p>
                    </div>
                  </Card>
                  <Card>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ${reportData.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                  </Card>
                  <Card>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ${reportData.averageOrderValue.toFixed(2)}
                      </p>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <Card>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Items</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Revenue
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.topSellingItems.map((item: any) => (
                              <tr key={item.itemId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.itemName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantitySold}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${item.totalRevenue.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Payment Method</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Method
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Count
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.salesByPaymentMethod.map((method: any) => (
                              <tr key={method.paymentMethod}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {method.paymentMethod}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {method.count}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${method.totalAmount.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Date</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sales
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Revenue
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reportData.salesByDate.map((sale: any) => (
                            <tr key={sale.date}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(sale.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sale.totalSales}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${sale.totalRevenue.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;