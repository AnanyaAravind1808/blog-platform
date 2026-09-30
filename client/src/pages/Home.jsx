import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};

      // Search filter
      if (search.trim()) {
        params.search = search.trim();
      }

      // Category filter
      if (category) {
        params.category = category;
      }

      const res = await api.get('/posts', {
        params,
      });

      setPosts(res.data.posts);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load posts'
      );
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleClear = () => {
    setSearch('');
    setCategory('');
  };

  return (
    <div className="page-container">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Latest Posts</h1>
        </div>

        {isAuthenticated && (
          <Link to="/create-post" className="btn btn-primary">
            Create Post
          </Link>
        )}
      </div>

      {/* Search and Category Filter */}
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Programming">Programming</option>
          <option value="Web Development">Web Development</option>
          <option value="Education">Education</option>
          <option value="Career">Career</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" className="btn btn-primary">
          Search
        </button>

        {(search || category) && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </form>

      {/* Loading */}
      {loading && <LoadingSpinner label="Loading posts..." />}

      {/* Error */}
      <ErrorMessage
        message={error}
        onRetry={fetchPosts}
      />

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <p className="empty-state">
          {search && category
            ? `No posts found for "${search}" in ${category}.`
            : search
            ? `No posts found for "${search}".`
            : category
            ? `No posts found in ${category}.`
            : 'No posts yet. Be the first to write one!'}
        </p>
      )}

      {/* Posts */}
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