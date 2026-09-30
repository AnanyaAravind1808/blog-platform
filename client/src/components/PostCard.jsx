import { Link } from 'react-router-dom';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getPreview(content, maxLength = 160) {
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength).trim()}...`;
}

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <h2 className="post-card-title">{post.title}</h2>

      <div className="post-card-meta">
        <span>By {post.author?.name || 'Unknown author'}</span>
        <span>&bull;</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>

      <div className="post-card-category">
        Category: {post.category}
      </div>

      {post.tags?.length > 0 && (
        <div className="post-card-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="post-card-preview">{getPreview(post.content)}</p>

      <Link
        to={`/post/${post._id}`}
        className="btn btn-primary btn-small"
      >
        Read More
      </Link>
    </article>
  );
}