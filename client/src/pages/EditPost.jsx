import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await api.get(`/posts/${id}`);

        if (!isMounted) return;

        if (res.data.post.author?._id !== user?.id) {
          navigate(`/post/${id}`, { replace: true });
          return;
        }

        setPost(res.data.post);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id, user, navigate]);

  const handleSubmit = async ({
    title,
    content,
    category,
    tags,
  }) => {
    await api.put(`/posts/${id}`, {
      title,
      content,
      category,
      tags,
    });

    navigate(`/post/${id}`);
  };

  if (loading) {
    return <LoadingSpinner label="Loading post..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!post) {
    return null;
  }

  return (
    <div className="page-container narrow">
      <h1>Edit Post</h1>

      <PostForm
        initialValues={{
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
        }}
        onSubmit={handleSubmit}
        submitLabel="Update"
      />
    </div>
  );
}