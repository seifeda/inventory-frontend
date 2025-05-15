import React from 'react';
import { useInventory } from '../context/InventoryContext';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import Card from '../components/Card';
import { Package, DollarSign, ShoppingCart, AlertTriangle, Truck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';

const Dashboard = () => {
  const { inventory, orders, purchases, isLoading } = useInventory();
  
  // Calculate stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'Out of Stock').length;
  const totalInventoryValue = inventory.reduce((total, item) => total + (item.quantity * item.costPrice), 0);
  
  const pendingOrders = orders.filter(order => order.status === 'Pending' || order.status === 'Processing').length;
  const pendingPurchases = purchases.filter(purchase => purchase.status === 'Pending' || purchase.status === 'Approved').length;
  
  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Low stock and out of stock items
  const stockAlerts = inventory
    .filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock')
    .slice(0, 5);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Products" 
          value={totalItems} 
          icon={Package} 
          iconColor="bg-blue-500" 
        />
        <StatCard 
          title="Inventory Value" 
          value={`$${totalInventoryValue.toFixed(2)}`} 
          icon={DollarSign} 
          iconColor="bg-green-500" 
          change={3.2} 
        />
        <StatCard 
          title="Pending Orders" 
          value={pendingOrders} 
          icon={ShoppingCart} 
          iconColor="bg-yellow-500" 
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockItems} 
          icon={AlertTriangle} 
          iconColor="bg-red-500" 
          change={outOfStockItems > 0 ? outOfStockItems : undefined} 
          changeTimeframe={outOfStockItems > 0 ? `${outOfStockItems} out of stock` : undefined} 
        />
      </div>
      
      {/* Alerts */}
      {stockAlerts.length > 0 && (
        <Alert 
          variant="warning" 
          title="Inventory Alerts"
          dismissible
          onDismiss={() => console.log('Dismissed')}
        >
          You have {lowStockItems} items with low stock and {outOfStockItems} items out of stock.
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card 
          title="Recent Orders" 
          actions={<Link to="/orders" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>}
        >
          <div className="overflow-hidden">
            <Table 
              columns={[
                { key: 'orderNumber', header: 'Order #' },
                { key: 'customer', header: 'Customer' },
                { key: 'date', header: 'Date', render: (value) => new Date(value).toLocaleDateString() },
                { key: 'status', header: 'Status', render: (value) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    value === 'Delivered' ? 'bg-green-100 text-green-800' :
                    value === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    value === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    value === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {value}
                  </span>
                ) },
                { key: 'total', header: 'Total', render: (value) => `$${value.toFixed(2)}` },
              ]}
              data={recentOrders}
              onRowClick={(row) => console.log('Clicked order', row)}
            />
          </div>
        </Card>
        
        {/* Stock Alerts */}
        <Card 
          title="Stock Alerts" 
          actions={<Link to="/inventory" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>}
        >
          <div className="overflow-hidden">
            <Table 
              columns={[
                { key: 'sku', header: 'SKU' },
                { key: 'name', header: 'Item' },
                { key: 'quantity', header: 'Qty' },
                { key: 'reorderPoint', header: 'Reorder Point' },
                { key: 'status', header: 'Status', render: (value) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    value === 'In Stock' ? 'bg-green-100 text-green-800' :
                    value === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {value}
                  </span>
                ) },
              ]}
              data={stockAlerts}
              onRowClick={(row) => console.log('Clicked item', row)}
            />
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/inventory?action=add" 
              className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center text-center"
            >
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-800">Add New Product</span>
            </Link>
            <Link 
              to="/orders?action=add" 
              className="p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors flex flex-col items-center justify-center text-center"
            >
              <ShoppingCart className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-800">Create Sales Order</span>
            </Link>
            <Link 
              to="/purchases?action=add" 
              className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors flex flex-col items-center justify-center text-center"
            >
              <Truck className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-800">Create Purchase Order</span>
            </Link>
            <Link 
              to="/reports" 
              className="p-4 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors flex flex-col items-center justify-center text-center"
            >
              <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-800">View Reports</span>
            </Link>
          </div>
        </Card>
        
        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm text-gray-500">
                          <a href="#" className="font-medium text-gray-900">New stock received</a> for <a href="#" className="font-medium text-blue-600">Printer Paper</a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm text-gray-500">
                          <a href="#" className="font-medium text-gray-900">New order</a> from <a href="#" className="font-medium text-blue-600">Acme Corporation</a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm text-gray-500">
                          <a href="#" className="font-medium text-gray-900">Low stock alert</a> for <a href="#" className="font-medium text-blue-600">Keyboard</a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative">
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm text-gray-500">
                          <a href="#" className="font-medium text-gray-900">Shipment delivered</a> to <a href="#" className="font-medium text-blue-600">XYZ Ltd.</a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="mt-6 text-center">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all activity
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;