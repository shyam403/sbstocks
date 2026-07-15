import React, { useState, useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext.jsx';

const Login = ({ onToggle }) => {
  const { login } = useContext(GeneralContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      // errors are handled in Context via react-toastify
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h3 className="auth-card-title">Login</h3>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <div className="auth-card-footer">
        Not registered? <span className="auth-toggle-link" onClick={onToggle}>Register</span>
      </div>
    </div>
  );
};

export default Login;
