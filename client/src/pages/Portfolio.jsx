import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance.js';

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHoldings = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/holdings');
      setHoldings(data);
    } catch (error) {
      console.error('Error fetching holdings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredHoldings = holdings.filter(item => 
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total portfolio value (sum of total prices)
  const portfolioTotal = holdings.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="portfolio-page container-inner py-4">
      <div className="portfolio-header-container d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">My Portfolio</h2>
        <div className="search-box-container">
          <input
            type="text"
            placeholder="Enter Stock Symbol..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {portfolioTotal > 0 && (
        <div className="portfolio-summary-banner card mb-4">
          <span className="summary-label">Total Portfolio Assets Valuation</span>
          <span className="summary-value">$ {portfolioTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="text-center py-5 text-muted">Loading portfolio...</div>
        ) : (
          <div className="table-responsive">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Exchange</th>
                  <th>Stock name</th>
                  <th>Symbol</th>
                  <th>Stocks</th>
                  <th>Stock price</th>
                  <th>Total value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoldings.map(item => (
                  <tr key={item.symbol}>
                    <td>
                      <span className="badge badge-nasdaq">NASDAQ</span>
                    </td>
                    <td>{item.name}</td>
                    <td className="font-weight-bold">{item.symbol}</td>
                    <td>{item.count}</td>
                    <td>$ {item.price.toFixed(2)}</td>
                    <td className="font-weight-bold">$ {item.totalPrice.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/chart/${item.symbol}`)}
                        className="btn btn-primary btn-sm"
                      >
                        View Chart
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredHoldings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-5">
                      No holdings in your portfolio yet. Go to <span className="auth-toggle-link" onClick={() => navigate('/home')}>Home</span> to browse stocks!
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

export default Portfolio;
