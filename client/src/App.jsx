import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GeneralProvider } from './context/GeneralContext.jsx';
import Navbar from './components/Navbar.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Portfolio from './pages/Portfolio.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';
import StockChart from './pages/StockChart.jsx';

// Admin Pages
import Admin from './pages/Admin.jsx';
import Users from './pages/Users.jsx';
import AllOrders from './pages/AllOrders.jsx';
import AllTransactions from './pages/AllTransactions.jsx';
import AdminStockChart from './pages/AdminStockChart.jsx';

// Protected Route wrapper component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.usertype !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="container-wrapper">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <GeneralProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Landing />} />

          {/* Protected Trader Routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/chart/:symbol" element={
            <ProtectedRoute>
              <StockChart />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly={true}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly={true}>
              <AllOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/transactions" element={
            <ProtectedRoute adminOnly={true}>
              <AllTransactions />
            </ProtectedRoute>
          } />
          <Route path="/admin/stockchart" element={
            <ProtectedRoute adminOnly={true}>
              <AdminStockChart />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </GeneralProvider>
    </Router>
  );
}

export default App;
