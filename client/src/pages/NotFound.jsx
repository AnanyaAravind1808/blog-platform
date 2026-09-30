import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn btn-primary">
        Back Home
      </Link>
    </div>
  );
}
