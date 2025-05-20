import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Purchases from './pages/Purchases';
import Orders from './pages/Orders';

import Suppliers from './pages/Suppliers';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { UserProvider } from './context/UserContext';
import { InventoryProvider } from './context/InventoryContext';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <UserProvider>
      <InventoryProvider>
        
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="purchases" element={<Purchases />} />
              <Route path="orders" element={<Orders />} />
         
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="users" element={<Users />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
      
      </InventoryProvider>
    </UserProvider>
  );
}

export default App;