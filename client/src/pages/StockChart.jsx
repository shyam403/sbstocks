import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance.js';
import { GeneralContext } from '../context/GeneralContext.jsx';

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

const StockChart = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user, fetchProfile } = useContext(GeneralContext);
  
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [orderType, setOrderType] = useState('Buy'); // 'Buy' or 'Sell'
  const [stockType, setStockType] = useState('Intraday'); // 'Intraday' or 'Delivery'
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStockData = async () => {
    try {
      const { data } = await axiosInstance.get(`/stocks/chart/${symbol}`);
      setStock(data);
      setChartData(data.chartData);
    } catch (error) {
      console.error('Error fetching stock chart details:', error);
      toast.error('Stock not found or API error.');
      navigate('/home');
    }
  };

  useEffect(() => {
    fetchStockData();
    // Poll for live price and chart update every 4 seconds
    const interval = setInterval(() => {
      fetchStockData();
    }, 4000);

    return () => clearInterval(interval);
  }, [symbol]);

  if (!stock) {
    return <div className="text-center py-5 text-muted">Loading stock details...</div>;
  }

  const isNegative = stock.change < 0;
  const currentPrice = stock.price;
  const totalPrice = Number((currentPrice * quantity).toFixed(2));

  // Chart configuration
  const chartLabels = chartData.map(item => item.time);
  const chartValues = chartData.map(item => item.price);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: `${stock.symbol} Price ($)`,
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
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          color: '#888',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.03)',
        },
        ticks: {
          color: '#888',
        },
      },
    },
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (quantity <= 0) {
      toast.error('Please enter a valid quantity.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosInstance.post('/orders/create', {
        symbol: stock.symbol,
        name: stock.name,
        price: currentPrice,
        count: quantity,
        stockType,
        orderType
      });
      toast.success(response.data.message);
      setQuantity(0);
      fetchProfile(); // update user wallet balance in navbar / global state
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error processing your order.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="stock-chart-page page-layout">
      {/* Left Column: Chart Container */}
      <div className="chart-main card">
        <div className="chart-header">
          <div className="chart-title-block">
            <h2 className="stock-symbol-title">{stock.name} ({stock.symbol})</h2>
            <span className="badge badge-nasdaq ml-2">{stock.stockExchange}</span>
          </div>
          <div className={`stock-live-price-metrics ${isNegative ? 'price-down' : 'price-up'}`}>
            <span className="live-price-large">$ {currentPrice.toFixed(2)}</span>
            <span className="price-diff-small">
              {isNegative ? '' : '+'}{stock.change.toFixed(2)} ({isNegative ? '' : '+'}{stock.percentChange}%)
            </span>
          </div>
        </div>

        {/* Apex/Chart.js Line Wrapper */}
        <div className="canvas-chart-container">
          <Line data={data} options={options} />
        </div>

        {/* Stock Stats Table */}
        <div className="stock-stats-grid">
          <div className="stat-card">
            <span className="stat-label">High</span>
            <span className="stat-value">$ {stock.high.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Low</span>
            <span className="stat-value">$ {stock.low.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Volume</span>
            <span className="stat-value">{stock.volume.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Change</span>
            <span className="stat-value font-weight-bold" style={{ color: isNegative ? '#dc3545' : '#198754' }}>
              {stock.change.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Trade Form Widget */}
      <div className="trade-widget card">
        <div className="trade-tabs">
          <button
            onClick={() => setOrderType('Buy')}
            className={`btn-trade-tab btn-buy ${orderType === 'Buy' ? 'active' : ''}`}
          >
            Buy @ $ {currentPrice.toFixed(2)}
          </button>
          <button
            onClick={() => setOrderType('Sell')}
            className={`btn-trade-tab btn-sell ${orderType === 'Sell' ? 'active' : ''}`}
          >
            Sell @ $ {currentPrice.toFixed(2)}
          </button>
        </div>

        <form onSubmit={handleOrderSubmit} className="trade-form">
          <div className="form-group">
            <label htmlFor="product-type">Product type</label>
            <select
              id="product-type"
              value={stockType}
              onChange={(e) => setStockType(e.target.value)}
              className="trade-select"
            >
              <option value="Intraday">Intraday</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="trade-quantity">Quantity</label>
            <input
              id="trade-quantity"
              type="number"
              min="1"
              value={quantity || ''}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="0"
              className="trade-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="total-price-disabled">Total price</label>
            <input
              id="total-price-disabled"
              type="text"
              value={`$ ${totalPrice.toFixed(2)}`}
              className="trade-input input-disabled"
              disabled
            />
          </div>

          <button
            type="submit"
            className={`btn btn-block font-weight-bold btn-trade-submit ${orderType === 'Buy' ? 'btn-success' : 'btn-danger'}`}
            disabled={submitting}
          >
            {submitting ? 'Executing...' : `${orderType} now`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockChart;
