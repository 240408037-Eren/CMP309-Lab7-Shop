import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Welcome to CampusShop</h1>
        <p className="hero-subtitle">
          A multi-page React application demonstrating client-side routing, URL state filtering,
          Context authentication, and Zustand cart management.
        </p>
        <div className="hero-cta">
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Catalogue →
          </Link>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>URL-Driven Filtering</h3>
          <p>
            Filter products by title and category seamlessly. All search parameters are preserved
            in the URL query string for direct bookmarking and link sharing.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🛒</div>
          <h3>Zustand Cart Store</h3>
          <p>
            Frequently updated cart state managed with Zustand. Item counts and total price are
            purely derived, with automatic outside-React localStorage synchronization.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Protected Routes & Auth</h3>
          <p>
            Context API paired with useReducer handles auth sessions. Protected routes redirect
            unauthenticated visitors and return them back post-login.
          </p>
        </div>
      </section>
    </div>
  );
}
