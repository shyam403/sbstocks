import React, { useState, useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext.jsx';

const Register = ({ onToggle }) => {
  const { register } = useContext(GeneralContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !usertype) return;

    setLoading(true);
    try {
      await register(username, email, password, usertype);
    } catch (err) {
      // errors handled by toast in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h3 className="auth-card-title">Register</h3>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg-email">Email address</label>
          <input
            id="reg-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg-usertype">User type</label>
          <select
            id="reg-usertype"
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            required
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Registering...' : 'Sign up'}
        </button>
      </form>
      <div className="auth-card-footer">
        Already registered? <span className="auth-toggle-link" onClick={onToggle}>Login</span>
      </div>
    </div>
  );
};

export default Register;
