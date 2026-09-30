import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostForm from '../components/PostForm';

export default function CreatePost() {
  const navigate = useNavigate();

  const handleSubmit = async ({ title, content, category, tags }) => {
  const res = await api.post('/posts', {
    title,
    content,
    category,
    tags,
  });

  navigate(`/post/${res.data.post._id}`);
};

  return (
    <div className="page-container narrow">
      <h1>Create a New Post</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="Publish" />
    </div>
  );
}
