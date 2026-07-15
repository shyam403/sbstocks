import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import axiosInstance from '../components/axiosInstance.js';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminStockChart = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('TSLA');
  const [stockDetails, setStockDetails] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {
    try {
      const res = await axiosInstance.get('/stocks/list');
      setStocks(res.data);
    } catch (error) {
      console.error('Error fetching stock list:', error);
    }
  };

  const fetchStockDetails = async () => {
    try {
      const { data } = await axiosInstance.get(`/stocks/chart/${selectedSymbol}`);
      setStockDetails(data);
      setChartData(data.chartData);
    } catch (error) {
      console.error('Error fetching stock chart details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    fetchStockDetails();
    const interval = setInterval(() => {
      fetchStockDetails();
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // Chart configuration
  const chartLabels = chartData.map(item => item.time);
  const chartValues = chartData.map(item => item.price);
  const isNegative = stockDetails?.change < 0;

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: `${selectedSymbol} Price ($)`,
        data: chartValues,
        fill: true,
        borderColor: isNegative ? 'rgb(220, 53, 69)' : 'rgb(25, 135, 84)',
        backgroundColor: isNegative ? 'rgba(220, 53, 69, 0.05)' : 'rgba(25, 135, 84, 0.05)',
        tension: 0.2,
        pointRadius: 1,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8, color: '#888' } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.03)' }, ticks: { color: '#888' } }
    }
  };

  return (
    <div className="admin-stockchart-page container-inner py-4">
      <h2 className="page-title mb-4">Admin: Stock Performance Charts</h2>

      <div className="admin-stockchart-layout">
        {/* Selector Panel */}
        <div className="stock-selector-card card mr-4 mb-3" style={{ minWidth: '220px' }}>
          <h3 className="panel-title mb-3">Select Asset</h3>
          <ul className="admin-stock-selector-list">
            {stocks.map(s => (
              <li 
                key={s.symbol} 
                onClick={() => setSelectedSymbol(s.symbol)}
                className={`stock-select-item ${s.symbol === selectedSymbol ? 'active' : ''}`}
              >
                <span className="font-weight-bold">{s.symbol}</span>
                <span className="text-muted ml-2">{s.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chart View Panel */}
        <div className="chart-view-panel card flex-grow-1">
          {loading || !stockDetails ? (
            <div className="text-center py-5 text-muted">Loading chart metrics...</div>
          ) : (
            <>
              <div className="chart-header d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="panel-title m-0">{stockDetails.name} ({stockDetails.symbol})</h3>
                  <span className="badge badge-nasdaq mt-1">{stockDetails.stockExchange}</span>
                </div>
                <div className={`text-right ${isNegative ? 'price-down' : 'price-up'}`}>
                  <h3 className="m-0">$ {stockDetails.price.toFixed(2)}</h3>
                  <span className="font-size-sm">
                    {isNegative ? '' : '+'}{stockDetails.change.toFixed(2)} ({isNegative ? '' : '+'}{stockDetails.percentChange}%)
                  </span>
                </div>
              </div>

              <div className="canvas-chart-container" style={{ height: '320px' }}>
                <Line data={data} options={options} />
              </div>

              <div className="stock-stats-grid mt-4">
                <div className="stat-card">
                  <span className="stat-label">High</span>
                  <span className="stat-value">$ {stockDetails.high.toFixed(2)}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Low</span>
                  <span className="stat-value">$ {stockDetails.low.toFixed(2)}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Volume</span>
                  <span className="stat-value">{stockDetails.volume.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Asset Type</span>
                  <span className="stat-value">{stockDetails.stockType}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStockChart;
