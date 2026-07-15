import React, { useState, useEffect, useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext.jsx';
import axiosInstance from '../components/axiosInstance.js';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateWallet, fetchProfile } = useContext(GeneralContext);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(null); // 'Deposit' or 'Withdraw'
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('net banking');
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const { data } = await axiosInstance.get('/transactions/user-transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTransactions();
  }, []);

  const handleWalletAction = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    if (!amount || numAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    if (showModal === 'Withdraw' && user.balance < numAmount) {
      toast.error('Insufficient balance to withdraw.');
      return;
    }

    setLoading(true);
    try {
      await updateWallet(showModal, paymentMode, numAmount);
      setShowModal(null);
      setAmount('');
      fetchTransactions(); // Refresh transactions list
    } catch (err) {
      // error is handled in context
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-5 text-muted">Loading account profile...</div>;
  }

  return (
    <div className="profile-page container-inner py-4">
      <h2 className="page-title mb-4">My Account</h2>

      {/* Account Info & Wallet Balance Card */}
      <div className="account-summary-card card mb-4">
        <h4 className="username-display">{user.username}</h4>
        
        <div className="balance-section my-3">
          <span className="balance-label">Trading balance</span>
          <h2 className="balance-display">$ {user.balance?.toFixed(2) || '0.00'}</h2>
        </div>

        <div className="wallet-actions-row">
          <button
            onClick={() => {
              setShowModal('Deposit');
              setPaymentMode('net banking');
            }}
            className="btn btn-outline-primary"
          >
            Add Funds
          </button>
          <button
            onClick={() => {
              setShowModal('Withdraw');
              setPaymentMode('IMPS');
            }}
            className="btn btn-outline-primary"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <h3 className="section-title mb-3">Transactions</h3>
      <div className="transactions-list">
        {transactions.map((tx) => (
          <div key={tx._id} className="transaction-row-card card">
            <div className="tx-col tx-amount">
              <span className="tx-label">Amount</span>
              <span className="tx-value">$ {tx.amount.toFixed(2)}</span>
            </div>
            <div className="tx-col tx-action">
              <span className="tx-label">Action</span>
              <span className={`tx-value font-weight-bold ${tx.type === 'Deposit' ? 'text-success' : 'text-danger'}`}>
                {tx.type}
              </span>
            </div>
            <div className="tx-col tx-mode">
              <span className="tx-label">Payment mode</span>
              <span className="tx-value">{tx.paymentMode}</span>
            </div>
            <div className="tx-col tx-time">
              <span className="tx-label">Time</span>
              <span className="tx-value text-muted">{tx.time}</span>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center card py-5 text-muted">
            No transaction records found.
          </div>
        )}
      </div>

      {/* Deposit/Withdrawal Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h3 className="modal-title mb-3">{showModal} Funds</h3>
            <form onSubmit={handleWalletAction} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-amount">Amount ($)</label>
                <input
                  id="modal-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modal-payment-mode">Payment Mode</label>
                <select
                  id="modal-payment-mode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  required
                >
                  {showModal === 'Deposit' ? (
                    <>
                      <option value="net banking">net banking</option>
                      <option value="IMPS">IMPS</option>
                    </>
                  ) : (
                    <>
                      <option value="IMPS">IMPS</option>
                      <option value="net banking">net banking</option>
                    </>
                  )}
                </select>
              </div>

              <div className="modal-actions mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="btn btn-outline-secondary mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
