import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance.js';

const Admin = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    ordersCount: 0,
    transactionsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const usersRes = await axiosInstance.get('/users/all-users');
        const ordersRes = await axiosInstance.get('/orders/all-orders');
        const txsRes = await axiosInstance.get('/transactions/all-transactions');

        setStats({
          usersCount: usersRes.data.length,
          ordersCount: ordersRes.data.length,
          transactionsCount: txsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching admin statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="admin-page container-inner py-4">
      <h2 className="page-title mb-4">Admin Control Center</h2>
      
      {loading ? (
        <div className="text-center py-5 text-muted">Loading administrative statistics...</div>
      ) : (
        <>
          <div className="stats-dashboard-grid mb-5">
            <div className="stat-card card text-center">
              <span className="stat-value large-count">{stats.usersCount}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-card card text-center">
              <span className="stat-value large-count">{stats.ordersCount}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-card card text-center">
              <span className="stat-value large-count">{stats.transactionsCount}</span>
              <span className="stat-label">Total Transactions</span>
            </div>
          </div>

          <div className="admin-actions-card card">
            <h3 className="panel-title mb-4">Quick Links</h3>
            <div className="admin-quick-links">
              <button 
                onClick={() => navigate('/admin/users')}
                className="btn btn-outline-primary btn-block mb-3"
              >
                Manage All Users
              </button>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="btn btn-outline-primary btn-block mb-3"
              >
                View Global Orders Log
              </button>
              <button 
                onClick={() => navigate('/admin/transactions')}
                className="btn btn-outline-primary btn-block mb-3"
              >
                View Global Wallet Transactions
              </button>
              <button 
                onClick={() => navigate('/admin/stockchart')}
                className="btn btn-outline-primary btn-block"
              >
                Admin Stock Charts
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
