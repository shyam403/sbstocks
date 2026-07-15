import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import illustration from '../assets/stock_trading_illustration.png';

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      if (user.usertype === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [navigate]);

  return (
    <div className="landing-page">
      {/* Public Header */}
      <header className="public-header">
        <div className="public-header-container">
          <div className="public-brand">SB Stocks</div>
          <nav className="public-nav">
            <span className="public-nav-link active">Home</span>
            <span className="public-nav-link">About</span>
            <span className="public-nav-link" onClick={() => setIsLogin(false)}>Join now</span>
          </nav>
        </div>
      </header>

      {/* Hero Body */}
      <main className="landing-main">
        <div className="landing-container">
          <div className="landing-hero-section">
            <div className="landing-info">
              <h1 className="landing-title">SB Stock Trading</h1>
              <p className="landing-description">
                Experience seamless stock market trading with our user-friendly platform,
                offering real-time data, advanced analytics, and swift execution to empower
                traders and investors alike.
              </p>
              <div className="landing-image-container">
                <img
                  src={illustration}
                  alt="Stock Market Trading Growth Illustration"
                  className="landing-image"
                />
              </div>
            </div>
            <div className="landing-auth-container">
              {isLogin ? (
                <Login onToggle={() => setIsLogin(false)} />
              ) : (
                <Register onToggle={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
