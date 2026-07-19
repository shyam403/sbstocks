import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance.js';
import { GeneralContext } from '../context/GeneralContext.jsx';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchProfile } = useContext(GeneralContext);
  const navigate = useNavigate();

  // Load stocks and profile
  const loadData = async () => {
    try {
      const trendingRes = await axiosInstance.get('/stocks/trending');
      setTrending(trendingRes.data);

      const listRes = await axiosInstance.get('/stocks/list');
      setStocks(listRes.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  useEffect(() => {
    loadData();
    fetchProfile(); // update balance in navbar if any

    // Poll for stock price updates every 4 seconds
    const interval = setInterval(() => {
      loadData();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-page page-layout">
      {/* Trending Stocks Left Panel */}
      <div className="trending-panel card">
        <h3 className="panel-title">Trending stocks</h3>
        <div className="trending-list">
          {trending.map(stock => {
            const isNegative = stock.change < 0;
            return (
              <div key={stock.symbol} className="trending-item">
                <div className="trending-meta">
                  <span className="trending-name">{stock.name}</span>
                  <span className="trending-symbol">{stock.symbol}</span>
                </div>
                <div className={`trending-price ${isNegative ? 'price-down' : 'price-up'}`}>
                  $ {stock.price.toFixed(2)} ({isNegative ? '' : '+'}{stock.percentChange}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Watchlist / Browse Panel */}
      <div className="watchlist-panel card">
        <div className="watchlist-header">
          <h3 className="panel-title">Watchlist</h3>
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

        <div className="table-responsive">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Exchange</th>
                <th>Stock name</th>
                <th>Symbol</th>
                <th>Stock Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map(stock => (
                <tr key={stock.symbol}>
                  <td>
                    <span className="badge badge-nasdaq">NASDAQ</span>
                  </td>
                  <td>{stock.name}</td>
                  <td className="font-weight-bold">{stock.symbol}</td>
                  <td>{stock.stockType}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/chart/${stock.symbol}`)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStocks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No stocks found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
