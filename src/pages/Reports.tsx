import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { BarChart, Calendar, Download, FileText, Filter, PieChart, TrendingUp } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const reportTypes = [
    { id: 'inventory', name: 'Inventory Status', icon: BarChart, description: 'Current inventory levels, stock value, and slow-moving items' },
    { id: 'sales', name: 'Sales Analysis', icon: TrendingUp, description: 'Sales data by product, customer, and time period' },
    { id: 'purchasing', name: 'Purchase Orders', icon: FileText, description: 'Purchase order trends and supplier analytics' },
    { id: 'expenses', name: 'Expense Report', icon: PieChart, description: 'Cost breakdowns by category and time period' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            className={`block w-full ${
              selectedReport === report.id 
                ? 'bg-blue-50 border-blue-200 shadow-sm' 
                : 'bg-white hover:bg-gray-50 border-gray-200'
            } rounded-lg border p-5 text-left transition-colors focus:outline-none`}
            onClick={() => setSelectedReport(report.id)}
          >
            <report.icon className={`h-8 w-8 ${selectedReport === report.id ? 'text-blue-600' : 'text-gray-400'} mb-3`} />
            <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{report.description}</p>
          </button>
        ))}
      </div>
      
      {selectedReport && (
        <Card title="Report Options">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="reportPeriod" className="block text-sm font-medium text-gray-700">
                  Time Period
                </label>
                <div className="mt-1">
                  <select
                    id="reportPeriod"
                    name="reportPeriod"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="reportFormat" className="block text-sm font-medium text-gray-700">
                  Format
                </label>
                <div className="mt-1">
                  <select
                    id="reportFormat"
                    name="reportFormat"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>
              </div>
              
              {selectedReport === 'inventory' && (
                <>
                  <div className="sm:col-span-3">
                    <label htmlFor="inventoryCategory" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1">
                      <select
                        id="inventoryCategory"
                        name="inventoryCategory"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="all">All Categories</option>
                        <option value="electronics">Electronics</option>
                        <option value="office">Office Supplies</option>
                        <option value="furniture">Furniture</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700">
                      Stock Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="stockStatus"
                        name="stockStatus"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="all">All Items</option>
                        <option value="instock">In Stock</option>
                        <option value="lowstock">Low Stock</option>
                        <option value="outofstock">Out of Stock</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              {selectedReport === 'sales' && (
                <>
                  <div className="sm:col-span-3">
                    <label htmlFor="salesType" className="block text-sm font-medium text-gray-700">
                      Report Type
                    </label>
                    <div className="mt-1">
                      <select
                        id="salesType"
                        name="salesType"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="product">By Product</option>
                        <option value="customer">By Customer</option>
                        <option value="time">By Time Period</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="includeGraphs" className="block text-sm font-medium text-gray-700">
                      Include Visualizations
                    </label>
                    <div className="mt-1">
                      <select
                        id="includeGraphs"
                        name="includeGraphs"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {selectedPeriod === 'custom' && (
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" icon={Calendar}>
                Schedule Report
              </Button>
              <Button variant="primary" icon={Download}>
                Generate Report
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {selectedReport === 'inventory' && (
        <Card title="Inventory Status Report Preview">
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-blue-800 mb-4">Report Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">257</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">$124,567.00</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Low Stock Items</p>
                  <p className="text-2xl font-bold text-yellow-600">14</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Inventory by Category</h4>
              <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <p>Chart visualization will appear here</p>
                    <p className="text-sm">Configure report parameters and generate to view</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Sample Data Preview</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        SKU-1001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Laptop Computer
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Electronics
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        24
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $28,776.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Stock
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        SKU-1002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Office Chair
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Furniture
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        12
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $3,588.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Stock
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        SKU-1003
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Printer Paper
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Office Supplies
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        4
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $79.96
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;