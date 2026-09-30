import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import CommentSection from '../components/CommentSection';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.post);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setDeleteError('');
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading post..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPost} />;
  if (!post) return null;

  const isOwner = user && post.author?._id === user.id;

  return (
    <div className="page-container narrow">
      <Link to="/" className="back-link">
        &larr; Back to all posts
      </Link>

      <ErrorMessage message={deleteError} />

      <article className="post-details">
        <h1>{post.title}</h1>
        <div className="post-card-meta">
          <span>By {post.author?.name || 'Unknown author'}</span>
          <span>&bull;</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="post-category">
  Category: {post.category}
</div>
{post.tags?.length > 0 && (
  <div className="post-tags">
    {post.tags.map((tag) => (
      <span key={tag} className="tag">
        #{tag}
      </span>
    ))}
  </div>
)}

        {isOwner && (
          <div className="post-owner-actions">
            <Link to={`/edit-post/${post._id}`} className="btn btn-secondary btn-small">
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-danger btn-small"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        )}

        <div className="post-content">
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>

      <CommentSection postId={post._id} />

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete this post?"
        message="This will permanently delete the post and all of its comments."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
