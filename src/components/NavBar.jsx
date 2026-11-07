import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartStore, selectTotalItems } from '../store/cartStore';

export function NavBar({ theme, toggleTheme }) {
  const { user, logoutUser } = useAuth();
  const totalCartItems = useCartStore(selectTotalItems);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <NavLink to="/" className="brand-logo">
          <span className="brand-icon">🛍️</span>
          <span className="brand-name">CampusShop</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Cart
            {totalCartItems > 0 && (
              <span className="cart-badge" aria-label={`${totalCartItems} items in cart`}>
                {totalCartItems}
              </span>
            )}
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          {user ? (
            <div className="auth-status">
              <span className="user-greeting" title={user.username}>
                👤 {user.username.split('@')[0]}
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={logoutUser}
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'btn btn-primary btn-sm active' : 'btn btn-primary btn-sm'
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
