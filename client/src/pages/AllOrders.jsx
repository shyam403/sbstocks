import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance.js';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const { data } = await axiosInstance.get('/orders/all-orders');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching global orders list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  return (
    <div className="all-orders-page container-inner py-4">
      <h2 className="page-title mb-4">Admin(All Orders):</h2>

      <div className="card">
        <h3 className="panel-title mb-3">My Orders</h3>
        {loading ? (
          <div className="text-center py-5 text-muted">Loading global orders list...</div>
        ) : (
          <div className="table-responsive">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>UserId</th>
                  <th>Order Type</th>
                  <th>Stock name</th>
                  <th>Symbol</th>
                  <th>Order type</th>
                  <th>Stocks</th>
                  <th>order price</th>
                  <th>order total value</th>
                  <th>order status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order._id || idx}>
                    <td className="text-muted font-size-sm font-monospace text-truncate" style={{ maxWidth: '140px' }}>
                      {order.user}
                    </td>
                    <td>
                      <span className="badge badge-intraday">
                        {order.stockType.toLowerCase()}
                      </span>
                    </td>
                    <td>{order.name}</td>
                    <td className="font-weight-bold">{order.symbol}</td>
                    <td>{order.orderType}</td>
                    <td>{order.count}</td>
                    <td>$ {order.price.toFixed(2)}</td>
                    <td className="font-weight-bold">$ {order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className="order-statusCompleted">
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-5">
                      No orders have been placed in the system yet.
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

export default AllOrders;
