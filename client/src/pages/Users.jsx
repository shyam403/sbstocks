import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance.js';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get('/users/all-users');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching registered users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="users-page container-inner py-4">
      <h2 className="page-title mb-4">Admin(All Users):</h2>

      <div className="card">
        <h3 className="panel-title mb-3">All users</h3>
        {loading ? (
          <div className="text-center py-5 text-muted">Loading registered accounts...</div>
        ) : (
          <div className="users-stack">
            {users.map((u) => (
              <div key={u._id} className="user-card-row mb-3 p-3 card border-accent">
                <div className="user-info-item">
                  <span className="user-info-label">User id: </span>
                  <span className="user-info-val text-accent">{u._id}</span>
                </div>
                <div className="user-info-item">
                  <span className="user-info-label">Username: </span>
                  <span className="user-info-val font-weight-bold">{u.username}</span>
                </div>
                <div className="user-info-item">
                  <span className="user-info-label">Email: </span>
                  <span className="user-info-val">{u.email}</span>
                </div>
                <div className="user-info-item">
                  <span className="user-info-label">Balance: </span>
                  <span className="user-info-val font-weight-bold text-success">{u.balance}</span>
                </div>
                <div className="user-info-item">
                  <span className="user-info-label">Role: </span>
                  <span className="user-info-val text-muted">{u.usertype}</span>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center py-5 text-muted">
                No registered users found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
