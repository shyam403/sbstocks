import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance.js';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const { data } = await axiosInstance.get('/transactions/all-transactions');
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching global transaction logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, []);

  return (
    <div className="all-transactions-page container-inner py-4">
      <h2 className="page-title mb-4">Admin(All Transactions):</h2>

      <div className="card">
        <h3 className="panel-title mb-3">All wallet transactions</h3>
        {loading ? (
          <div className="text-center py-5 text-muted">Loading global transaction logs...</div>
        ) : (
          <div className="table-responsive">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>UserId</th>
                  <th>Amount</th>
                  <th>Action</th>
                  <th>Payment mode</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={tx._id || idx}>
                    <td className="text-muted font-monospace text-truncate" style={{ maxWidth: '160px' }}>
                      {tx.user}
                    </td>
                    <td className="font-weight-bold">$ {tx.amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${tx.type === 'Deposit' ? 'badge-nasdaq' : 'badge-intraday'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.paymentMode}</td>
                    <td className="text-muted">{tx.time}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      No wallet transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;
