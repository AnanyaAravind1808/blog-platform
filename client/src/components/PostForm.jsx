import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

export default function PostForm({ initialValues, onSubmit, submitLabel = 'Publish' }) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [category, setCategory] = useState(
  initialValues?.category || 'Technology'
);

const [tags, setTags] = useState(
  initialValues?.tags?.join(', ') || ''
);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length < 3 || trimmedTitle.length > 150) {
      newErrors.title = 'Title must be between 3 and 150 characters';
    }

    if (!trimmedContent) {
      newErrors.content = 'Content is required';
    } else if (trimmedContent.length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const tagList = tags
  .split(',')
  .map((tag) => tag.trim())
  .filter(Boolean);

await onSubmit({
  title: title.trim(),
  content: content.trim(),
  category,
  tags: tagList,
});
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={submitError} />

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your post"
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>
      <div className="form-group">
  <label htmlFor="category">Category</label>

  <select
    id="category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="Technology">Technology</option>
    <option value="Programming">Programming</option>
    <option value="Web Development">Web Development</option>
    <option value="Education">Education</option>
    <option value="Career">Career</option>
    <option value="Other">Other</option>
  </select>
</div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post here..."
        />
        {errors.content && <span className="field-error">{errors.content}</span>}
      </div>
      <div className="form-group">
  <label htmlFor="tags">Tags</label>

  <input
    id="tags"
    type="text"
    value={tags}
    onChange={(e) => setTags(e.target.value)}
    placeholder="React, Node.js, MongoDB"
  />

  <small className="form-help">
    Separate multiple tags with commas.
  </small>
</div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
