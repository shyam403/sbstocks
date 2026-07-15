import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(GeneralContext);
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.usertype === 'admin';

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to={isAdmin ? '/admin' : '/home'}>
            {isAdmin ? 'SB Stocks (Admin)' : 'SB Stocks'}
          </Link>
        </div>
        <ul className="navbar-links">
          {isAdmin ? (
            // Admin Links
            <>
              <li>
                <Link to="/admin" className={isActive('/admin')}>Home</Link>
              </li>
              <li>
                <Link to="/admin/users" className={isActive('/admin/users')}>Users</Link>
              </li>
              <li>
                <Link to="/admin/orders" className={isActive('/admin/orders')}>Orders</Link>
              </li>
              <li>
                <Link to="/admin/transactions" className={isActive('/admin/transactions')}>Transactions</Link>
              </li>
            </>
          ) : (
            // User Links
            <>
              <li>
                <Link to="/home" className={isActive('/home')}>Home</Link>
              </li>
              <li>
                <Link to="/portfolio" className={isActive('/portfolio')}>Portfolio</Link>
              </li>
              <li>
                <Link to="/history" className={isActive('/history')}>History</Link>
              </li>
              <li>
                <Link to="/profile" className={isActive('/profile')}>Profile</Link>
              </li>
            </>
          )}
          <li>
            <button onClick={logout} className="btn-logout-link">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
