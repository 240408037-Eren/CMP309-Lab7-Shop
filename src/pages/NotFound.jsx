import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="not-found-page">
      <div className="status-box status-error">
        <h1 className="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page or route you requested does not exist on this server.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
