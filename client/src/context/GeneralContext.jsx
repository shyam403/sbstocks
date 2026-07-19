import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance.js';

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on initialization
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/users/login', { email, password });
      
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data._id,
        username: data.username,
        email: data.email,
        usertype: data.usertype
      }));

      toast.success('Logged in successfully!');
      
      if (data.usertype === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Invalid credentials.';
      toast.error(errorMsg);
      throw error;
    }
  };

  // Register handler
  const register = async (username, email, password, usertype) => {
    try {
      const { data } = await axiosInstance.post('/users/register', {
        username,
        email,
        password,
        usertype
      });

      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data._id,
        username: data.username,
        email: data.email,
        usertype: data.usertype
      }));

      toast.success('Registration successful!');
      
      if (data.usertype === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMsg);
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully.');
    navigate('/');
  };

  // Fetch updated user profile (like balance)
  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/users/profile');
      setUser(prev => ({ ...prev, balance: data.balance }));
      
      // Update local storage representation too
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localUser.balance = data.balance;
      localStorage.setItem('user', JSON.stringify(localUser));
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Wallet transaction (Deposit / Withdraw)
  const updateWallet = async (type, paymentMode, amount) => {
    try {
      const { data } = await axiosInstance.post('/users/wallet', {
        type,
        paymentMode,
        amount
      });
      toast.success(`${type} of $${amount} succeeded!`);
      await fetchProfile(); // update local state
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Wallet transaction failed.';
      toast.error(errorMsg);
      throw error;
    }
  };

  return (
    <GeneralContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        fetchProfile,
        updateWallet
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
