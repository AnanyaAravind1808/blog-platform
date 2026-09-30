import { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load profile'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Your account information</p>
        </div>
      </div>

      <ErrorMessage
        message={error}
        onRetry={fetchProfile}
      />

      {!error && user && (
        <div className="profile-card">
          <div className="profile-field">
            <strong>Name</strong>
            <span>{user.name}</span>
          </div>

          <div className="profile-field">
            <strong>Email</strong>
            <span>{user.email}</span>
          </div>

          <div className="profile-field">
            <strong>Member Since</strong>
            <span>
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}