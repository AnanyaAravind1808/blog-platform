import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ConfirmModal from './ConfirmModal';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentSection({ postId }) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data.comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError('');

    if (!content.trim()) {
      setFieldError('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, { content: content.trim() });
      setComments((prev) => [res.data.comment, ...prev]);
      setContent('');
    } catch (err) {
      setFieldError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    const id = deleteTargetId;
    setDeleteTargetId(null);
    setDeleteError('');
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  return (
    <section className="comment-section">
      <h3>Comments {comments.length > 0 && `(${comments.length})`}</h3>

      <ErrorMessage message={deleteError} />

      {isAuthenticated ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
          />
          {fieldError && <span className="field-error">{fieldError}</span>}
          <button type="submit" className="btn btn-primary btn-small" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="comment-login-hint">Please log in to leave a comment.</p>
      )}

      {loading && <LoadingSpinner label="Loading comments..." />}
      <ErrorMessage message={error} onRetry={fetchComments} />

      {!loading && !error && comments.length === 0 && (
        <p className="empty-state">No comments yet. Be the first to comment!</p>
      )}

      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment._id} className="comment-item">
            <div className="comment-meta">
              <strong>{comment.author?.name || 'Unknown user'}</strong>
              <span>{formatDate(comment.createdAt)}</span>
            </div>
            <p>{comment.content}</p>
            {user && comment.author?._id === user.id && (
              <button
                type="button"
                className="btn btn-link btn-danger-text"
                onClick={() => setDeleteTargetId(comment._id)}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete comment?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </section>
  );
}
