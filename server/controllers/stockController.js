// In-memory stock market data
export let marketStocks = [
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 228.02, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 85000000, high: 232.00, low: 225.50, change: -7.44, percentChange: -3.16 },
  { symbol: 'KVUE', name: 'Kenvue Inc.', price: 23.49, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 12000000, high: 24.10, low: 23.30, change: -0.34, percentChange: -1.42 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 172.53, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 8000000, high: 173.20, low: 171.80, change: -0.55, percentChange: -0.32 },
  { symbol: 'NIO', name: 'NIO Inc.', price: 11.18, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 45000000, high: 11.80, low: 11.05, change: -0.42, percentChange: -3.63 },
  { symbol: 'AMC', name: 'AMC Entertainment Holdings, Inc.', price: 3.68, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 30000000, high: 3.75, low: 3.55, change: 0.07, percentChange: 1.90 },
  { symbol: 'NU', name: 'Nu Holdings Ltd.', price: 8.16, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 15000000, high: 8.45, low: 8.10, change: -0.288, percentChange: -3.41 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 174.98, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 40000000, high: 176.50, low: 172.10, change: 4.50, percentChange: 2.64 },
  { symbol: 'AACG', name: 'ATA Creativity Global', price: 1.50, stockType: 'Depositary Receipt', stockExchange: 'NASDAQ', volume: 150000, high: 1.58, low: 1.45, change: -0.05, percentChange: -3.22 },
  { symbol: 'AACI', name: 'Armada Acquisition Corp. I', price: 10.25, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 50000, high: 10.30, low: 10.20, change: 0.01, percentChange: 0.10 },
  { symbol: 'AACIU', name: 'Armada Acquisition Corp. I Unit', price: 10.35, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 10000, high: 10.40, low: 10.30, change: 0.05, percentChange: 0.49 },
  { symbol: 'AACIW', name: 'Armada Acquisition Corp. I', price: 0.12, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 200000, high: 0.13, low: 0.11, change: -0.01, percentChange: -7.69 },
  { symbol: 'AACOU', name: 'Advancit Acquisition Corp. I', price: 10.15, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 20000, high: 10.20, low: 10.10, change: 0.00, percentChange: 0.00 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 180.50, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 50000000, high: 182.00, low: 179.50, change: 1.25, percentChange: 0.70 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 135.25, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 25000000, high: 136.50, low: 134.10, change: -0.85, percentChange: -0.62 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 340.10, stockType: 'Common Stock', stockExchange: 'NASDAQ', volume: 20000000, high: 342.50, low: 338.00, change: 2.45, percentChange: 0.73 }
];

// Start background simulation to update prices periodically
export const startStockSimulation = () => {
  setInterval(() => {
    marketStocks = marketStocks.map(stock => {
      const volatility = 0.004; // Max 0.4% movement per 4s
      const random = (Math.random() * 2 - 1) * volatility;
      const priceChange = stock.price * random;
      const newPrice = Math.max(0.05, Number((stock.price + priceChange).toFixed(2)));
      
      // Calculate change relative to initial price or previous close
      const change = Number((newPrice - (stock.price - stock.change)).toFixed(2));
      const previousClose = stock.price - stock.change;
      const percentChange = Number(((change / previousClose) * 100).toFixed(2));
      
      let high = stock.high;
      let low = stock.low;
      if (newPrice > high) high = newPrice;
      if (newPrice < low) low = newPrice;

      return {
        ...stock,
        price: newPrice,
        change,
        percentChange,
        high,
        low,
        volume: stock.volume + Math.floor(Math.random() * 1000)
      };
    });
  }, 4000);
};

// @desc    Get trending stocks list
// @route   GET /api/stocks/trending
// @access  Public
export const getTrendingStocks = (req, res) => {
  // Return the first 6 stocks as trending
  res.status(200).json(marketStocks.slice(0, 6));
};

// @desc    Get all available stocks
// @route   GET /api/stocks/list
// @access  Public
export const getStocksList = (req, res) => {
  res.status(200).json(marketStocks);
};

// @desc    Get detailed stock and historical chart data
// @route   GET /api/stocks/chart/:symbol
// @access  Public
export const getStockChart = (req, res) => {
  const { symbol } = req.params;
  const stock = marketStocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  
  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' });
  }

  // Generate 20 historical intraday data points (past ~3.3 hours)
  const chartData = [];
  const now = new Date();
  let basePrice = stock.price;

  for (let i = 19; i >= 0; i--) {
    const timePoint = new Date(now.getTime() - i * 10 * 60 * 1000); // 10m interval
    const timeStr = timePoint.toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"
    
    // Add random fluctuations to create candlestick data
    const open = Number(basePrice.toFixed(2));
    const fluctuation = basePrice * (Math.random() * 0.006 - 0.003);
    const close = Number((basePrice + fluctuation).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * 0.4).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * 0.4).toFixed(2));

    chartData.push({
      time: timeStr,
      open,
      high,
      low,
      close,
      price: close
    });

    basePrice += fluctuation; // Update base for next step
  }

  res.status(200).json({
    ...stock,
    chartData
  });
};
