import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/authApi';

export function Login() {
  const [username, setUsername] = useState('240408037@st.biruni.edu.tr');
  const [password, setPassword] = useState('demo123456');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve destination from ProtectedRoute state or default to Home
  const destination = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const user = await login(username, password);
      loginUser(user);
      // Redirect back without leaving /login in history stack
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Sign In to CampusShop</h1>
        <p className="login-subtitle">
          Please enter your university account credentials to access your protected shopping cart.
        </p>

        {errorMessage && (
          <div className="alert-error" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-username">Username (Student Email):</label>
            <input
              id="login-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password:</label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="login-demo-box">
          <p>
            <strong>Demo Credentials:</strong>
          </p>
          <code>Username: 240408037@st.biruni.edu.tr</code>
          <br />
          <code>Password: demo123456</code>
        </div>
      </div>
    </div>
  );
}
