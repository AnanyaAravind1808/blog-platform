import { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDeletePost = async (postId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this post?'
  );

  if (!confirmed) {
    return;
  }

  try {
    await api.delete(`/admin/posts/${postId}`);

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post._id !== postId)
    );

    setStats((currentStats) => ({
      ...currentStats,
      posts: currentStats.posts - 1,
    }));
  } catch (err) {
    setError(err.message || 'Failed to delete post');
  }
};
  const fetchStats = async () => {
    setLoading(true);
    setError('');

    try {
  const res = await api.get('/admin/stats');
  setStats(res.data.stats);

  const usersRes = await api.get('/admin/users');
  setUsers(usersRes.data.users);
  const postsRes = await api.get('/admin/posts');
setPosts(postsRes.data.posts);
}catch (err) {
      setError(
        err.message || 'Failed to load admin dashboard'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner label="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
  <div>
    <h1>Admin Dashboard</h1>
    <p>Manage your blog platform.</p>
  </div>

  <button
    type="button"
    className="btn btn-small"
    onClick={fetchStats}
  >
    Refresh
  </button>
</div>
      <ErrorMessage
        message={error}
        onRetry={fetchStats}
      />

      {!error && stats && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <h2>{stats.users}</h2>
            <p>Total Users</p>
          </div>

          <div className="admin-stat-card">
            <h2>{stats.posts}</h2>
            <p>Total Posts</p>
          </div>
        </div>
      )}
      {!error && users.length > 0 && (
  <div className="admin-section">
    <h2>All Users</h2>

    <div className="admin-user-list">
      {users.map((user) => (
        <div className="admin-user-card" key={user._id}>
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <span className="admin-user-role">
            {user.role}
          </span>
        </div>
      ))}
    </div>
  </div>
)}
{!error && posts.length > 0 && (
  <div className="admin-section">
    <h2>All Posts</h2>

    <div className="admin-post-list">
      {posts.map((post) => (
        <div className="admin-post-card" key={post._id}>
          <div>
            <h3>{post.title}</h3>

            <p>
              Author: {post.author?.name || 'Unknown'}
            </p>

            <p>
              Category: {post.category || 'Uncategorized'}
            </p>
            <button
  className="admin-delete-button"
  onClick={() => handleDeletePost(post._id)}
>
  Delete Post
</button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
}