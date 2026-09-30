import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/posts/my-posts');
      setPosts(res.data.posts);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load your posts'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Posts</h1>
          <p>Posts you have created.</p>
        </div>

        <Link to="/create-post" className="btn btn-primary">
          Create Post
        </Link>
      </div>

      {loading && <LoadingSpinner label="Loading your posts..." />}

      <ErrorMessage
        message={error}
        onRetry={fetchMyPosts}
      />

      {!loading && !error && posts.length === 0 && (
        <div className="empty-state">
          <p>You haven't created any posts yet.</p>

          <Link to="/create-post" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
            />
          ))}
        </div>
      )}
    </div>
  );
}