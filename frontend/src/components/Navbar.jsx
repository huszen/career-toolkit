import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPage('landing');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <nav className="h-17 bg-app-bg px-6 flex items-center justify-between border-b border-border">
      {/* Brand Logo */}
      <div
        className="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent cursor-pointer"
        onClick={() => setCurrentPage('landing')}
      >
        Career Toolkit
      </div>

      {/* Navbar Actions */}
      <div className="flex items-center gap-4 text-sm">
        {/* Navigation Link */}
        <button
          onClick={() => setCurrentPage('cover-letter')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            currentPage === 'cover-letter'
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Cover Letter Tool
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-border" />

        {currentUser ? (
          <div className="flex items-center gap-4">
            <span className="text-text-muted hidden md:inline text-xs">
              {currentUser.email}
            </span>

            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
                currentPage === 'dashboard'
                  ? 'bg-primary text-text-main'
                  : 'bg-input-bg text-text-muted hover:bg-card-bg border border-border'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-danger font-medium transition text-xs"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCurrentPage('login')}
              className="text-text-muted hover:text-text-main px-3 py-1.5 font-medium transition"
            >
              Log In
            </button>

            <button
              onClick={() => setCurrentPage('signup')}
              className="bg-primary hover:bg-primary-hover text-text-main px-3.5 py-1.5 rounded-lg font-medium transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}