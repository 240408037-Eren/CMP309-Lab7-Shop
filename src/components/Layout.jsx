import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function Layout() {
  const [theme, setTheme] = useLocalStorage('theme_mode', 'light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`app-root theme-${theme}`}>
      <NavBar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer-container">
        <div className="footer-inner">
          <p>© 2026 CampusShop • CMP309 Web Programming Assignment 7</p>
          <p className="student-tag">Eren Ozan Yazar (240408037)</p>
        </div>
      </footer>
    </div>
  );
}
