import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Truck,
  Users,
  Building2,
  FileBarChart,
  FileText,
  Settings,
  HelpCircle,
  Box,
  X,
  DollarSign
} from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Sales', href: '/sales', icon: DollarSign },
    { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
    { name: 'Orders', href: '/orders', icon: Truck },
    { name: 'Suppliers', href: '/suppliers', icon: Building2 },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
  ];

  return (
    <>
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-blue-900">
        <div className="flex items-center justify-center h-16 px-4 bg-blue-800">
          <div className="flex items-center">
            <Box className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">InventoryPro</span>
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center px-2 py-2 text-sm font-medium text-white bg-blue-800 rounded-md'
                    : 'flex items-center px-2 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-800 rounded-md'
                }
              >
                <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-blue-800 p-4">
            <div className="flex flex-col space-y-1">
              <NavLink
                to="/settings"
                className="flex items-center px-2 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-800 rounded-md"
              >
                <Settings className="h-5 w-5 mr-3" aria-hidden="true" />
                Settings
              </NavLink>
              <a 
                href="#help"
                className="flex items-center px-2 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-800 rounded-md"
              >
                <HelpCircle className="h-5 w-5 mr-3" aria-hidden="true" />
                Help & Support
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar overlay */}
      <div className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20 sidebar-overlay hidden"></div>
      
      {/* Mobile sidebar */}
      <div className="lg:hidden fixed inset-y-0 left-0 w-64 bg-blue-900 z-30 transform -translate-x-full transition-transform duration-300 ease-in-out sidebar">
        <div className="flex items-center justify-between h-16 px-4 bg-blue-800">
          <div className="flex items-center">
            <Box className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">InventoryPro</span>
          </div>
          <button 
            className="text-white focus:outline-none" 
            onClick={() => document.body.classList.remove('sidebar-open')}
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center px-2 py-2 text-sm font-medium text-white bg-blue-800 rounded-md'
                    : 'flex items-center px-2 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-800 rounded-md'
                }
                onClick={() => document.body.classList.remove('sidebar-open')}
              >
                <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;